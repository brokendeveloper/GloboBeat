import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from infra/.env
dotenv.config({ path: path.join(__dirname, '../../infra/.env') });

const { Pool } = pg;

// For local migrations, use localhost:5435. DB_HOST=db is for Docker internal network
const isDocker = process.env.DB_HOST === 'db';
const dbHost = isDocker ? 'db' : 'localhost';
const dbPort = isDocker ? 5432 : 5435; // Docker uses internal 5432, local uses mapped 5435

const pool = new Pool({
  host: dbHost,
  user: process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD,
  database: process.env.DB_NAME || process.env.POSTGRES_DB || 'globobeat',
  port: dbPort
});

console.log(`Connecting to database at ${dbHost}:${dbPort}...`);

async function runMigrations(): Promise<void> {
  const client = await pool.connect();

  try {
    console.log('Running database migrations...');

    const migrationsDir = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      if (file.endsWith('.sql')) {
        console.log(`Running migration: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        await client.query(sql);
        console.log(`✓ ${file} completed`);
      }
    }

    console.log('All migrations completed successfully!');
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
