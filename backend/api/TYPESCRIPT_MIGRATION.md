# TypeScript Migration Guide

Este documento descreve a migração do backend GloboBeat de JavaScript (ES Modules) para TypeScript.

## 🎯 Objetivos da Migração

✅ **Type Safety** - Detectar erros em tempo de desenvolvimento
✅ **Better IDE Support** - Autocomplete e IntelliSense aprimorados
✅ **Refactoring Confidence** - Renomeações e refatorações seguras
✅ **Self-Documenting Code** - Tipos servem como documentação
✅ **Maintainability** - Código mais fácil de manter e entender

## 📁 Nova Estrutura de Arquivos

```
backend/api/
├── src/                    # Código TypeScript
│   ├── types/
│   │   └── index.ts       # Interfaces e tipos compartilhados
│   ├── config/
│   │   ├── database.ts    # Configuração PostgreSQL
│   │   ├── s3.ts          # Configuração AWS S3
│   │   └── multer.ts      # Configuração de upload
│   ├── services/
│   │   ├── s3Service.ts
│   │   └── uploadService.ts
│   ├── controllers/
│   │   └── uploadController.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── requestLogger.ts
│   ├── routes/
│   │   ├── index.ts
│   │   └── uploadRoutes.ts
│   ├── app.ts             # Aplicação Express
│   └── server.ts          # Entry point
│
├── dist/                   # Código JavaScript compilado (gerado)
├── scripts/
│   └── migrate.ts         # Script de migrations
├── migrations/
│   └── *.sql
├── tsconfig.json          # Configuração TypeScript
├── package.json
└── Dockerfile             # Multi-stage build
```

## 🔧 Configuração TypeScript

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

**Principais features:**
- `strict: true` - Modo strict ativado (type safety máximo)
- `module: "NodeNext"` - Suporte completo a ES Modules no Node.js
- `noUnusedLocals/Parameters` - Detecta variáveis não utilizadas

## 📦 Novas Dependências

### Dependencies (Runtime)
```json
{
  "express": "^4.18.2",
  "pg": "^8.11.3",
  "@aws-sdk/client-s3": "^3.478.0",
  "multer": "^1.4.5-lts.1",
  "cors": "^2.8.5",
  "uuid": "^9.0.1",
  "dotenv": "^16.3.1"
}
```

### DevDependencies (Build-time)
```json
{
  "@types/node": "^20.10.0",
  "@types/express": "^4.17.21",
  "@types/multer": "^1.4.11",
  "@types/cors": "^2.8.17",
  "@types/uuid": "^9.0.7",
  "@types/pg": "^8.10.9",
  "typescript": "^5.3.3",
  "tsx": "^4.7.0"
}
```

## 🎨 Principais Mudanças

### 1. Tipos e Interfaces (`src/types/index.ts`)

Definição centralizada de todos os tipos:

```typescript
export interface Upload {
  id: number;
  filename: string;
  original_filename: string;
  s3_key: string;
  file_size: number;
  mime_type: string;
  status: UploadStatus;
  user_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export type UploadStatus = 'uploaded' | 'processing' | 'completed' | 'failed';
```

### 2. Services com Type Safety

**Antes (JS):**
```javascript
async uploadFile(fileBuffer, originalFilename, mimeType) {
  // ...
}
```

**Depois (TS):**
```typescript
async uploadFile(
  fileBuffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<S3UploadResult> {
  // ...
}
```

### 3. Controllers Tipados

```typescript
import type { Request, Response, NextFunction } from 'express';

async uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
  // TypeScript sabe os tipos de req, res, next
  // Autocomplete e validação funcionam perfeitamente
}
```

### 4. Error Handling Tipado

```typescript
interface CustomError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  err: CustomError | MulterError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Tratamento de erros com tipos específicos
}
```

## 🚀 Scripts NPM

```json
{
  "dev": "tsx watch src/server.ts",        // Dev com hot reload
  "build": "tsc",                          // Compila TS -> JS
  "start": "node dist/server.js",          // Roda versão compilada
  "migrate": "tsx scripts/migrate.ts",     // Executa migrations
  "type-check": "tsc --noEmit"             // Verifica tipos sem compilar
}
```

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Rodar em modo desenvolvimento (com hot reload)
npm run dev

# Verificar erros de tipo
npm run type-check

# Compilar para produção
npm run build

# Rodar versão compilada
npm start
```

## 🐳 Docker Multi-Stage Build

O Dockerfile agora usa **multi-stage build** para otimizar o tamanho da imagem:

```dockerfile
# Stage 1: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build

# Stage 2: Production
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/server.js"]
```

**Benefícios:**
- Imagem final não contém TypeScript nem ferramentas de build
- Apenas código JavaScript compilado + dependências de produção
- Imagem significativamente menor

## 🔍 Type Checking no CI/CD

Adicione ao seu pipeline:

```yaml
- name: Type Check
  run: npm run type-check

- name: Build
  run: npm run build
```

## 📚 Recursos de TypeScript Utilizados

### 1. **Strict Mode**
```typescript
"strict": true  // Ativa todas as verificações strict
```

### 2. **Type Inference**
```typescript
const pool = new Pool({ ... });  // TypeScript infere o tipo automaticamente
```

### 3. **Union Types**
```typescript
type UploadStatus = 'uploaded' | 'processing' | 'completed' | 'failed';
```

### 4. **Optional Properties**
```typescript
interface CreateUploadData {
  userId?: number | null;  // Propriedade opcional
}
```

### 5. **Generic Types**
```typescript
async createUpload(uploadData: CreateUploadData): Promise<Upload> {
  // Promise<Upload> indica que retorna uma Promise de Upload
}
```

### 6. **Type Guards**
```typescript
if ('code' in err && err.code === 'LIMIT_FILE_SIZE') {
  // TypeScript sabe que err tem propriedade 'code' aqui
}
```

### 7. **Utility Types**
```typescript
Pick<Upload, 'id' | 'status' | 'updated_at'>  // Seleciona apenas essas propriedades
```

## 🎓 Boas Práticas Implementadas

✅ **Interfaces explícitas** para todos os objetos de domínio
✅ **Type annotations** em parâmetros de função
✅ **Return types** explícitos em funções públicas
✅ **Error types** específicos para diferentes cenários
✅ **Strict null checks** - Tratamento explícito de null/undefined
✅ **No implicit any** - Todos os tipos devem ser explícitos
✅ **Readonly** onde apropriado para imutabilidade

## 🔄 Benefícios Obtidos

### Antes (JavaScript)
```javascript
// ❌ Sem validação de tipos
const result = await uploadService.createUpload({
  filename: 123,  // Bug! Deveria ser string
  s3Key: null     // Bug! Campo obrigatório
});
```

### Depois (TypeScript)
```typescript
// ✅ Erro detectado em tempo de desenvolvimento
const result = await uploadService.createUpload({
  filename: 123,  // ERROR: Type 'number' is not assignable to type 'string'
  s3Key: null     // ERROR: Property 's3Key' is missing
});
```

## 🚦 Próximos Passos

- [ ] Adicionar testes unitários com Jest + ts-jest
- [ ] Configurar ESLint com regras TypeScript
- [ ] Adicionar Prettier para formatação consistente
- [ ] Implementar validação de request com Zod
- [ ] Adicionar documentação com TSDoc
- [ ] Configurar path aliases (`@/` em vez de `../../../`)

## 📖 Referências

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [Express + TypeScript Best Practices](https://www.robertcooper.me/building-a-rest-api-with-express-and-typescript)
- [Node.js + TypeScript Setup](https://nodejs.org/en/learn/getting-started/nodejs-with-typescript)
