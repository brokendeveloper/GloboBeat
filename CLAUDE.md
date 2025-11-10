# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GloboBeat is a Porto Digital residency project for Globo focused on soundtrack identification ("trilhas sonoras"). The system uses a microservices architecture with a Next.js frontend and a Dockerized backend consisting of a Node.js API (TypeScript) and Python workers for audio processing.

**Goal:** Automate soundtrack identification in journalistic content (audio/video) using AI and API integration to generate complete music metadata (name, artist, playback time) for efficient copyright management.

## Architecture

### Backend (Microservices)

The backend uses Docker Compose to orchestrate multiple services:

- **API Service** (`backend/api/`): Node.js 20 + Express + **TypeScript** service running on port 3000
  - RESTful API for file uploads
  - AWS S3 integration for file storage
  - PostgreSQL for metadata storage
  - Layered architecture: routes → controllers → services → database
  - Auto-running migrations on startup

- **worker-pre** (`backend/workers/worker-pre/`): Python preprocessing worker for audio data (planned)
- **worker-rec** (`backend/workers/worker-rec/`): Python recognition/identification worker (planned)
- **Database**: PostgreSQL 16 (container: `trilhas_db`, port 5432)
- **Message Queue**: RabbitMQ 3 with management UI (container: `trilhas_rabbitmq`, ports 5672, 15672)

Workers will communicate via RabbitMQ and connect to the shared PostgreSQL database. All services are defined in `backend/infra/docker-compose.yml`.

### Frontend

Next.js 15 application with:
- **App Router** (not Pages Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Chakra UI v3 (note: uses new API with .Root components)
- Radix UI component libraries

**Key pages:**
- `/` - Home (redirects to login)
- `/login` - User login
- `/cadastro` - User registration
- `/page_upload` - Audio/video upload interface (fully functional)
- `/trilha-identificada` - Identified tracks display
- `/validacao` - Validation workflow

## Technology Stack

### Backend API (TypeScript)
```
backend/api/src/
├── types/              # TypeScript interfaces and types
├── config/            # Database, S3, Multer configurations
├── services/          # Business logic (uploadService, s3Service)
├── controllers/       # HTTP request handlers
├── middleware/        # Error handling, request logging
├── routes/            # Route definitions
├── app.ts            # Express application setup
└── server.ts         # Server entry point
```

**Key files:**
- `tsconfig.json` - TypeScript configuration (strict mode enabled)
- `package.json` - Uses tsx for development, tsc for build
- `Dockerfile` - Multi-stage build (builder + production)

**Implemented endpoints:**
- `GET  /api/health` - Health check
- `POST /api/upload` - Upload file to S3 + save metadata
- `GET  /api/upload/:id` - Get upload by ID
- `GET  /api/uploads` - List all uploads (paginated)

### Frontend (Next.js + TypeScript)
```
frontend/src/
├── app/               # Pages (App Router)
│   ├── page.tsx      # Home
│   ├── login/        # Login page
│   ├── cadastro/     # Registration
│   ├── page_upload/  # Upload interface ✅
│   ├── trilha-identificada/  # Results
│   └── validacao/    # Validation
└── components/       # Reusable components
    ├── header.tsx
    ├── footer.tsx
    └── sidebar.tsx
```

## Development Commands

### Frontend Development

```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3001)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

**Note:** Frontend runs on port 3001 to avoid conflict with API on port 3000.

### Backend Development

**Start all backend services:**
```bash
cd backend/infra
docker-compose up -d              # Start all services in background
docker-compose up --build         # Rebuild and start
docker-compose logs -f            # Follow logs for all services
docker-compose logs -f api        # Follow logs for specific service
docker-compose ps                 # Check service status
docker-compose down               # Stop all services
docker-compose down -v            # Stop and remove volumes
```

**Local development (without Docker):**
```bash
cd backend/api
npm install
npm run dev          # Uses tsx watch for hot reload
npm run build        # Compile TypeScript to dist/
npm run migrate      # Run database migrations
npm run type-check   # Check types without compiling
```

**Rebuild services after code changes:**
```bash
cd backend/infra
docker-compose up -d --build
```

## Environment Configuration

Backend services use environment variables defined in `backend/infra/.env`:

### Required Variables

```bash
# Database
POSTGRES_HOST=db
POSTGRES_USER=user
POSTGRES_PASSWORD=pass
POSTGRES_DB=trilhas

# AWS S3 (REQUIRED for upload functionality)
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=globobeat-uploads

# RabbitMQ (for future worker integration)
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=admin
RABBITMQ_PASSWORD=admin123
```

**Setup:**
1. Copy `backend/infra/.env.example` to `backend/infra/.env`
2. Replace AWS credentials with your actual values
3. Ensure S3 bucket exists and has proper IAM permissions

## Key Technical Details

### Backend (TypeScript)
- **Strict TypeScript**: `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns` enabled
- **ES Modules**: Full ESM support with `.js` extensions in imports
- **Multi-stage Docker build**: Optimized production images
- **Database migrations**: Auto-run on container startup
- **Error handling**: Centralized middleware with typed errors
- **File validation**: MIME type checking, 100MB size limit
- **S3 naming**: `uploads/{uuid}-{timestamp}-{sanitized-filename}`

### Frontend (Next.js)
- **App Router**: Uses app directory structure (NOT pages directory)
- **Chakra UI v3**: Uses new component API (e.g., `Alert.Root`, `Alert.Title`)
- **Custom progress bar**: Built with Box components (not Progress component)
- **API calls**: Uses fetch API to backend at `http://localhost:3000`
- **File upload**: Multipart form data with visual feedback

### Database Schema

**uploads table:**
```sql
- id (SERIAL PRIMARY KEY)
- filename (VARCHAR)
- original_filename (VARCHAR)
- s3_key (VARCHAR UNIQUE)
- file_size (BIGINT)
- mime_type (VARCHAR)
- status (VARCHAR) - 'uploaded', 'processing', 'completed', 'failed'
- user_id (INTEGER, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Port Allocations

- **Frontend dev server**: 3001 (Next.js)
- **API service**: 3000 (Express)
- **PostgreSQL**: 5432
- **RabbitMQ AMQP**: 5672
- **RabbitMQ Management UI**: 15672

## Testing

### Automated Tests
```bash
# Windows PowerShell
.\test-upload-simple.ps1

# Linux/Mac
./test-upload.sh
```

### Manual Testing
```bash
# Health check
curl http://localhost:3000/api/health

# Upload file
curl -X POST http://localhost:3000/api/upload -F "file=@test.mp3"

# List uploads
curl http://localhost:3000/api/uploads
```

### Frontend Testing
1. Access: http://localhost:3001/page_upload
2. Select audio/video file (MP3, MP4, WAV, etc.)
3. Click "Fazer Upload"
4. View progress bar and success message
5. Verify file in AWS S3 Console
6. Check database: `docker exec -it trilhas_db psql -U user -d trilhas -c "SELECT * FROM uploads;"`

## Common Issues & Solutions

### TypeScript Compilation Errors
- Ensure no unused variables (prefix with `_` if required by signature)
- All imports must have `.js` extension (even for `.ts` files)
- Check strict type checking rules

### Chakra UI Component Errors
- Use new v3 API: `Alert.Root`, `Alert.Title` (not `Alert`, `AlertTitle`)
- Custom components may be needed (e.g., progress bar)

### Docker Build Failures
- Check if all TypeScript files compile: `npm run type-check`
- Ensure `dist/` folder is created: `npm run build`
- Clear Docker cache: `docker-compose down -v && docker-compose up --build`

### CORS Issues
- Already configured in `src/app.ts`
- Ensure frontend uses correct API URL

### S3 Upload Failures
- Verify AWS credentials in `.env`
- Check bucket exists and IAM permissions
- Test: `aws s3 ls s3://globobeat-uploads`

## Documentation Files

- `README.md` - Project overview and quick start
- `CLAUDE.md` - This file (for Claude Code)
- `QUICK_START.md` - 5-minute setup guide
- `TESTING_GUIDE.md` - Comprehensive testing guide
- `UPLOAD_SETUP.md` - Upload system setup details
- `backend/api/README.md` - API architecture and development
- `backend/api/TYPESCRIPT_MIGRATION.md` - TypeScript migration details
- `frontend/README.md` - Frontend development guide

## Development Workflow

1. **Start backend**: `cd backend/infra && docker-compose up --build`
2. **Start frontend**: `cd frontend && npm run dev`
3. **Make changes**: Edit TypeScript files
4. **Backend**: Auto-rebuilds on next `docker-compose up --build`
5. **Frontend**: Auto-reloads with Next.js hot reload
6. **Test**: Use browser or automated test scripts
7. **Commit**: Include both src and updated documentation

## Future Development

### Planned Features
- [ ] Worker-pre: Audio preprocessing (Python)
- [ ] Worker-rec: Soundtrack recognition (Python + AI/ML)
- [ ] RabbitMQ integration for job queue
- [ ] JWT authentication
- [ ] User management
- [ ] Results display page
- [ ] Validation workflow
- [ ] Real-time progress updates (WebSocket)

### Technical Improvements
- [ ] Unit tests (Jest + ts-jest)
- [ ] Integration tests
- [ ] API documentation (Swagger/OpenAPI)
- [ ] ESLint + Prettier setup
- [ ] CI/CD pipeline
- [ ] Monitoring and logging (Prometheus)
- [ ] Rate limiting
- [ ] Request validation (Zod)

## Important Notes

- **Always use TypeScript**: No .js files in src/ directories
- **API uses TypeScript**: Compiled to dist/ for production
- **Frontend uses Chakra UI v3**: Different API from v2
- **Docker multi-stage builds**: Smaller production images
- **Migrations auto-run**: On API container startup
- **S3 credentials required**: For upload functionality
- **Port 3001 for frontend**: To avoid API port conflict

## Team

Projeto desenvolvido para **Porto Digital** em parceria com **Globo**.
Residência em tecnologia focada em identificação automática de trilhas sonoras.
