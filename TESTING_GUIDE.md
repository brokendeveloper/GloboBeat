# Guia de Testes - GloboBeat Upload System

Este guia mostra como testar o fluxo completo de upload: Frontend → Backend → AWS S3 → PostgreSQL

## 📋 Pré-requisitos

✅ Credenciais AWS configuradas em `backend/infra/.env`
✅ Bucket S3 criado na AWS
✅ Docker e Docker Compose instalados
✅ Node.js instalado (para o frontend)

## 🚀 Passo 1: Verificar Configuração

### Verificar arquivo .env

```bash
cd backend/infra
cat .env
```

Deve conter:
```bash
# Database
POSTGRES_HOST=db
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=trilhas

# AWS S3 (suas credenciais reais)
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET_NAME=globobeat-uploads

# RabbitMQ
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=admin123
```

## 🐳 Passo 2: Iniciar o Backend

```bash
cd backend/infra
docker-compose down        # Limpar containers antigos
docker-compose up --build  # Construir e iniciar
```

**O que você deve ver:**
```
✓ Database connected
Running database migrations...
✓ 001_create_uploads_table.sql completed
All migrations completed successfully!
🚀 GloboBeat API Server Started
📡 Port: 3000
🪣 S3 Bucket: globobeat-uploads
```

### Verificar se a API está rodando

Em outro terminal:

```bash
curl http://localhost:3000/api/health
```

**Resposta esperada:**
```json
{
  "success": true,
  "service": "GloboBeat API",
  "timestamp": "2025-10-30T...",
  "uptime": 5.123
}
```

## 🧪 Passo 3: Testar Backend com cURL

### Teste 1: Upload de arquivo via cURL

```bash
# Crie um arquivo de teste
echo "Test audio content" > test-audio.mp3

# Faça upload
curl -X POST http://localhost:3000/api/upload -F "file=@test-audio.mp3" -H "Content-Type: multipart/form-data"
```

**Resposta esperada (sucesso):**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "upload": {
    "id": 1,
    "filename": "test-audio.mp3",
    "s3Key": "uploads/a1b2c3d4-1234567890-test-audio.mp3",
    "size": 18,
    "status": "uploaded",
    "uploadedAt": "2025-10-30T15:30:00.000Z"
  }
}
```

### Teste 2: Buscar upload por ID

```bash
curl http://localhost:3000/api/upload/1
```

**Resposta esperada:**
```json
{
  "success": true,
  "upload": {
    "id": 1,
    "filename": "test-audio_mp3",
    "original_filename": "test-audio.mp3",
    "s3_key": "uploads/...",
    "file_size": 18,
    "mime_type": "audio/mpeg",
    "status": "uploaded",
    "created_at": "2025-10-30T15:30:00.000Z"
  }
}
```

### Teste 3: Listar todos os uploads

```bash
curl http://localhost:3000/api/uploads
```

**Resposta esperada:**
```json
{
  "success": true,
  "uploads": [
    {
      "id": 1,
      "filename": "test-audio_mp3",
      "original_filename": "test-audio.mp3",
      "s3_key": "uploads/...",
      "file_size": 18,
      "mime_type": "audio/mpeg",
      "status": "uploaded",
      "created_at": "2025-10-30T15:30:00.000Z"
    }
  ],
  "count": 1,
  "pagination": {
    "limit": 100,
    "offset": 0
  }
}
```

## 🌐 Passo 4: Iniciar o Frontend

Em outro terminal:

```bash
cd frontend
npm install          # Se ainda não instalou
npm run dev
```

**O que você deve ver:**
```
▲ Next.js 15.x.x
- Local:        http://localhost:3001
- ready started server on 0.0.0.0:3001
```

## 🎨 Passo 5: Testar Upload via Interface

1. **Abrir o navegador**
   - Acesse: http://localhost:3001/page_upload

2. **Fazer upload de arquivo**
   - Clique em "Selecionar arquivos"
   - Escolha um arquivo de áudio ou vídeo
   - Clique em "Fazer Upload"

3. **Verificar feedback visual**
   - ✅ Progress bar deve aparecer
   - ✅ Mensagem de sucesso ao terminar
   - ✅ Nome do arquivo aparece na tela

## 🔍 Passo 6: Verificar no AWS Console

### No Console S3

1. Acesse: https://s3.console.aws.amazon.com/
2. Clique no bucket `globobeat-uploads`
3. Entre na pasta `uploads/`
4. Você deve ver seus arquivos:
   ```
   uploads/a1b2c3d4-1234567890-meu-arquivo.mp3
   uploads/b2c3d4e5-1234567891-outro-arquivo.mp4
   ```

### Verificar detalhes do arquivo

- Clique no arquivo
- Verifique:
  - ✅ Size (tamanho correto)
  - ✅ Content-Type (audio/mpeg, video/mp4, etc.)
  - ✅ Metadata (originalFilename, uploadId, uploadedAt)

## 🗄️ Passo 7: Verificar no Banco de Dados

### Conectar ao PostgreSQL

```bash
# Via Docker
docker exec -it trilhas_db psql -U user -d trilhas

# Ou usar ferramenta GUI (pgAdmin, DBeaver, etc.)
# Host: localhost
# Port: 5432
# Database: trilhas
# User: user
# Password: pass
```

### Consultar uploads

```sql
-- Ver todos os uploads
SELECT * FROM uploads ORDER BY created_at DESC;

-- Contar uploads
SELECT COUNT(*) FROM uploads;

-- Ver apenas os mais recentes
SELECT
  id,
  original_filename,
  file_size,
  status,
  created_at
FROM uploads
ORDER BY created_at DESC
LIMIT 10;
```

**Resultado esperado:**
```
 id | original_filename | file_size |  status  |        created_at
----+-------------------+-----------+----------+---------------------------
  1 | test-audio.mp3    |        18 | uploaded | 2025-10-30 15:30:00.000
  2 | meu-video.mp4     |   5242880 | uploaded | 2025-10-30 15:31:00.000
```

## 🧪 Passo 8: Testes de Validação

### Teste 1: Arquivo muito grande

```bash
# Criar arquivo de 150MB (acima do limite de 100MB)
dd if=/dev/zero of=large-file.bin bs=1M count=150

# Tentar upload
curl -X POST http://localhost:3000/api/upload \
  -F "file=@large-file.bin"
```

**Resposta esperada (erro):**
```json
{
  "success": false,
  "error": "File too large",
  "message": "File size exceeds the 100MB limit"
}
```

### Teste 2: Tipo de arquivo inválido

```bash
# Criar arquivo .txt
echo "text content" > test.txt

# Tentar upload
curl -X POST http://localhost:3000/api/upload \
  -F "file=@test.txt"
```

**Resposta esperada (erro):**
```json
{
  "success": false,
  "error": "Invalid file type",
  "message": "Invalid file type: text/plain. Only audio and video files are allowed."
}
```

### Teste 3: Sem arquivo

```bash
curl -X POST http://localhost:3000/api/upload
```

**Resposta esperada (erro):**
```json
{
  "success": false,
  "error": "No file uploaded"
}
```

## 📊 Passo 9: Verificar Logs

### Logs do Backend

```bash
cd backend/infra
docker-compose logs -f api
```

**O que procurar:**
```
✓ POST /api/upload 201 - 1234ms
✓ File uploaded to S3: uploads/...
✓ Upload record created with ID: 1
```

### Logs de erro (se houver problemas)

```bash
# Ver apenas erros
docker-compose logs api | grep -i error

# Ver logs do banco
docker-compose logs db
```

## ✅ Checklist de Verificação

Execute este checklist para garantir que tudo está funcionando:

- [ ] Backend iniciou sem erros
- [ ] Migrations executadas com sucesso
- [ ] Health check retorna 200 OK
- [ ] Upload via cURL funciona
- [ ] Arquivo aparece no S3
- [ ] Registro criado no PostgreSQL
- [ ] Frontend carrega sem erros
- [ ] Upload via interface funciona
- [ ] Progress bar aparece
- [ ] Mensagem de sucesso exibida
- [ ] Validações de arquivo funcionam
- [ ] Logs não mostram erros

## 🐛 Troubleshooting

### Problema: "Failed to upload file to S3"

**Possíveis causas:**
1. Credenciais AWS incorretas
2. Bucket não existe
3. Permissões IAM insuficientes
4. Região incorreta

**Solução:**
```bash
# Verificar credenciais
aws s3 ls s3://globobeat-uploads

# Testar upload manual
aws s3 cp test.txt s3://globobeat-uploads/test.txt
```

### Problema: "Database connection error"

**Solução:**
```bash
# Reiniciar banco
docker-compose restart db

# Verificar se está rodando
docker-compose ps
```

### Problema: "CORS error" no frontend

**Solução:**
- Verificar se backend está em http://localhost:3000
- CORS já está configurado em `src/app.ts`
- Se necessário, atualizar URL no frontend

### Problema: Frontend não conecta ao backend

**Verificar:**
```typescript
// Em frontend/src/app/page_upload/page.tsx
const response = await fetch('http://localhost:3000/api/upload', {
  // URL deve estar correta
```

## 📝 Logs Detalhados para Debug

### Habilitar logs verbosos

```bash
# No .env, adicionar:
NODE_ENV=development

# Reiniciar
docker-compose restart api
```

### Ver logs em tempo real

```bash
# Terminal 1: Backend logs
docker-compose logs -f api

# Terminal 2: Database logs
docker-compose logs -f db

# Terminal 3: Frontend logs (se rodando com npm)
# Os logs já aparecem no terminal onde rodou npm run dev
```

## 🎯 Teste End-to-End Completo

Execute este fluxo completo:

1. ✅ Limpar ambiente
```bash
docker-compose down -v
docker-compose up --build -d
```

2. ✅ Aguardar inicialização (30 segundos)

3. ✅ Testar health check
```bash
curl http://localhost:3000/api/health
```

4. ✅ Fazer upload via cURL
```bash
curl -X POST http://localhost:3000/api/upload -F "file=@test.mp3"
```

5. ✅ Iniciar frontend e fazer upload via interface

6. ✅ Verificar no S3 console

7. ✅ Verificar no PostgreSQL

## 🎉 Sucesso!

Se todos os testes passaram, sua aplicação está funcionando corretamente! 🚀

Upload flow completo:
```
Frontend → Backend API → AWS S3 ✓
                     ↓
               PostgreSQL ✓
```
