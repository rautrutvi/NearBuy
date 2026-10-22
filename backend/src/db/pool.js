import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from /backend/.env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'nearbuy_app',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('error', (err) => {
  console.error('[PostgreSQL] Unexpected error on idle client:', err.message);
});

/**
 * Execute parameterized query safely
 * @param {string} text - SQL query text with parameter placeholders ($1, $2, etc.)
 * @param {Array} params - Query parameters
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'production' && duration > 500) {
      console.warn(`[PostgreSQL] Slow query (${duration}ms):`, text);
    }
    return res;
  } catch (error) {
    console.error(`[PostgreSQL] Query execution error:`, error.message);
    throw error;
  }
}

/**
 * Startup connection check with clear logs
 */
export async function checkConnection() {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || '5432';
  const user = process.env.DB_USER || 'postgres';
  const database = process.env.DB_NAME || 'nearbuy_app';

  try {
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as current_time, current_database() as db_name');
    client.release();
    console.log(`========================================================`);
    console.log(`[PostgreSQL] Connection Pool initialized successfully!`);
    console.log(`  Database : ${res.rows[0].db_name} (expected: ${database})`);
    console.log(`  Host     : ${host}:${port}`);
    console.log(`  User     : ${user}`);
    console.log(`  Timestamp: ${res.rows[0].current_time}`);
    console.log(`========================================================`);
    return true;
  } catch (err) {
    console.error(`========================================================`);
    console.error(`[PostgreSQL] CONNECTION FAILED!`);
    console.error(`  Target   : ${user}@${host}:${port}/${database}`);
    console.error(`  Error    : ${err.message}`);
    if (!process.env.DB_PASSWORD) {
      console.error(`  Hint     : DB_PASSWORD in backend/.env is currently blank.`);
      console.error(`             Please fill in your PostgreSQL password in backend/.env`);
    }
    console.error(`========================================================`);
    return false;
  }
}

export default {
  pool,
  query,
  checkConnection,
};
