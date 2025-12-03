import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Load env vars directly here to ensure they're available
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../infra/.env') });

const { Pool } = pg;

// Detect if actually running inside Docker container
const isInsideDocker = fs.existsSync('/.dockerenv');

// Use localhost:5435 for local dev, or db:5432 inside Docker
const dbHost = isInsideDocker ? 'db' : 'localhost';
const dbPort = isInsideDocker ? 5432 : 5435;

console.log(`📊 Database config: ${dbHost}:${dbPort} (insideDocker: ${isInsideDocker})`);

// Database connection pool
const pool = new Pool({
  host: dbHost,
  user: process.env.DB_USER || process.env.POSTGRES_USER,
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD,
  database: process.env.DB_NAME || process.env.POSTGRES_DB,
  port: dbPort,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test connection on startup
pool.on('connect', () => {
  console.log('✓ Database connected');
});

pool.on('error', (err: Error) => {
  console.error('Database connection error:', err);
  process.exit(-1);
});

export default pool;
