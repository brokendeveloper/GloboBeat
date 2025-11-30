import pika
import json
import os
import sys
import subprocess
import shutil
import boto3
import psycopg2
from dotenv import load_dotenv

# --- CORREÇÃO DE LOGS (DOCKER) ---
# Força o Python a imprimir os logs imediatamente, sem buffer
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

# Carrega variáveis do .env
load_dotenv(os.path.join(os.path.dirname(__file__), '../../infra/.env'))

# --- CONFIGURAÇÕES ---
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
RABBITMQ_USER = os.getenv('RABBITMQ_USER', 'guest')
RABBITMQ_PASS = os.getenv('RABBITMQ_PASS', 'guest')
S3_BUCKET = os.getenv('S3_BUCKET', 'bucket-placeholder')
AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_NAME = os.getenv('DB_NAME', 'globobeat')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD')

# --- CLIENTES ---
# Inicializa S3 apenas se houver credenciais, senão deixa None (para evitar erro na inicialização)
s3_client = None
if AWS_ACCESS_KEY and AWS_SECRET_KEY:
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name=AWS_REGION
        )
    except Exception as e:
        print(f"⚠️ Aviso: Não foi possível inicializar cliente S3: {e}")


def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST, database=DB_NAME, user=DB_USER, password=DB_PASSWORD
    )


def salvar_no_banco(job_id, resultado):
    """Salva o resultado JSON no banco de dados"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # --- CORREÇÃO FK VIOLATION ---
        # Garante que o Job existe antes de salvar o resultado.
        # Se o job_id não existir na tabela 'jobs', cria um placeholder.
        cursor.execute("""
            INSERT INTO jobs (id, status) VALUES (%s, 'processing')
            ON CONFLICT (id) DO NOTHING
        """, (job_id,))
        # -----------------------------

        reconhecido = resultado.get('reconhecido', False)
        musica = {}
        # Pega a primeira música da trilha se houver, para preencher os campos principais
        if resultado.get('trilha_sonora') and len(resultado['trilha_sonora']) > 0:
            musica = resultado['trilha_sonora'][0]
        elif resultado.get('musica'):
            musica = resultado.get('musica')

        cursor.execute("""
            INSERT INTO music_detections 
            (job_id, recognized, confidence, title, artist, album, fonte, score, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
        """, (
            job_id,
            reconhecido,
            resultado.get('confianca', 'N/A'),
            musica.get('titulo'),
            musica.get('artista'),
            musica.get('album'),
            musica.get('fonte', 'Desconhecida'),
            musica.get('score', 0)
        ))

        # Atualiza status do job
        cursor.execute("UPDATE jobs SET status = 'completed', updated_at = NOW() WHERE id = %s", (job_id,))

        conn.commit()
        cursor.close()
        conn.close()
        print(f"✅ [JOB {job_id}] Resultados salvos no banco.")
    except Exception as e:
        print(f"❌ Erro ao salvar no banco: {e}")


def processar_mensagem(ch, method, properties, body):
    data = json.loads(body)
    job_id = data.get('job_id')
    file_key = data.get('file_key')  # Ex: uploads/video.mp4 ou apenas video.mp4

    print(f"\n🚀 [JOB {job_id}] Recebido! Arquivo solicitado: {file_key}")

    local_processing_path = f"/tmp/{job_id}_{os.path.basename(file_key)}"

    # Caminho mapeado do Docker (Sua pasta local 1_entrada_midia)
    # Se o arquivo estiver aqui, ignoramos o S3
    possible_local_source = os.path.join("/app/entrada_midia", os.path.basename(file_key))

    arquivo_pronto = False

    try:
        # 1. Tenta pegar Localmente (Prioridade para Testes)
        if os.path.exists(possible_local_source):
            print(f"   📂 Modo Local Detectado: Copiando de {possible_local_source}")
            shutil.copy(possible_local_source, local_processing_path)
            arquivo_pronto = True

        # 2. Se não achou local, tenta baixar do S3
        elif s3_client:
            print(f"   ☁️  Modo S3: Tentando baixar do Bucket {S3_BUCKET}...")
            s3_client.download_file(S3_BUCKET, file_key, local_processing_path)
            arquivo_pronto = True
        else:
            print(f"❌ Erro: Arquivo não encontrado localmente em {possible_local_source} e S3 não configurado.")

        if arquivo_pronto:
            # 3. Chama o script Python de reconhecimento (main.py)
            script_path = os.path.join(os.path.dirname(__file__), "python_service/main.py")

            print(f"⚙️  Executando reconhecimento...")
            processo = subprocess.run(
                ['python3', script_path, local_processing_path],
                capture_output=True,
                text=True
            )

            if processo.returncode != 0:
                print(f"❌ Erro no script interno: {processo.stderr}")
            else:
                # 4. Processa Output
                output_json = processo.stdout
                try:
                    resultado = json.loads(output_json)
                    qtd = resultado.get('qtd_musicas', 0)
                    print(f"✅ Reconhecimento concluído: {qtd} música(s) encontrada(s).")
                    salvar_no_banco(job_id, resultado)
                except json.JSONDecodeError:
                    print(f"❌ Erro: O script não retornou um JSON válido.")
                    print(f"Raw Output: {output_json}")

    except Exception as e:
        print(f"❌ Erro fatal no Wrapper: {e}")

    finally:
        # Limpeza
        if os.path.exists(local_processing_path):
            os.remove(local_processing_path)
        ch.basic_ack(delivery_tag=method.delivery_tag)


def main():
    print(" [*] Wrapper Worker Iniciado (Modo Híbrido S3/Local). Aguardando jobs...")
    while True:
        try:
            connection = pika.BlockingConnection(
                pika.ConnectionParameters(host=RABBITMQ_HOST,
                                          credentials=pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS))
            )
            channel = connection.channel()
            channel.queue_declare(queue='preprocessing', durable=True)
            channel.basic_qos(prefetch_count=1)
            channel.basic_consume(queue='preprocessing', on_message_callback=processar_mensagem)
            channel.start_consuming()
        except Exception as e:
            print(f"Erro conexão RabbitMQ: {e}. Retentando em 5s...")
            import time
            time.sleep(5)


if __name__ == '__main__':
    main()