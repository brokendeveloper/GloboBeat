// Load environment variables FIRST, before any other imports
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../infra/.env') });

import type { Server } from 'http';
import app from './app.js';
import pool from './config/database.js';
import queueService from './services/queueService.js';

const PORT = process.env.PORT || 3000;

// Start server
const server: Server = app.listen(PORT, async () => {
  console.log('='.repeat(50));
  console.log('🚀 GloboBeat API Server Started');
  console.log('='.repeat(50));
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🪣 S3 Bucket: ${process.env.S3_BUCKET_NAME}`);
  console.log(`🗄️  Database: ${process.env.POSTGRES_DB}@${process.env.POSTGRES_HOST}`);
  console.log('='.repeat(50));
  
  // Connect to RabbitMQ
  await queueService.connect();
});

// Graceful shutdown
const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n${signal} signal received: closing HTTP server`);

  server.close(async () => {
    console.log('HTTP server closed');

    try {
      await pool.end();
      console.log('Database connections closed');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forcing shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
