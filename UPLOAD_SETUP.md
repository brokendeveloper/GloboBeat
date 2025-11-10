# GloboBeat Upload Feature - Setup Guide

Este guia explica como configurar e usar o sistema de upload de arquivos do GloboBeat, que permite enviar arquivos de áudio/vídeo do frontend para o backend, que faz upload para o AWS S3.

## Arquitetura Implementada

```
Frontend (Next.js) → Backend API (Node.js/Express) → AWS S3
                            ↓
                      PostgreSQL (metadata)
```

## Arquivos Criados/Modificados

### Backend

1. **API Server** (`backend/api/server.js`)
   - Servidor Express com endpoints para upload
   - Integração com AWS S3 usando `@aws-sdk/client-s3`
   - Processamento de multipart/form-data com `multer`
   - Salvamento de metadados no PostgreSQL

2. **Database Migration** (`backend/api/migrations/001_create_uploads_table.sql`)
   - Tabela `uploads` para rastrear arquivos enviados
   - Campos: id, filename, original_filename, s3_key, file_size, mime_type, status, created_at

3. **Migration Script** (`backend/api/scripts/migrate.js`)
   - Script para rodar migrations automaticamente

4. **Package.json** (`backend/api/package.json`)
   - Novas dependências: express, multer, @aws-sdk/client-s3, cors, uuid, dotenv

5. **Dockerfile** (`backend/api/Dockerfile`)
   - Atualizado para rodar migrations antes de iniciar o servidor

### Frontend

6. **Upload Page** (`frontend/src/app/page_upload/page.tsx`)
   - Interface de upload com feedback visual
   - Progress bar durante upload
   - Mensagens de sucesso/erro
   - Comunicação com API backend

### Infraestrutura

7. **Docker Compose** (`backend/infra/docker-compose.yml`)
   - Adicionado serviço RabbitMQ (para uso futuro)
   - Volume para persistência do RabbitMQ

8. **Environment Variables** (`backend/infra/.env` e `.env.example`)
   - Variáveis para AWS S3
   - Variáveis para RabbitMQ

## Configuração

### 1. Configurar Credenciais AWS

Edite o arquivo `backend/infra/.env` e adicione suas credenciais AWS:

```bash
AWS_ACCESS_KEY_ID=sua_access_key_aqui
AWS_SECRET_ACCESS_KEY=sua_secret_key_aqui
AWS_REGION=us-east-1
S3_BUCKET_NAME=nome-do-seu-bucket
```

**Importante:** Certifique-se de que:
- O bucket S3 existe na região especificada
- As credenciais têm permissão para `s3:PutObject` no bucket
- O bucket está configurado com as políticas de acesso adequadas

### 2. Criar o Bucket S3 (se necessário)

No AWS Console:
1. Acesse S3 → Create bucket
2. Nome: `globobeat-uploads` (ou outro de sua escolha)
3. Região: `us-east-1` (ou conforme configurado)
4. Block Public Access: Mantenha habilitado (recomendado)
5. Create bucket

### 3. Configurar IAM Permissions

Suas credenciais AWS precisam ter a seguinte política:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::globobeat-uploads/*"
    }
  ]
}
```

## Executar o Sistema

### 1. Iniciar Backend (com Docker)

```bash
cd backend/infra
docker-compose up --build
```

Isso irá:
- Iniciar PostgreSQL
- Iniciar RabbitMQ (porta 5672 + management UI em 15672)
- Construir e iniciar a API
- Rodar migrations automaticamente
- API disponível em http://localhost:3000

### 2. Iniciar Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponível em http://localhost:3001 (ou porta configurada)

## Endpoints da API

### POST /api/upload

Faz upload de um arquivo para o S3.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData com campo `file`

**Response (Success):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "upload": {
    "id": 1,
    "filename": "video.mp4",
    "s3Key": "uploads/uuid-timestamp-video.mp4",
    "size": 1024000,
    "status": "uploaded",
    "uploadedAt": "2025-01-30T10:00:00.000Z"
  }
}
```

### GET /api/upload/:id

Obtém informações sobre um upload específico.

**Response:**
```json
{
  "success": true,
  "upload": {
    "id": 1,
    "filename": "video_sanitized.mp4",
    "original_filename": "video.mp4",
    "s3_key": "uploads/uuid-timestamp-video.mp4",
    "file_size": 1024000,
    "mime_type": "video/mp4",
    "status": "uploaded",
    "created_at": "2025-01-30T10:00:00.000Z"
  }
}
```

### GET /api/uploads

Lista todos os uploads (últimos 100).

**Response:**
```json
{
  "success": true,
  "uploads": [...],
  "count": 10
}
```

### GET /health

Health check do serviço.

**Response:**
```json
{
  "status": "OK",
  "service": "GloboBeat API"
}
```

## Como Usar no Frontend

1. Acesse http://localhost:3001/page_upload
2. Clique em "Selecionar arquivos" ou arraste arquivos
3. Selecione um arquivo de áudio ou vídeo
4. Clique em "Fazer Upload"
5. Acompanhe o progresso
6. Receba confirmação de sucesso

## Tipos de Arquivo Aceitos

- **Áudio:** MP3, WAV, OGG, AAC
- **Vídeo:** MP4, MPEG, QuickTime, AVI

Limite de tamanho: **100MB por arquivo**

## Estrutura de Armazenamento S3

Os arquivos são salvos com o padrão:

```
uploads/{uuid}-{timestamp}-{filename_sanitizado}
```

Exemplo:
```
uploads/a1b2c3d4-1706621234567-meu_video.mp4
```

## Troubleshooting

### Erro: "Invalid file type"
- Verifique se o arquivo é de áudio ou vídeo
- Confirme que o MIME type é suportado

### Erro: "Failed to upload file" / AWS errors
- Verifique suas credenciais AWS no `.env`
- Confirme que o bucket existe
- Verifique as permissões IAM
- Confira os logs do container: `docker-compose logs api`

### Erro de conexão com banco
- Aguarde o PostgreSQL inicializar completamente
- Verifique logs: `docker-compose logs db`
- O script de startup aguarda 5 segundos antes de rodar migrations

### Frontend não consegue conectar à API
- Confirme que a API está rodando em http://localhost:3000
- Verifique se CORS está habilitado (já configurado no server.js)
- Se frontend roda em porta diferente, atualize a URL em `page_upload/page.tsx`

## Próximos Passos

Este sistema implementa apenas a parte de **upload (frontend → backend → S3)**. Próximas implementações:

1. **Workers de processamento:**
   - worker-pre: pré-processamento de áudio
   - worker-rec: identificação de trilhas

2. **Integração com RabbitMQ:**
   - Publicar mensagens após upload
   - Workers consumirem fila de processamento

3. **Autenticação:**
   - JWT tokens
   - Associar uploads a usuários

4. **Features adicionais:**
   - Download de arquivos do S3
   - Deletar uploads
   - Processamento em lote
   - WebSocket para updates em tempo real

## Notas de Segurança

- **NUNCA** commite credenciais AWS no Git
- Use variáveis de ambiente para dados sensíveis
- Configure bucket policies adequadamente
- Valide tipos de arquivo no backend
- Implemente rate limiting em produção
- Use signed URLs para downloads seguros

## Suporte

Para problemas ou dúvidas, consulte:
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Express.js Docs](https://expressjs.com/)
- [Multer Documentation](https://github.com/expressjs/multer)
