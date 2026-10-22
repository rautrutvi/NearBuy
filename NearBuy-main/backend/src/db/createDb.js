import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Client } = pg;

async function createDatabase() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '5432', 10);
  const user = process.env.DB_USER || 'postgres';
  const password = process.env.DB_PASSWORD || '';
  const targetDb = process.env.DB_NAME || 'nearbuy_app';

  console.log(`[db:create] Connecting to default "postgres" database on ${host}:${port} as ${user}...`);

  // Connect to default system database "postgres" to manage/create databases
  const client = new Client({
    host,
    port,
    user,
    password,
    database: 'postgres',
  });

  try {
    await client.connect();
    console.log(`[db:create] Connected to system database "postgres". Checking for "${targetDb}"...`);

    // Check if target database already exists
    const checkRes = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1;',
      [targetDb]
    );

    if (checkRes.rows.length > 0) {
      console.log(`[db:create] Database "${targetDb}" already exists. No action needed.`);
    } else {
      console.log(`[db:create] Database "${targetDb}" does not exist. Creating...`);
      // Validate db name format to ensure safe SQL identifier
      if (!/^[a-zA-Z0-9_]+$/.test(targetDb)) {
        throw new Error(`Invalid database name: ${targetDb}`);
      }
      await client.query(`CREATE DATABASE "${targetDb}";`);
      console.log(`[db:create] Successfully created database "${targetDb}".`);
    }

    await client.end();
    console.log(`[db:create] Finished successfully.`);
    process.exit(0);
  } catch (err) {
    console.error(`[db:create] Error:`, err.message);
    if (!password) {
      console.error(`[db:create] Tip: DB_PASSWORD is currently empty in backend/.env. Please set your PostgreSQL password.`);
    }
    await client.end().catch(() => {});
    process.exit(1);
  }
}

createDatabase();
