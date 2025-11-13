import os
import json
import pika
import boto3
import tempfile
import logging
from datetime import datetime
from pydub import AudioSegment
from pydub.silence import detect_nonsilent
import psycopg2
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] [WORKER-PRE] %(levelname)s: %(message)s'
)
logger = logging.getLogger(__name__)

# env variables
RABBITMQ_HOST = os.getenv('RABBITMQ_HOST', 'localhost')
RABBITMQ_USER = os.getenv('RABBITMQ_USER', 'guest')
RABBITMQ_PASS = os.getenv('RABBITMQ_PASS', 'guest')
AWS_ACCESS_KEY = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
S3_BUCKET = os.getenv('S3_BUCKET')
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_PORT = os.getenv('DB_PORT', '5432')
DB_NAME = os.getenv('DB_NAME', 'globobeat')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD')

# Inicializa AWS S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY,
    region_name=AWS_REGION
)

# Database connection
def get_db_connection():
    return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )


def extract_audio_from_video(video_path, output_path):
    """Extração de audio de arquivo .mp4"""
    logger.info(f"Extraindo audio de {video_path}")

    try:
        # carrega vídeo e extrai audio
        audio = AudioSegment.from_file(video_path)

        # exporta para WAV para melhor extração
        audio.export(output_path, format="wav")
        logger.info(f"Audio extraído com sucesso para {output_path}")
        return True
    except Exception as e:
        logger.error(f"Error na extração do audio: {str(e)}")
        return False


def detect_music_segments(audio_path, min_silence_len=1000, silence_thresh=-40):
    """
    Detecta segmentos de audio em potencial(potentiais musicas)
    Retorna lista de tuplas: [(start_ms, end_ms), ...]
    """
    logger.info(f"Detectando segmentos musicais em {audio_path}")

    try:
        audio = AudioSegment.from_wav(audio_path)

        # Detect non-silent segments
        nonsilent_segments = detect_nonsilent(
            audio,
            min_silence_len=min_silence_len,
            silence_thresh=silence_thresh
        )

        logger.info(f"Encontrado {len(nonsilent_segments)} segmentos")
        return nonsilent_segments
    except Exception as e:
        logger.error(f"Error na detecção de segmentos: {str(e)}")
        return []

def split_audio_into_segments(audio_path, segments, output_dir, max_segment_duration=30000):
    """
    Divide o áudio em segmentos e salva como arquivos separados.
    RRetorna uma lista dos caminhos dos arquivos de segmento com seus
    respectivos registros de data e hora.
    """
    logger.info(f"Divindindo audio em {len(segments)} segmentos")

    try:
        audio = AudioSegment.from_wav(audio_path)
        segment_files = []

        for idx, (start_ms, end_ms) in enumerate(segments):
            # Limit segment duration for API processing
            if end_ms - start_ms > max_segment_duration:
                end_ms = start_ms + max_segment_duration

            segment = audio[start_ms:end_ms]
            segment_filename = f"segmento_{idx}_{start_ms}_{end_ms}.wav"
            segment_path = os.path.join(output_dir, segment_filename)

            segment.export(segment_path, format="wav")

            segment_files.append({
                'file_path': segment_path,
                'start_ms': start_ms,
                'end_ms': end_ms,
                'duration_ms': end_ms - start_ms
            })

        logger.info(f"Criado {len(segment_files)} arquivos de segmento")
        return segment_files
    except Exception as e:
        logger.error(f"Error na divisão do audio: {str(e)}")
        return []

def upload_segment_to_s3(file_path, job_id, segment_index):
    """subindo audio para s3"""
    try:
        key = f"segmentos/{job_id}/segmento_{segment_index}.wav"
        s3_client.upload_file(file_path, S3_BUCKET, key)
        logger.info(f"Upando segmento para S3: {key}")
        return key
    except Exception as e:
        logger.error(f"Error durante upload para S3: {str(e)}")
        return None


def update_job_status(job_id, status, message=None):
    """atualiza status do job no banco de dados"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        if message:
            cursor.execute(
                "UPDATE jobs SET status = %s, updated_at = NOW(), error_message = %s WHERE id = %s",
                (status, message, job_id)
            )
        else:
            cursor.execute(
                "UPDATE jobs SET status = %s, updated_at = NOW() WHERE id = %s",
                (status, job_id)
            )

        conn.commit()
        cursor.close()
        conn.close()
        logger.info(f"atualização do {job_id} status para {status}")
    except Exception as e:
        logger.error(f"Error durante atualização do job status: {str(e)}")


def process_job(job_data):
    """função principal para processar job"""
    job_id = job_data['job_id']
    file_key = job_data['file_key']

    logger.info(f"Começando pre-processamento de job {job_id}")
    update_job_status(job_id, 'preprocessing')

    temp_dir = tempfile.mkdtemp()

    try:
        # Download de arquivos do S3
        video_path = os.path.join(temp_dir, 'input_video.mp4')
        logger.info(f"Downloading file from S3: {file_key}")
        s3_client.download_file(S3_BUCKET, file_key, video_path)

        # Extracão de audio
        audio_path = os.path.join(temp_dir, 'extracted_audio.wav')
        if not extract_audio_from_video(video_path, audio_path):
            raise Exception("Falha ao extrair audio do vídeo")

        # Detecção de segmentos musicais
        segments = detect_music_segments(audio_path)

        if not segments:
            logger.warning(f"Sem segmentos musicais detectados no job {job_id}")
            update_job_status(job_id, 'completed', 'No music detected')
            return

        # recorte de audios em segmentos
        segments_dir = os.path.join(temp_dir, 'segments')
        os.makedirs(segments_dir, exist_ok=True)
        segment_files = split_audio_into_segments(audio_path, segments, segments_dir)

        # Carregar segmentos e preparar trabalhos de reconhecimento
        recognition_jobs = []
        for idx, segment_info in enumerate(segment_files):
            s3_key = upload_segment_to_s3(segment_info['file_path'], job_id, idx)

            if s3_key:
                recognition_jobs.append({
                    'job_id': job_id,
                    'segment_index': idx,
                    's3_key': s3_key,
                    'start_ms': segment_info['start_ms'],
                    'end_ms': segment_info['end_ms'],
                    'duration_ms': segment_info['duration_ms']
                })

        # Enviar segmentos para fila de reconhecimento
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=RABBITMQ_HOST,
                credentials=pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
            )
        )
        channel = connection.channel()
        channel.queue_declare(queue='recognition', durable=True)

        for rec_job in recognition_jobs:
            channel.basic_publish(
                exchange='',
                routing_key='recognition',
                body=json.dumps(rec_job),
                properties=pika.BasicProperties(delivery_mode=2)
            )

        connection.close()

        logger.info(f"Enviado {len(recognition_jobs)} segmentos para reconhecimento")
        update_job_status(job_id, 'recognizing')

    except Exception as e:
        logger.error(f"Error no preprocessamento do job {job_id}: {str(e)}")
        update_job_status(job_id, 'failed', str(e))

    finally:
        # Cleanup temp files
        import shutil
        shutil.rmtree(temp_dir, ignore_errors=True)

def callback(ch, method, properties, body):
    """Callback do RabbitMQ para tarefas recebidas"""
    try:
        job_data = json.loads(body)
        logger.info(f"Job recebido: {job_data['job_id']}")

        process_job(job_data)

        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        logger.error(f"Error no callback: {str(e)}")
        ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)


def main():
    """Começando worker"""
    logger.info("Starting Worker-Pre...")

    # Connect to RabbitMQ
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host=RABBITMQ_HOST,
            credentials=pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
        )
    )
    channel = connection.channel()

    # Declare queue
    channel.queue_declare(queue='preprocessing', durable=True)
    channel.basic_qos(prefetch_count=1)

    # Start consuming
    channel.basic_consume(queue='preprocessing', on_message_callback=callback)

    logger.info("Worker-Pre ready. Waiting for jobs...")
    channel.start_consuming()


if __name__ == '__main__':
    main()
