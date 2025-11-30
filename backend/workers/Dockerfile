FROM python:3.10-slim

# 1. Instalar dependências de sistema
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 2. Configurar diretório de trabalho
WORKDIR /app

# 3. Baixar Bibliotecas Externas (Audfprint e ACRCloud SDK)
# Clona Audfprint
RUN git clone https://github.com/dpwe/audfprint.git /app/audfprint_lib

# Clona ACRCloud SDK e configura os arquivos para Linux (CORRIGIDO: Caminho profundo)
RUN git clone https://github.com/acrcloud/acrcloud_sdk_python.git /tmp/acr_sdk && \
    mkdir -p /app/acrcloud_lib/acrcloud && \
    cp /tmp/acr_sdk/linux/x86-64/python3/acrcloud/__init__.py /app/acrcloud_lib/acrcloud/ && \
    cp /tmp/acr_sdk/linux/x86-64/python3/acrcloud/recognizer.py /app/acrcloud_lib/acrcloud/ && \
    cp /tmp/acr_sdk/linux/x86-64/python3/acrcloud/acrcloud_extr_tool.so /app/acrcloud_lib/acrcloud/ && \
    rm -rf /tmp/acr_sdk

# 4. Instalar dependências Python
# Inclui 'psutil', 'docopt', 'joblib' para audfprint
RUN pip install --no-cache-dir \
    pika \
    boto3 \
    psycopg2-binary \
    python-dotenv \
    requests \
    pydub \
    pyacoustid \
    numpy \
    scipy \
    matplotlib \
    docopt \
    joblib \
    psutil

# 5. Copiar código do projeto
COPY . .

# 6. Configurar PYTHONPATH para achar as libs que baixamos manualmente
ENV PYTHONPATH="${PYTHONPATH}:/app/audfprint_lib:/app/acrcloud_lib"

# 7. Comando padrão
CMD ["python", "worker_wrapper.py"]