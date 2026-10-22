import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse';
import { pool } from './pool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveCsvPath(filename) {
  const possiblePaths = [
    path.resolve(process.cwd(), 'csv_files', filename),
    path.resolve(__dirname, '../../../csv_files', filename),
    path.resolve(__dirname, '../../csv_files', filename),
    path.resolve(__dirname, '../resources/seed', filename),
    path.resolve(__dirname, '../../resources/seed', filename),
    path.resolve(__dirname, '../../src/main/resources/seed', filename),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  throw new Error(`Could not find CSV file "${filename}". Searched in: ${possiblePaths.join(', ')}`);
}

function parseBoolean(val, defaultVal = true) {
  if (val === undefined || val === null || val === '') return defaultVal;
  const s = String(val).trim().toUpperCase();
  return s === 'TRUE' || s === '1' || s === 'YES';
}

function parseNumber(val, defaultVal = 0) {
  if (val === undefined || val === null || val === '') return defaultVal;
  const num = Number(val);
  return isNaN(num) ? defaultVal : num;
}

function parseDateOrNull(val) {
  if (!val || String(val).trim() === '') return null;
  return String(val).trim();
}

async function readCsvRows(filePath) {
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true, skip_empty_lines: true }))
      .on('data', (row) => records.push(row))
      .on('end', () => resolve(records))
      .on('error', (err) => reject(err));
  });
}

async function seedShops(client) {
  // Check if shops table is already populated. Keep shops untouched if present.
  const check = await client.query('SELECT count(*) FROM shops');
  const existingCount = parseInt(check.rows[0].count, 10);
  if (existingCount > 0) {
    console.log(`[db:seed] Shops table already contains ${existingCount} shops. Keeping shops untouched.`);
    return;
  }

  const filePath = resolveCsvPath('shops_and_locations.csv');
  console.log(`[db:seed] Populating initial shops from: ${filePath}`);
  const rows = await readCsvRows(filePath);

  let insertedCount = 0;
  for (const row of rows) {
    const query = `
      INSERT INTO shops (
        shop_id, shop_name, category, owner_name, owner_email, phone_number,
        street_address, locality, city, district, state, pincode,
        latitude, longitude, rating, reviews_count, is_open, opening_hours,
        flood_safety_status, verified_status, bank_upi_id, image_url, created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18,
        $19, $20, $21, $22, $23, $24
      )
      ON CONFLICT (shop_id) DO UPDATE SET
        shop_name = EXCLUDED.shop_name,
        category = EXCLUDED.category,
        owner_name = EXCLUDED.owner_name,
        owner_email = EXCLUDED.owner_email,
        phone_number = EXCLUDED.phone_number,
        street_address = EXCLUDED.street_address,
        locality = EXCLUDED.locality,
        city = EXCLUDED.city,
        district = EXCLUDED.district,
        state = EXCLUDED.state,
        pincode = EXCLUDED.pincode,
        latitude = EXCLUDED.latitude,
        longitude = EXCLUDED.longitude,
        rating = EXCLUDED.rating,
        reviews_count = EXCLUDED.reviews_count,
        is_open = EXCLUDED.is_open,
        opening_hours = EXCLUDED.opening_hours,
        flood_safety_status = EXCLUDED.flood_safety_status,
        verified_status = EXCLUDED.verified_status,
        bank_upi_id = EXCLUDED.bank_upi_id,
        image_url = EXCLUDED.image_url,
        updated_at = EXCLUDED.updated_at;
    `;

    const values = [
      row.shop_id,
      row.shop_name,
      row.category || 'Grocery',
      row.owner_name || '',
      row.owner_email || '',
      row.phone_number || '',
      row.street_address || '',
      row.locality || '',
      row.city || '',
      row.district || '',
      row.state || 'Maharashtra',
      row.pincode || '401202',
      parseNumber(row.latitude, 19.38),
      parseNumber(row.longitude, 72.83),
      parseNumber(row.rating, 4.5),
      parseNumber(row.reviews_count, 0),
      parseBoolean(row.is_open, true),
      row.opening_hours || '08:00 AM - 10:00 PM',
      row.flood_safety_status || 'SAFE',
      row.verified_status || 'APPROVED',
      row.bank_upi_id || '',
      row.image_url || '',
      parseDateOrNull(row.created_at) || new Date(),
      parseDateOrNull(row.updated_at) || new Date(),
    ];

    await client.query(query, values);
    insertedCount++;
  }
  console.log(`[db:seed] Successfully populated ${insertedCount} shops.`);
}

async function upsertStockRow(client, row) {
  const query = `
    INSERT INTO stock (
      product_id, shop_id, shop_name, product_name, category, subcategory,
      barcode, price_inr, mrp_inr, stock_quantity, reserved_quantity,
      unit, low_stock_threshold, is_available, shelf_location, brand,
      description, image_url, last_restocked_date, last_updated
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11,
      $12, $13, $14, $15, $16,
      $17, $18, $19, $20
    )
    ON CONFLICT (product_id) DO UPDATE SET
      shop_id = EXCLUDED.shop_id,
      shop_name = EXCLUDED.shop_name,
      product_name = EXCLUDED.product_name,
      category = EXCLUDED.category,
      subcategory = EXCLUDED.subcategory,
      barcode = EXCLUDED.barcode,
      price_inr = EXCLUDED.price_inr,
      mrp_inr = EXCLUDED.mrp_inr,
      stock_quantity = EXCLUDED.stock_quantity,
      reserved_quantity = EXCLUDED.reserved_quantity,
      unit = EXCLUDED.unit,
      low_stock_threshold = EXCLUDED.low_stock_threshold,
      is_available = EXCLUDED.is_available,
      shelf_location = EXCLUDED.shelf_location,
      brand = EXCLUDED.brand,
      description = EXCLUDED.description,
      image_url = EXCLUDED.image_url,
      last_restocked_date = EXCLUDED.last_restocked_date,
      last_updated = EXCLUDED.last_updated;
  `;

  const values = [
    row.product_id,
    row.shop_id,
    row.shop_name || '',
    row.product_name,
    row.category || 'Grocery',
    row.subcategory || '',
    row.barcode || '',
    parseNumber(row.price_inr, 0),
    parseNumber(row.mrp_inr, 0),
    parseNumber(row.stock_quantity, 0),
    parseNumber(row.reserved_quantity, 0),
    row.unit || '',
    parseNumber(row.low_stock_threshold, 5),
    parseBoolean(row.is_available, true),
    row.shelf_location || '',
    row.brand || '',
    row.description || '',
    row.image_url || '',
    parseDateOrNull(row.last_restocked_date),
    parseDateOrNull(row.last_updated) || new Date(),
  ];

  await client.query(query, values);
}

async function seedStock(client) {
  const filePath = resolveCsvPath('shop_available_stock.csv');
  console.log(`[db:seed] Reading stock from: ${filePath}`);
  const rows = await readCsvRows(filePath);

  const csvProductIds = rows.map(r => r.product_id);
  console.log(`[db:seed] Read ${rows.length} rows from CSV.`);

  // 1. Upsert all rows from the CSV
  let upsertedCount = 0;
  for (const row of rows) {
    await upsertStockRow(client, row);
    upsertedCount++;
  }
  console.log(`[db:seed] Successfully upserted ${upsertedCount} stock rows from CSV.`);

  // 2. Remove stock rows not in the CSV
  const obsoleteRes = await client.query(
    'SELECT product_id FROM stock WHERE product_id != ALL($1::text[])',
    [csvProductIds]
  );

  if (obsoleteRes.rows.length > 0) {
    const obsoleteIds = obsoleteRes.rows.map(r => r.product_id);
    console.log(`[db:seed] Found ${obsoleteIds.length} obsolete stock rows not in CSV. Removing...`);

    // Delete related reservation_items first
    const delItems = await client.query(
      'DELETE FROM reservation_items WHERE product_id = ANY($1::text[])',
      [obsoleteIds]
    );
    console.log(`[db:seed] Deleted ${delItems.rowCount} dependent reservation items.`);

    // Delete any empty reservations
    const delRes = await client.query(
      'DELETE FROM reservations WHERE id NOT IN (SELECT DISTINCT reservation_id FROM reservation_items)'
    );
    console.log(`[db:seed] Cleaned up ${delRes.rowCount} empty reservations.`);

    // Delete obsolete stock rows
    const delStock = await client.query(
      'DELETE FROM stock WHERE product_id = ANY($1::text[])',
      [obsoleteIds]
    );
    console.log(`[db:seed] Removed ${delStock.rowCount} obsolete stock rows.`);
  }

  // 3. Detect any shop that does not have exactly 20 correct products and recreate that shop's products
  // Group expected CSV rows by shop_id
  const expectedByShop = new Map();
  for (const r of rows) {
    if (!expectedByShop.has(r.shop_id)) {
      expectedByShop.set(r.shop_id, []);
    }
    expectedByShop.get(r.shop_id).push(r);
  }

  for (const [shopId, expectedRows] of expectedByShop.entries()) {
    const dbRows = await client.query(
      'SELECT product_id FROM stock WHERE shop_id = $1',
      [shopId]
    );
    const dbIds = new Set(dbRows.rows.map(r => r.product_id));
    const allExpectedPresent = expectedRows.every(r => dbIds.has(r.product_id));

    if (dbRows.rows.length !== 20 || !allExpectedPresent) {
      console.warn(`[db:seed] Shop ${shopId} does not have exactly 20 correct products (found ${dbRows.rows.length}). Recreating shop products...`);
      
      // Clean up reservation items for this shop
      const currentShopIds = dbRows.rows.map(r => r.product_id);
      if (currentShopIds.length > 0) {
        await client.query('DELETE FROM reservation_items WHERE product_id = ANY($1::text[])', [currentShopIds]);
        await client.query('DELETE FROM reservations WHERE id NOT IN (SELECT DISTINCT reservation_id FROM reservation_items)');
        await client.query('DELETE FROM stock WHERE shop_id = $1', [shopId]);
      }

      // Re-insert exact 20 products for this shop
      for (const row of expectedRows) {
        await upsertStockRow(client, row);
      }
      console.log(`[db:seed] Shop ${shopId} successfully recreated with ${expectedRows.length} products.`);
    }
  }

  // 4. Log per-shop counts
  const perShopRes = await client.query(`
    SELECT shop_id, shop_name, count(*) as count
    FROM stock
    GROUP BY shop_id, shop_name
    ORDER BY shop_id ASC;
  `);

  console.log(`========================================================`);
  console.log(`[db:seed] Per-Shop Stock Listings in Database:`);
  let totalDbListings = 0;
  for (const r of perShopRes.rows) {
    const count = parseInt(r.count, 10);
    totalDbListings += count;
    console.log(`  ${r.shop_id} (${r.shop_name}): ${count} products`);
  }
  console.log(`  Total Listings in Database: ${totalDbListings}`);
  console.log(`========================================================`);
}

async function seedAuxiliaryData(client) {
  // Check if users table already populated. Keep users and flood_zones untouched.
  const userCheck = await client.query('SELECT count(*) FROM users');
  const userCount = parseInt(userCheck.rows[0].count, 10);
  if (userCount > 0) {
    console.log(`[db:seed] Users and flood zones already populated (${userCount} users). Keeping untouched.`);
    return;
  }

  console.log(`[db:seed] Seeding initial users and test data...`);

  // Initial users
  const users = [
    { name: 'Rutvi Raut', email: 'rautrutvi@gmail.com', password: 'admin123', role: 'ADMIN', phone: '9999999990' },
    { name: 'Platform Admin', email: 'admin@test.com', password: 'admin123', role: 'ADMIN', phone: '9999999999' },
    { name: 'Test Customer', email: 'customer@test.com', password: 'pass123', role: 'CUSTOMER', phone: '9999999991' },
    { name: 'Test Shopkeeper', email: 'shop@test.com', password: 'pass123', role: 'SHOPKEEPER', phone: '9999999992' },
    { name: 'Vardhman Shah', email: 'vardhman@test.com', password: 'pass123', role: 'SHOPKEEPER', phone: '9890035858' },
    { name: 'Pravin Dedhia', email: 'dedhia@test.com', password: 'pass123', role: 'SHOPKEEPER', phone: '9226139567' },
  ];

  for (const u of users) {
    await client.query(`
      INSERT INTO users (name, email, password, role, phone, active)
      VALUES ($1, $2, $3, $4, $5, TRUE)
      ON CONFLICT (email) DO NOTHING;
    `, [u.name, u.email, u.password, u.role, u.phone]);
  }

  // Sample flood zones
  const floodZones = [
    { areaName: 'Manikpur Waterlogged Area', lat: 19.3820, lng: 72.8280, radiusKm: 0.6, severity: 'ALERT', depth: 45, desc: 'Severe waterlogging near subway' },
    { areaName: 'Anand Nagar Crossroad', lat: 19.3805, lng: 72.8310, radiusKm: 0.4, severity: 'WATCH', depth: 25, desc: 'Moderate water accumulation' },
    { areaName: 'Station Road Bridge', lat: 19.3835, lng: 72.8300, radiusKm: 0.3, severity: 'ALERT', depth: 35, desc: 'Traffic slowed down by storm drain overflow' },
  ];

  for (const f of floodZones) {
    const existing = await client.query('SELECT id FROM flood_zones WHERE area_name = $1', [f.areaName]);
    if (existing.rows.length === 0) {
      await client.query(`
        INSERT INTO flood_zones (area_name, latitude, longitude, radius_km, severity, water_depth_cm, description, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'ACTIVE');
      `, [f.areaName, f.lat, f.lng, f.radiusKm, f.severity, f.depth, f.desc]);
    }
  }

  console.log(`[db:seed] Auxiliary data populated successfully.`);
}

async function runSeed() {
  console.log(`[db:seed] Starting database seed process...`);
  const client = await pool.connect();
  try {
    await client.query('BEGIN;');
    await seedShops(client);
    await seedStock(client);
    await seedAuxiliaryData(client);
    await client.query('COMMIT;');
    console.log(`[db:seed] Database seeding completed successfully!`);
    client.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    await client.query('ROLLBACK;').catch(() => {});
    client.release();
    console.error(`[db:seed] Seeding failed:`, err.message);
    if (!process.env.DB_PASSWORD) {
      console.error(`[db:seed] Tip: DB_PASSWORD is empty in backend/.env.`);
    }
    await pool.end();
    process.exit(1);
  }
}

runSeed();
