import { pool } from './pool.js';
import { createPaymentsTable } from './paymentsSchema.js';

async function setupSchema() {
  console.log(`[db:setup] Initializing database schema on "${process.env.DB_NAME || 'nearbuy_app'}"...`);

  const client = await pool.connect();
  try {
    await client.query('BEGIN;');

    console.log(`[db:setup] Creating "shops" table matching CSV headers...`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS shops (
        shop_id VARCHAR(50) PRIMARY KEY,
        shop_name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        owner_name VARCHAR(255),
        owner_email VARCHAR(255),
        phone_number VARCHAR(50),
        street_address TEXT,
        locality VARCHAR(100),
        city VARCHAR(100),
        district VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(20),
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        rating NUMERIC(3,2) DEFAULT 0.0,
        reviews_count INT DEFAULT 0,
        is_open BOOLEAN DEFAULT TRUE,
        opening_hours VARCHAR(100),
        flood_safety_status VARCHAR(50) DEFAULT 'SAFE',
        verified_status VARCHAR(50) DEFAULT 'APPROVED',
        bank_upi_id VARCHAR(100),
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log(`[db:setup] Creating "stock" table matching CSV headers with FK to shops...`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS stock (
        product_id VARCHAR(50) PRIMARY KEY,
        shop_id VARCHAR(50) NOT NULL,
        shop_name VARCHAR(255),
        product_name VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        subcategory VARCHAR(100),
        barcode VARCHAR(50),
        price_inr NUMERIC(10,2) NOT NULL DEFAULT 0.00,
        mrp_inr NUMERIC(10,2),
        stock_quantity INT NOT NULL DEFAULT 0,
        reserved_quantity INT NOT NULL DEFAULT 0,
        unit VARCHAR(50),
        low_stock_threshold INT DEFAULT 5,
        is_available BOOLEAN DEFAULT TRUE,
        shelf_location VARCHAR(100),
        brand VARCHAR(100),
        description TEXT,
        image_url TEXT,
        last_restocked_date DATE,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT fk_stock_shop FOREIGN KEY (shop_id) REFERENCES shops(shop_id) ON DELETE CASCADE
      );
    `);

    console.log(`[db:setup] Creating indexes (latitude/longitude, product_name, and query optimizations)...`);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_shops_lat_lng ON shops (latitude, longitude);
      CREATE INDEX IF NOT EXISTS idx_shops_category ON shops (category);
      CREATE INDEX IF NOT EXISTS idx_shops_verified ON shops (verified_status);

      CREATE INDEX IF NOT EXISTS idx_stock_product_name ON stock (product_name);
      CREATE INDEX IF NOT EXISTS idx_stock_shop_id ON stock (shop_id);
      CREATE INDEX IF NOT EXISTS idx_stock_barcode ON stock (barcode);
      CREATE INDEX IF NOT EXISTS idx_stock_category ON stock (category);

      -- Barcode must NOT be globally unique, only unique per shop
      ALTER TABLE stock DROP CONSTRAINT IF EXISTS uq_stock_barcode;
      DROP INDEX IF EXISTS uq_stock_barcode;
      CREATE UNIQUE INDEX IF NOT EXISTS idx_stock_shop_barcode ON stock (shop_id, barcode);
    `);

    console.log(`[db:setup] Creating auxiliary tables for application features (users, reservations, reviews, flood_zones)...`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'CUSTOMER',
        phone VARCHAR(50),
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE SET NULL,
        shop_id VARCHAR(50) REFERENCES shops(shop_id) ON DELETE CASCADE,
        shop_name VARCHAR(255),
        shop_address TEXT,
        total_amount NUMERIC(10,2) DEFAULT 0.00,
        status VARCHAR(50) DEFAULT 'PENDING',
        verification_code VARCHAR(50),
        paid BOOLEAN DEFAULT FALSE,
        reserved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reservation_items (
        id SERIAL PRIMARY KEY,
        reservation_id INT NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
        product_id VARCHAR(50) REFERENCES stock(product_id) ON DELETE SET NULL,
        product_name VARCHAR(255),
        quantity INT DEFAULT 1,
        unit_price NUMERIC(10,2) DEFAULT 0.00
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        shop_id VARCHAR(50) NOT NULL REFERENCES shops(shop_id) ON DELETE CASCADE,
        user_name VARCHAR(255) DEFAULT 'Anonymous Customer',
        rating INT DEFAULT 5,
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS flood_zones (
        id SERIAL PRIMARY KEY,
        area_name VARCHAR(255) NOT NULL,
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        radius_km NUMERIC(5,2) DEFAULT 0.5,
        severity VARCHAR(50) DEFAULT 'MODERATE',
        water_depth_cm INT DEFAULT 20,
        description TEXT,
        status VARCHAR(50) DEFAULT 'ACTIVE',
        reported_by_name VARCHAR(255) DEFAULT 'Community Member',
        reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    await client.query('COMMIT;');
    console.log(`[db:setup] Schema setup completed successfully.`);
    client.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    await client.query('ROLLBACK;').catch(() => {});
    client.release();
    console.error(`[db:setup] Schema setup error:`, err.message);
    if (!process.env.DB_PASSWORD) {
      console.error(`[db:setup] Tip: DB_PASSWORD is empty in backend/.env.`);
    }
    await pool.end();
    process.exit(1);
  }
}

setupSchema();
