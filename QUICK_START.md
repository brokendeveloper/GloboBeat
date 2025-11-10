# 🚀 Quick Start - Teste Rápido do Sistema

Guia rápido para testar o sistema de upload em 5 minutos.

## ⚡ Início Rápido

### 1. Iniciar Backend (1 minuto)

```bash
cd backend/infra
docker-compose up --build
```

Aguarde ver esta mensagem:
```
🚀 GloboBeat API Server Started
📡 Port: 3000
```

### 2. Testar API (30 segundos)

**Windows PowerShell:**
```powershell
# Health check
Invoke-WebRequest -Uri http://localhost:3000/api/health

# Rodar suite de testes
cd ..\..\
.\test-upload.ps1
```

**Linux/Mac:**
```bash
# Health check
curl http://localhost:3000/api/health

# Rodar suite de testes
chmod +x test-upload.sh
./test-upload.sh
```

### 3. Iniciar Frontend (30 segundos)

```bash
cd frontend
npm install    # Primeira vez apenas
npm run dev
```

### 4. Testar Upload (1 minuto)

1. Abra: http://localhost:3001/page_upload
2. Clique em "Selecionar arquivos"
3. Escolha um arquivo MP3 ou MP4
4. Clique em "Fazer Upload"
5. ✅ Veja a mensagem de sucesso!

### 5. Verificar Resultados (2 minutos)

**No AWS S3:**
1. Acesse: https://s3.console.aws.amazon.com/
2. Abra seu bucket `globobeat-uploads`
3. Veja o arquivo em `uploads/`

**No PostgreSQL:**
```bash
docker exec -it trilhas_db psql -U user -d trilhas -c "SELECT id, original_filename, file_size, status, created_at FROM uploads ORDER BY created_at DESC LIMIT 5;"
```

## ✅ Checklist Rápido

- [ ] Backend rodando (http://localhost:3000/api/health retorna 200)
- [ ] Frontend rodando (http://localhost:3001 acessível)
- [ ] Upload via cURL/PowerShell funciona
- [ ] Upload via interface funciona
- [ ] Arquivo aparece no S3
- [ ] Registro no PostgreSQL criado

## 🐛 Problemas Comuns

### Backend não inicia
```bash
# Limpar e reiniciar
docker-compose down -v
docker-compose up --build
```

### "Failed to upload to S3"
- Verificar credenciais em `backend/infra/.env`
- Verificar se bucket existe
- Testar: `aws s3 ls s3://globobeat-uploads`

### Frontend não conecta
- Verificar se API está em http://localhost:3000
- Verificar CORS (já configurado)

## 📚 Documentação Completa

Para mais detalhes, consulte:
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Guia completo de testes
- [UPLOAD_SETUP.md](./UPLOAD_SETUP.md) - Setup detalhado
- [backend/api/README.md](./backend/api/README.md) - Documentação da API
- [backend/api/TYPESCRIPT_MIGRATION.md](./backend/api/TYPESCRIPT_MIGRATION.md) - Sobre TypeScript

## 🎯 Teste End-to-End Rápido

Execute este comando único para testar tudo:

**Windows:**
```powershell
.\test-upload.ps1
```

**Linux/Mac:**
```bash
./test-upload.sh
```

Isso vai:
✅ Testar health check
✅ Fazer upload de teste
✅ Buscar upload por ID
✅ Listar todos uploads
✅ Testar validações
✅ Limpar arquivos de teste

## 🎉 Pronto!

Se todos os testes passaram, seu sistema está funcionando perfeitamente! 🚀
