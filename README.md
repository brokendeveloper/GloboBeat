# GloboBeat 🎵

Sistema de identificação automática de trilhas sonoras em conteúdos jornalísticos.

> Projeto de residência **Porto Digital** em parceria com **Globo**

## 📖 Sobre o Projeto

O GloboBeat resolve o desafio da identificação automática de trilhas sonoras em conteúdos jornalísticos (áudio e vídeo). Utilizando Inteligência Artificial e integração de APIs, o sistema gera metadados musicais completos — como nome da música, artista e tempo de reprodução — garantindo mais eficiência no processo de gestão de direitos autorais.

### 🎯 Objetivo

Automatizar a identificação de músicas em reportagens da Globo, facilitando:
- ✅ Gestão de direitos autorais
- ✅ Compliance legal
- ✅ Agilidade no processo editorial
- ✅ Rastreabilidade completa de conteúdo musical

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 15)                    │
│            React 19 + TypeScript + Chakra UI                 │
│                    Port 3001                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
                       ↓
┌─────────────────────────────────────────────────────────────┐
│             Backend API (Express + TypeScript)               │
│          Node.js 20 + PostgreSQL + AWS S3                    │
│                    Port 3000                                 │
└───────┬────────────────────────┬────────────────────────────┘
        │                        │
        ↓                        ↓
┌──────────────┐        ┌──────────────┐
│  PostgreSQL  │        │    AWS S3    │
│   Metadata   │        │  File Store  │
│   Port 5432  │        │              │
└──────────────┘        └──────────────┘
        │
        ↓
┌─────────────────────────────────────────────────────────────┐
│                      RabbitMQ (Future)                       │
│                 Message Queue for Workers                    │
│              Ports 5672 (AMQP) + 15672 (UI)                  │
└───────┬─────────────────────────┬───────────────────────────┘
        │                         │
        ↓                         ↓
┌──────────────┐        ┌──────────────┐
│  Worker-Pre  │        │  Worker-Rec  │
│   (Python)   │        │   (Python)   │
│    Planned   │        │    Planned   │
└──────────────┘        └──────────────┘
```

## ✨ Funcionalidades

### ✅ Implementadas

- **Upload de Arquivos**
  - Interface web intuitiva
  - Suporte a áudio (MP3, WAV, AAC, OGG, FLAC)
  - Suporte a vídeo (MP4, MOV, AVI, WebM, MKV)
  - Limite de 100MB por arquivo
  - Progress bar em tempo real
  - Validação de tipo e tamanho

- **API REST (TypeScript)**
  - `POST /api/upload` - Upload de arquivos
  - `GET /api/upload/:id` - Consultar upload
  - `GET /api/uploads` - Listar uploads (paginado)
  - `GET /api/health` - Health check
  - Tratamento de erros centralizado
  - Logging de requisições

- **Armazenamento**
  - AWS S3 para arquivos
  - PostgreSQL para metadados
  - Migrations automáticas
  - Nomenclatura única de arquivos

- **Infraestrutura**
  - Docker Compose para orquestração
  - Multi-stage builds otimizados
  - Variáveis de ambiente seguras
  - Graceful shutdown

### 🚧 Em Desenvolvimento

- [ ] **Worker-Pre**: Pré-processamento de áudio
  - Extração de features
  - Normalização
  - Segmentação

- [ ] **Worker-Rec**: Reconhecimento de trilhas
  - Fingerprinting de áudio
  - Identificação via AI/ML
  - Matching com base de dados

- [ ] **Autenticação**
  - JWT tokens
  - Login de usuários
  - Controle de acesso

- [ ] **Interface de Resultados**
  - Visualização de trilhas identificadas
  - Timeline de uso musical
  - Relatórios detalhados

- [ ] **Validação**
  - Workflow de aprovação
  - Correções manuais
  - Auditoria

## 🚀 Quick Start

### Pré-requisitos

- **Docker** & **Docker Compose**
- **Node.js** 20+ (para desenvolvimento frontend)
- **Conta AWS** com credenciais S3
- **Git**

### 1. Clone o Repositório

```bash
git clone <repository-url>
cd GloboBeatV2
```

### 2. Configure o Ambiente

```bash
cd backend/infra
cp .env.example .env
```

Edite `.env` e adicione suas credenciais AWS:

```bash
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
S3_BUCKET_NAME=globobeat-uploads
```

### 3. Inicie o Backend

```bash
docker-compose up --build
```

Aguarde ver:
```
🚀 GloboBeat API Server Started
📡 Port: 3000
🪣 S3 Bucket: globobeat-uploads
```

### 4. Inicie o Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

### 5. Acesse a Aplicação

- **Frontend**: http://localhost:3001
- **Upload**: http://localhost:3001/page_upload
- **API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/health
- **RabbitMQ UI**: http://localhost:15672 (admin/admin123)

### 6. Teste o Upload

1. Acesse http://localhost:3001/page_upload
2. Clique em "Selecionar arquivos"
3. Escolha um arquivo MP3 ou MP4
4. Clique em "Fazer Upload"
5. Veja o progresso e mensagem de sucesso!

## 🧪 Testes

### Teste Automatizado (Windows)

```powershell
.\test-upload-simple.ps1
```

### Teste Automatizado (Linux/Mac)

```bash
chmod +x test-upload.sh
./test-upload.sh
```

### Teste Manual via cURL

```bash
# Health check
curl http://localhost:3000/api/health

# Upload
curl -X POST http://localhost:3000/api/upload -F "file=@music.mp3"

# Listar uploads
curl http://localhost:3000/api/uploads
```

### Verificar Resultados

**No AWS S3:**
1. Acesse https://s3.console.aws.amazon.com/
2. Bucket: `globobeat-uploads`
3. Pasta: `uploads/`

**No PostgreSQL:**
```bash
docker exec -it trilhas_db psql -U user -d trilhas -c "SELECT * FROM uploads ORDER BY created_at DESC LIMIT 5;"
```

## 🛠️ Tecnologias

### Frontend
- **Next.js 15** - Framework React com App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Chakra UI v3** - Component library
- **Tailwind CSS v4** - Utility-first CSS
- **Radix UI** - Headless components

### Backend
- **Node.js 20** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type safety (strict mode)
- **PostgreSQL 16** - Relational database
- **AWS S3** - Object storage
- **RabbitMQ** - Message broker

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Service orchestration
- **Multi-stage builds** - Optimized images

### Future Stack
- **Python 3.10** - Worker services
- **pika** - RabbitMQ client
- **psycopg2** - PostgreSQL client
- **librosa** - Audio processing
- **TensorFlow/PyTorch** - ML models

## 📁 Estrutura do Projeto

```
GloboBeatV2/
├── frontend/                      # Next.js Application
│   ├── src/
│   │   ├── app/                  # Pages (App Router)
│   │   │   ├── page.tsx         # Home
│   │   │   ├── login/           # Login page
│   │   │   ├── cadastro/        # Registration
│   │   │   ├── page_upload/     # Upload interface ✅
│   │   │   ├── trilha-identificada/  # Results
│   │   │   └── validacao/       # Validation
│   │   └── components/          # Reusable components
│   ├── package.json
│   └── README.md
│
├── backend/
│   ├── api/                      # Express API (TypeScript)
│   │   ├── src/
│   │   │   ├── types/           # Type definitions
│   │   │   ├── config/          # Configurations
│   │   │   ├── services/        # Business logic
│   │   │   ├── controllers/     # Request handlers
│   │   │   ├── middleware/      # Express middleware
│   │   │   ├── routes/          # Route definitions
│   │   │   ├── app.ts          # Express app
│   │   │   └── server.ts       # Entry point
│   │   ├── migrations/          # SQL migrations
│   │   ├── scripts/             # Utility scripts
│   │   ├── tsconfig.json       # TypeScript config
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── README.md
│   │
│   ├── workers/                 # Python Workers (Planned)
│   │   ├── worker-pre/         # Preprocessing
│   │   └── worker-rec/         # Recognition
│   │
│   └── infra/                   # Infrastructure
│       ├── docker-compose.yml  # Service orchestration
│       ├── .env                # Environment variables
│       └── .env.example        # Template
│
├── docs/                        # Documentation
│   ├── CLAUDE.md               # AI assistant guide
│   ├── QUICK_START.md          # 5-min setup
│   ├── TESTING_GUIDE.md        # Testing guide
│   ├── UPLOAD_SETUP.md         # Upload system
│   └── TYPESCRIPT_MIGRATION.md # TS migration
│
├── test-upload.ps1             # Test script (Windows)
├── test-upload.sh              # Test script (Linux/Mac)
├── test-upload-simple.ps1      # Simple test (Windows)
└── README.md                   # This file
```

## 🔐 Variáveis de Ambiente

Arquivo: `backend/infra/.env`

```bash
# Database
POSTGRES_HOST=db
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=trilhas

# AWS S3 (REQUIRED)
AWS_ACCESS_KEY_ID=your_key_here
AWS_SECRET_ACCESS_KEY=your_secret_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=globobeat-uploads

# RabbitMQ
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=admin123

# Server
PORT=3000
NODE_ENV=development
```

## 📚 Documentação

- [CLAUDE.md](./CLAUDE.md) - Guia completo para AI assistants
- [QUICK_START.md](./QUICK_START.md) - Setup rápido (5 minutos)
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Guia de testes
- [UPLOAD_SETUP.md](./UPLOAD_SETUP.md) - Sistema de upload
- [backend/api/README.md](./backend/api/README.md) - API documentation
- [backend/api/TYPESCRIPT_MIGRATION.md](./backend/api/TYPESCRIPT_MIGRATION.md) - Migração TS
- [frontend/README.md](./frontend/README.md) - Frontend guide

## 🤝 Contribuindo

### Workflow de Desenvolvimento

1. **Clone e configure**
   ```bash
   git clone <repo>
   cd GloboBeatV2
   cp backend/infra/.env.example backend/infra/.env
   # Configure AWS credentials
   ```

2. **Inicie serviços**
   ```bash
   # Terminal 1: Backend
   cd backend/infra && docker-compose up --build

   # Terminal 2: Frontend
   cd frontend && npm install && npm run dev
   ```

3. **Faça mudanças**
   - Backend: Edite arquivos `.ts` em `backend/api/src/`
   - Frontend: Edite arquivos em `frontend/src/`

4. **Teste**
   ```bash
   # Automated
   .\test-upload-simple.ps1

   # Manual
   # Acesse http://localhost:3001/page_upload
   ```

5. **Commit**
   ```bash
   git add .
   git commit -m "feat: sua feature"
   git push
   ```

### Padrões de Código

- **TypeScript**: Modo strict habilitado
- **No unused vars**: Prefixe com `_` se necessário
- **ESLint**: Siga as regras configuradas
- **Commits**: Use conventional commits

## 🐛 Troubleshooting

### Backend não inicia
```bash
docker-compose down -v
docker-compose up --build
```

### Erro no TypeScript build
```bash
cd backend/api
npm run type-check
npm run build
```

### Frontend com erro
```bash
cd frontend
rm -rf .next node_modules
npm install
npm run dev
```

### Erro de upload no S3
- Verifique credenciais em `.env`
- Teste: `aws s3 ls s3://globobeat-uploads`
- Confirme bucket existe
- Verifique IAM permissions

## 🎯 Roadmap

### Phase 1: Upload System ✅
- [x] Frontend upload interface
- [x] Backend API (TypeScript)
- [x] S3 integration
- [x] PostgreSQL metadata
- [x] Docker infrastructure

### Phase 2: Audio Processing (Q1 2026)
- [ ] Worker-pre implementation
- [ ] Audio feature extraction
- [ ] RabbitMQ integration
- [ ] Job queue system

### Phase 3: Recognition (Q2 2026)
- [ ] Worker-rec implementation
- [ ] ML model integration
- [ ] Fingerprinting algorithm
- [ ] Database matching

### Phase 4: User Interface (Q3 2026)
- [ ] Authentication system
- [ ] Results visualization
- [ ] Validation workflow
- [ ] Reporting

### Phase 5: Production (Q4 2026)
- [ ] CI/CD pipeline
- [ ] Monitoring & logging
- [ ] Performance optimization
- [ ] Security hardening

## 📊 Status do Projeto

| Componente | Status | Progresso |
|------------|--------|-----------|
| Frontend Upload | ✅ Completo | 100% |
| Backend API | ✅ Completo | 100% |
| S3 Integration | ✅ Completo | 100% |
| Database | ✅ Completo | 100% |
| Docker Setup | ✅ Completo | 100% |
| Worker-Pre | 🚧 Planejado | 0% |
| Worker-Rec | 🚧 Planejado | 0% |
| Auth System | 🚧 Planejado | 0% |
| Results UI | 🚧 Planejado | 0% |

## 👥 Equipe

**Projeto de Residência**
- Organização: **Porto Digital**
- Parceiro: **Globo**
- Foco: Identificação automática de trilhas sonoras

## 📄 Licença

[A definir]

## 🔗 Links Úteis

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/tutorials)

---

**Status**: 🟢 Active Development

**Última Atualização**: Outubro 2025
