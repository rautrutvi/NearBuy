// paymentsSchema.js – creates payments table idempotently
import { pool } from './pool.js';

export async function createPaymentsTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        reservation_id INT REFERENCES reservations(id) ON DELETE CASCADE,
        txn_id VARCHAR(50) UNIQUE NOT NULL,
        method VARCHAR(20) NOT NULL,
        amount NUMERIC(10,2) NOT NULL,
        status VARCHAR(20) NOT NULL,
        paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
  } finally {
    client.release();
  }
}
