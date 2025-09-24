# GloboBeat
Projeto da residência do Porto Digital voltado à Globo.

## Arquitetura do Projeto

Este projeto está estruturado com:
- **Backend**: API Node.js com Express
- **Frontend**: Aplicação React
- **Docker**: Orquestração com Docker Compose

## Estrutura de Diretórios

```
GloboBeat/
├── backend/                 # API Node.js
│   ├── src/
│   │   └── index.js        # Servidor principal
│   ├── config/             # Configurações
│   ├── package.json        # Dependências do backend
│   ├── Dockerfile          # Container do backend
│   └── .env.example        # Variáveis de ambiente exemplo
├── frontend/               # Aplicação React
│   ├── src/
│   │   ├── App.js          # Componente principal
│   │   ├── App.css         # Estilos
│   │   ├── index.js        # Ponto de entrada
│   │   └── index.css       # Estilos globais
│   ├── public/
│   │   └── index.html      # Template HTML
│   ├── package.json        # Dependências do frontend
│   ├── Dockerfile          # Container do frontend
│   └── nginx.conf          # Configuração do Nginx
├── docker-compose.yml      # Orquestração dos serviços
└── README.md               # Este arquivo
```

## Como Executar

### Pré-requisitos
- Docker
- Docker Compose

### Executar com Docker Compose

1. Clone o repositório:
```bash
git clone https://github.com/brokendeveloper/GloboBeat.git
cd GloboBeat
```

2. Execute os serviços:
```bash
docker-compose up --build
```

3. Acesse a aplicação:
- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/api/health

### Desenvolvimento Local

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

## Serviços

### Backend (Porto 3001)
- Framework: Express.js
- Rota principal: `/`
- Health check: `/api/health`
- CORS habilitado para frontend

### Frontend (Porto 80)
- Framework: React
- Proxy configurado para API do backend
- Interface com status de conexão com backend

## Docker

O projeto utiliza Docker Compose para orquestrar os serviços:
- **Backend**: Node.js Alpine com healthcheck
- **Frontend**: Build multi-stage com Nginx
- **Network**: Bridge network para comunicação entre serviços
- **Health Checks**: Monitoramento automático da saúde dos serviços

## Contribuição

Este é um projeto da residência do Porto Digital. Para contribuir, siga as práticas de desenvolvimento da equipe.
