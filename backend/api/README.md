# GloboBeat API - Backend Service

API Node.js com Express para o sistema de identificação de trilhas sonoras do GloboBeat.

## 🏗️ Arquitetura

A aplicação segue uma arquitetura em camadas (Layered Architecture) com separação clara de responsabilidades:

```
backend/api/
├── src/
│   ├── config/           # Configurações (DB, S3, Multer)
│   │   ├── database.js   # Pool de conexão PostgreSQL
│   │   ├── s3.js         # Cliente S3 AWS
│   │   └── multer.js     # Configuração de upload
│   │
│   ├── controllers/      # Controladores (HTTP handlers)
│   │   └── uploadController.js
│   │
│   ├── services/         # Lógica de negócio
│   │   ├── uploadService.js    # Serviço de uploads
│   │   └── s3Service.js        # Operações S3
│   │
│   ├── middleware/       # Middlewares Express
│   │   ├── errorHandler.js     # Tratamento de erros
│   │   └── requestLogger.js    # Log de requisições
│   │
│   ├── routes/           # Definição de rotas
│   │   ├── index.js            # Agregador de rotas
│   │   └── uploadRoutes.js     # Rotas de upload
│   │
│   └── app.js            # Aplicação Express
│
├── migrations/           # Migrations SQL
│   └── 001_create_uploads_table.sql
│
├── scripts/              # Scripts utilitários
│   └── migrate.js        # Executor de migrations
│
├── server.js             # Entry point
├── package.json
└── Dockerfile
```

## 📋 Camadas da Aplicação

### 1. **Config Layer** (`src/config/`)
Configuração de dependências externas e bibliotecas.

- **database.js**: Pool de conexões PostgreSQL com pg
- **s3.js**: Cliente AWS S3 SDK v3
- **multer.js**: Configuração de upload multipart/form-data

### 2. **Routes Layer** (`src/routes/`)
Define endpoints HTTP e mapeia para controllers.

```javascript
POST   /api/upload      -> uploadController.uploadFile
GET    /api/upload/:id  -> uploadController.getUpload
GET    /api/uploads     -> uploadController.listUploads
GET    /api/health      -> Health check
```

### 3. **Controllers Layer** (`src/controllers/`)
Manipula requisições HTTP, valida input, chama services, retorna respostas.

**Responsabilidades:**
- Validar parâmetros de requisição
- Chamar services apropriados
- Formatar respostas HTTP
- Passar erros para middleware de erro

### 4. **Services Layer** (`src/services/`)
Contém lógica de negócio e operações complexas.

**uploadService.js:**
- `processFileUpload()` - Orquestra upload (S3 + DB)
- `createUpload()` - Salva metadados no banco
- `getUploadById()` - Busca upload por ID
- `getAllUploads()` - Lista uploads com paginação

**s3Service.js:**
- `uploadFile()` - Upload para S3
- `getFile()` - Download de S3
- `getFileUrl()` - Gera URL do objeto

### 5. **Middleware Layer** (`src/middleware/`)
Interceptores de requisições.

- **errorHandler**: Tratamento centralizado de erros
- **requestLogger**: Log de todas as requisições

## 🔄 Fluxo de Requisição

```
Client Request
    ↓
[Express Middleware Stack]
    ↓ requestLogger
    ↓ CORS
    ↓ JSON Parser
    ↓
[Router] → /api/upload
    ↓
[Multer Middleware] → upload.single('file')
    ↓
[Controller] uploadController.uploadFile()
    ↓
[Service] uploadService.processFileUpload()
    ├─→ s3Service.uploadFile() → AWS S3
    └─→ uploadService.createUpload() → PostgreSQL
    ↓
[Controller] Formata resposta JSON
    ↓
[Client Response]
```

## 🚀 Desenvolvimento

### Instalar dependências

```bash
npm install
```

### Rodar migrations

```bash
npm run migrate
```

### Iniciar servidor (desenvolvimento)

```bash
npm run dev
```

### Rodar com Docker

```bash
cd ../infra
docker-compose up --build
```

## 📦 Dependências Principais

```json
{
  "express": "^4.18.2",           // Framework web
  "pg": "^8.11.3",                // Cliente PostgreSQL
  "@aws-sdk/client-s3": "^3.478", // AWS S3 SDK v3
  "multer": "^1.4.5-lts.1",       // Upload multipart
  "cors": "^2.8.5",               // CORS middleware
  "uuid": "^9.0.1",               // Geração de UUIDs
  "dotenv": "^16.3.1"             // Variáveis de ambiente
}
```

## 🔐 Variáveis de Ambiente

Configure no arquivo `../infra/.env`:

```bash
# Database
POSTGRES_HOST=db
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=trilhas

# AWS S3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
S3_BUCKET_NAME=globobeat-uploads

# Server
PORT=3000
NODE_ENV=development
```

## 🧪 Testar Endpoints

### Health Check

```bash
curl http://localhost:3000/api/health
```

### Upload File

```bash
curl -X POST http://localhost:3000/api/upload \
  -F "file=@/path/to/audio.mp3"
```

### Get Upload

```bash
curl http://localhost:3000/api/upload/1
```

### List Uploads

```bash
curl http://localhost:3000/api/uploads?limit=10&offset=0
```

## 🛡️ Error Handling

A aplicação usa middleware centralizado de erros que trata:

- **Multer errors** (file size, file type)
- **Database errors** (constraint violations)
- **S3 errors** (bucket access, upload failures)
- **Generic errors** (500 Internal Server Error)

Exemplo de resposta de erro:

```json
{
  "success": false,
  "error": "File too large",
  "message": "File size exceeds the 100MB limit"
}
```

## 📝 Logging

Todas as requisições são logadas no formato:

```
✓ POST /api/upload 201 - 1234ms
❌ GET /api/upload/999 404 - 12ms
```

## 🔜 Próximas Implementações

- [ ] Autenticação JWT
- [ ] Rate limiting
- [ ] Compressão de resposta (gzip)
- [ ] Validação com Joi/Zod
- [ ] Testes unitários (Jest)
- [ ] Testes de integração
- [ ] Documentação Swagger/OpenAPI
- [ ] Healthcheck com status de dependências
- [ ] Métricas (Prometheus)

## 🎯 Princípios Seguidos

✅ **Separation of Concerns** - Cada camada tem responsabilidade única
✅ **DRY (Don't Repeat Yourself)** - Código reutilizável em services
✅ **Single Responsibility Principle** - Uma classe/função, uma responsabilidade
✅ **Dependency Injection** - Services injetados, não instanciados
✅ **Error Handling** - Tratamento centralizado e consistente
✅ **Environment Configuration** - Configurações via env vars
✅ **Graceful Shutdown** - Fechamento limpo de conexões

## 📚 Referências

- [Express.js Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Node.js AWS SDK v3](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)
- [PostgreSQL Node.js Driver](https://node-postgres.com/)
- [Multer Documentation](https://github.com/expressjs/multer)
