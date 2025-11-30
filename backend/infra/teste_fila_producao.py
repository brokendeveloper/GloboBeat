import pika
import json
import uuid

# Configurações (Mesmas do .env)
RABBITMQ_HOST = 'localhost'
RABBITMQ_USER = 'guest'
RABBITMQ_PASS = 'guest'
FILA_NOME = 'preprocessing'

def enviar_teste():
    credentials = pika.PlainCredentials(RABBITMQ_USER, RABBITMQ_PASS)
    connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST, credentials=credentials))
    channel = connection.channel()

    # Garante que a fila existe
    channel.queue_declare(queue=FILA_NOME, durable=True)

    # Simula o payload que o seu uploadService.ts vai enviar
    # IMPORTANTE: O 'file_key' deve ser um arquivo que EXISTE no seu Bucket S3 real
    # OU, se você quiser testar local sem S3, precisaremos de um ajuste rápido no wrapper.
    mensagem = {
        "job_id": str(uuid.uuid4()),
        "file_key": "teste.mp3"  # <--- Nome do arquivo no S3 (ou na pasta local mapeada)
    }

    channel.basic_publish(
        exchange='',
        routing_key=FILA_NOME,
        body=json.dumps(mensagem),
        properties=pika.BasicProperties(
            delivery_mode=2,  # Mensagem persistente
        )
    )

    print(f" [x] Mensagem enviada! Job ID: {mensagem['job_id']}")
    print(f" [x] Arquivo solicitado: {mensagem['file_key']}")
    connection.close()

if __name__ == "__main__":
    enviar_teste()