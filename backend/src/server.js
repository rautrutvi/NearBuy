import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool, checkConnection, query } from './db/pool.js';
import paymentRoutes from './payments/paymentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Helper: Format Shop object for frontend compatibility
function formatShop(row, distanceKm = null) {
  if (!row) return null;
  const lat = parseFloat(row.latitude);
  const lng = parseFloat(row.longitude);
  const rating = parseFloat(row.rating) || 4.5;
  const reviewsCount = parseInt(row.reviews_count, 10) || 0;

  return {
    id: row.shop_id,
    shop_id: row.shop_id,
    name: row.shop_name,
    shop_name: row.shop_name,
    category: row.category || 'Grocery',
    ownerName: row.owner_name,
    owner_name: row.owner_name,
    ownerEmail: row.owner_email,
    owner_email: row.owner_email,
    phone: row.phone_number || '+91 98221 44556',
    phone_number: row.phone_number,
    address: row.street_address || '',
    street_address: row.street_address || '',
    locality: row.locality || '',
    city: row.city || 'Vasai West',
    district: row.district || 'Palghar',
    state: row.state || 'Maharashtra',
    pincode: row.pincode || '401202',
    latitude: isNaN(lat) ? 19.38 : lat,
    longitude: isNaN(lng) ? 72.83 : lng,
    location: {
      lat: isNaN(lat) ? 19.38 : lat,
      lng: isNaN(lng) ? 72.83 : lng,
    },
    avgRating: rating,
    rating: rating,
    reviewsCount: reviewsCount,
    reviewCount: reviewsCount,
    isOpen: row.is_open === true,
    is_open: row.is_open === true,
    openingHours: row.opening_hours || '08:00 AM - 10:00 PM',
    opening_hours: row.opening_hours || '08:00 AM - 10:00 PM',
    floodStatus: (row.flood_safety_status || 'SAFE').toLowerCase() === 'severe' ? 'alert' : (row.flood_safety_status || 'SAFE').toLowerCase(),
    flood_safety_status: row.flood_safety_status || 'SAFE',
    verified: row.verified_status === 'APPROVED' || row.verified_status === 'VERIFIED',
    verifiedStatus: row.verified_status || 'APPROVED',
    verified_status: row.verified_status || 'APPROVED',
    bankUpiId: row.bank_upi_id,
    bank_upi_id: row.bank_upi_id,
    image: row.image_url || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60',
    imageUrl: row.image_url || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60',
    distanceKm: distanceKm != null ? Number(distanceKm.toFixed(1)) : (row.distance_km != null ? Number(parseFloat(row.distance_km).toFixed(1)) : 0.8),
  };
}

// Helper: Format Product object for frontend compatibility
function formatProduct(row) {
  if (!row) return null;
  const stockCount = parseInt(row.stock_quantity, 10) || 0;
  const lowStockThreshold = parseInt(row.low_stock_threshold, 10) || 5;

  let status = 'in_stock';
  if (stockCount === 0 || row.is_available === false) status = 'out_of_stock';
  else if (stockCount <= lowStockThreshold) status = 'low_stock';

  return {
    id: row.product_id,
    product_id: row.product_id,
    shopId: row.shop_id,
    shop_id: row.shop_id,
    shopName: row.shop_name || 'Local Shop',
    shop_name: row.shop_name || 'Local Shop',
    name: row.product_name,
    product_name: row.product_name,
    category: row.category || 'Grocery',
    subcategory: row.subcategory || '',
    barcode: row.barcode || '',
    price: parseFloat(row.price_inr) || 0,
    price_inr: parseFloat(row.price_inr) || 0,
    mrp: parseFloat(row.mrp_inr) || parseFloat(row.price_inr) || 0,
    mrp_inr: parseFloat(row.mrp_inr) || 0,
    stockCount: stockCount,
    quantity: stockCount,
    stock_quantity: stockCount,
    reservedQuantity: parseInt(row.reserved_quantity, 10) || 0,
    reserved_quantity: parseInt(row.reserved_quantity, 10) || 0,
    unit: row.unit || '',
    lowStockThreshold: lowStockThreshold,
    low_stock_threshold: lowStockThreshold,
    isAvailable: row.is_available === true,
    is_available: row.is_available === true,
    status: status,
    shelfLocation: row.shelf_location || '',
    shelf_location: row.shelf_location || '',
    brand: row.brand || '',
    description: row.description || '',
    image: row.image_url || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&auto=format&fit=crop&q=60',
    imageUrl: row.image_url || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&auto=format&fit=crop&q=60',
    image_url: row.image_url || '',
  };
}

// ─────────────────────────────────────────────────────────────
// Health Check Endpoint
// ─────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res, next) => {
  try {
    const dbRes = await query('SELECT NOW() as now, current_database() as db');
    res.json({
      status: 'UP',
      database: 'connected',
      currentDatabase: dbRes.rows[0].db,
      timestamp: dbRes.rows[0].now,
    });
  } catch (err) {
    res.status(503).json({
      status: 'DOWN',
      database: 'disconnected',
      error: err.message,
    });
  }
});

// ─────────────────────────────────────────────────────────────
// Shops Endpoints
// ─────────────────────────────────────────────────────────────

// GET /api/shops - Fetch all approved shops (optional category filter)
app.get('/api/shops', async (req, res, next) => {
  try {
    const { category } = req.query;
    let sql = 'SELECT * FROM shops WHERE verified_status IN (\'APPROVED\', \'VERIFIED\')';
    const params = [];

    if (category && category !== 'All') {
      sql += ' AND LOWER(category) = LOWER($1)';
      params.push(category);
    }

    sql += ' ORDER BY shop_name ASC';
    const result = await query(sql, params);
    const shops = result.rows.map((row) => formatShop(row));
    res.json(shops);
  } catch (err) {
    next(err);
  }
});

// GET /api/shops/nearby - Nearby shops using Haversine calculation
app.get('/api/shops/nearby', async (req, res, next) => {
  try {
    const lat = parseFloat(req.query.lat) || 19.38;
    const lng = parseFloat(req.query.lng) || 72.83;
    const radiusKm = parseFloat(req.query.radiusKm) || 10.0;

    const sql = `
      SELECT *,
        (6371 * acos(
          cos(radians($1)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians($2)) +
          sin(radians($1)) * sin(radians(latitude))
        )) AS distance_km
      FROM shops
      WHERE verified_status IN ('APPROVED', 'VERIFIED')
      ORDER BY distance_km ASC;
    `;

    const result = await query(sql, [lat, lng]);
    const filtered = result.rows
      .filter((row) => row.distance_km <= radiusKm)
      .map((row) => formatShop(row, row.distance_km));

    res.json(filtered);
  } catch (err) {
    next(err);
  }
});

// GET /api/shops/:shopId - Fetch single shop by ID
app.get('/api/shops/:shopId', async (req, res, next) => {
  try {
    const { shopId } = req.params;
    const result = await query('SELECT * FROM shops WHERE shop_id = $1', [shopId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    res.json(formatShop(result.rows[0]));
  } catch (err) {
    next(err);
  }
});

// GET /api/shopkeeper/shops/mine - Shopkeeper's own shops
app.get('/api/shopkeeper/shops/mine', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM shops ORDER BY created_at ASC');
    res.json(result.rows.map((r) => formatShop(r)));
  } catch (err) {
    next(err);
  }
});

// POST /api/shopkeeper/shops - Register new shop
app.post('/api/shopkeeper/shops', async (req, res, next) => {
  try {
    const b = req.body;
    const newId = `shop-${Date.now()}`;
    const sql = `
      INSERT INTO shops (
        shop_id, shop_name, category, owner_name, owner_email, phone_number,
        street_address, locality, city, district, state, pincode,
        latitude, longitude, is_open, opening_hours, verified_status, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 'PENDING', $17)
      RETURNING *;
    `;
    const params = [
      newId,
      b.name || b.shop_name || 'My New Shop',
      b.category || 'Grocery',
      b.ownerName || b.owner_name || 'Shopkeeper',
      b.ownerEmail || b.owner_email || 'owner@test.com',
      b.phone || b.phone_number || '',
      b.address || b.street_address || '',
      b.locality || '',
      b.city || 'Vasai West',
      b.district || 'Palghar',
      b.state || 'Maharashtra',
      b.pincode || '401202',
      parseFloat(b.latitude || b.location?.lat || 19.38),
      parseFloat(b.longitude || b.location?.lng || 72.83),
      b.isOpen ?? true,
      b.openingHours || '08:00 AM - 10:00 PM',
      b.imageUrl || b.image || '',
    ];

    const result = await query(sql, params);
    res.status(201).json(formatShop(result.rows[0]));
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/shops/pending - Pending shop applications
app.get('/api/admin/shops/pending', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM shops WHERE verified_status = \'PENDING\' ORDER BY created_at DESC');
    res.json(result.rows.map((r) => formatShop(r)));
  } catch (err) {
    next(err);
  }
});

// PUT /api/admin/shops/:shopId/verify - Verify or reject shop
app.put('/api/admin/shops/:shopId/verify', async (req, res, next) => {
  try {
    const { shopId } = req.params;
    const { status } = req.body;
    const newStatus = (status === 'APPROVED' || status === 'VERIFIED') ? 'APPROVED' : 'REJECTED';
    const result = await query(
      'UPDATE shops SET verified_status = $1, updated_at = NOW() WHERE shop_id = $2 RETURNING *',
      [newStatus, shopId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Shop not found' });
    }
    res.json(formatShop(result.rows[0]));
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// Products Endpoints
// ─────────────────────────────────────────────────────────────

// GET /api/shops/:shopId/products - Products for a shop
app.get('/api/shops/:shopId/products', async (req, res, next) => {
  try {
    const { shopId } = req.params;
    const result = await query(
      'SELECT * FROM stock WHERE shop_id = $1 ORDER BY product_name ASC',
      [shopId]
    );
    res.json(result.rows.map((r) => formatProduct(r)));
  } catch (err) {
    next(err);
  }
});

// GET /api/products/search - Search products across all shops or by category/barcode
app.get('/api/products/search', async (req, res, next) => {
  try {
    const { query: searchQuery, category } = req.query;
    let sql = 'SELECT * FROM stock WHERE 1=1';
    const params = [];
    let paramIndex = 1;

    if (searchQuery && searchQuery.trim()) {
      const q = `%${searchQuery.trim()}%`;
      sql += ` AND (product_name ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR barcode = $${paramIndex + 1} OR shop_name ILIKE $${paramIndex})`;
      params.push(q, searchQuery.trim());
      paramIndex += 2;
    }

    if (category && category !== 'All') {
      sql += ` AND LOWER(category) = LOWER($${paramIndex})`;
      params.push(category);
      paramIndex++;
    }

    sql += ' ORDER BY product_name ASC LIMIT 100';
    const result = await query(sql, params);
    res.json(result.rows.map((r) => formatProduct(r)));
  } catch (err) {
    next(err);
  }
});

// GET /api/shopkeeper/products - Shopkeeper inventory
app.get('/api/shopkeeper/products', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM stock ORDER BY last_updated DESC LIMIT 150');
    res.json(result.rows.map((r) => formatProduct(r)));
  } catch (err) {
    next(err);
  }
});

// POST /api/shopkeeper/products - Add product
app.post('/api/shopkeeper/products', async (req, res, next) => {
  try {
    const p = req.body;
    const newId = `prod-${Date.now()}`;
    const sql = `
      INSERT INTO stock (
        product_id, shop_id, shop_name, product_name, category, barcode,
        price_inr, stock_quantity, low_stock_threshold, description, image_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *;
    `;
    const params = [
      newId,
      p.shopId || p.shop_id || 'shop-1',
      p.shopName || p.shop_name || 'Vardhman Grain Stores',
      p.name || p.product_name || 'New Item',
      p.category || 'Grocery',
      p.barcode || '',
      parseFloat(p.price || p.price_inr || 0),
      parseInt(p.stockCount || p.quantity || p.stock_quantity || 10, 10),
      parseInt(p.lowStockThreshold || p.low_stock_threshold || 5, 10),
      p.description || '',
      p.imageUrl || p.image || '',
    ];
    const result = await query(sql, params);
    res.status(201).json(formatProduct(result.rows[0]));
  } catch (err) {
    next(err);
  }
});

// PUT /api/shopkeeper/products/:id - Update product
app.put('/api/shopkeeper/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const p = req.body;
    const sql = `
      UPDATE stock SET
        product_name = COALESCE($1, product_name),
        category = COALESCE($2, category),
        price_inr = COALESCE($3, price_inr),
        stock_quantity = COALESCE($4, stock_quantity),
        barcode = COALESCE($5, barcode),
        description = COALESCE($6, description),
        last_updated = NOW()
      WHERE product_id = $7
      RETURNING *;
    `;
    const params = [
      p.name || p.product_name,
      p.category,
      p.price != null ? parseFloat(p.price) : (p.price_inr != null ? parseFloat(p.price_inr) : null),
      p.stockCount != null ? parseInt(p.stockCount, 10) : (p.quantity != null ? parseInt(p.quantity, 10) : null),
      p.barcode,
      p.description,
      id,
    ];
    const result = await query(sql, params);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(formatProduct(result.rows[0]));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/shopkeeper/products/:id - Delete product
app.delete('/api/shopkeeper/products/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM stock WHERE product_id = $1', [id]);
    res.json({ success: true, id });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/shopkeeper/products/:id/stock - Stock delta update
app.patch('/api/shopkeeper/products/:id/stock', async (req, res, next) => {
  try {
    const { id } = req.params;
    const delta = parseInt(req.body.delta, 10) || 0;
    const sql = `
      UPDATE stock
      SET
        stock_quantity = GREATEST(0, stock_quantity + $1),
        is_available = (stock_quantity + $1 > 0),
        last_updated = NOW()
      WHERE product_id = $2
      RETURNING *;
    `;
    const result = await query(sql, [delta, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(formatProduct(result.rows[0]));
  } catch (err) {
    next(err);
  }
});

// POST /api/shopkeeper/scan-sell - Scan barcode and sell
app.post('/api/shopkeeper/scan-sell', async (req, res, next) => {
  try {
    const { barcode, quantity = 1 } = req.body;
    const qty = parseInt(quantity, 10) || 1;
    const findRes = await query('SELECT * FROM stock WHERE barcode = $1 LIMIT 1', [barcode]);
    if (findRes.rows.length === 0) {
      return res.status(404).json({ error: `Barcode ${barcode} not found` });
    }
    const product = findRes.rows[0];
    const updateRes = await query(`
      UPDATE stock
      SET
        stock_quantity = GREATEST(0, stock_quantity - $1),
        is_available = (stock_quantity - $1 > 0),
        last_updated = NOW()
      WHERE product_id = $2
      RETURNING *;
    `, [qty, product.product_id]);

    res.json(formatProduct(updateRes.rows[0]));
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// Auth Endpoints
// ─────────────────────────────────────────────────────────────

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await query('SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const user = result.rows[0];
    // In production, compare with bcrypt. For dev/demo, match plain or standard test passwords
    if (user.password !== password && password !== 'admin123' && password !== 'pass123') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.json({
      token: `nb-jwt-token-${user.id}-${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        active: user.active,
      },
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/auth/signup', async (req, res, next) => {
  try {
    const { name, email, password, role = 'CUSTOMER', phone } = req.body;
    const existing = await query('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const insertRes = await query(`
      INSERT INTO users (name, email, password, role, phone, active)
      VALUES ($1, $2, $3, $4, $5, TRUE)
      RETURNING id, name, email, role, phone, active;
    `, [name, email, password, role.toUpperCase(), phone]);

    const user = insertRes.rows[0];
    res.status(201).json({
      token: `nb-jwt-token-${user.id}-${Date.now()}`,
      user,
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/auth/me', async (req, res, next) => {
  try {
    // Return default customer if no token provided
    const userRes = await query('SELECT id, name, email, role, phone, active FROM users ORDER BY id ASC LIMIT 1');
    if (userRes.rows.length > 0) {
      return res.json(userRes.rows[0]);
    }
    res.json({ id: 1, name: 'Customer', email: 'customer@test.com', role: 'CUSTOMER', active: true });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// Reservations Endpoints
// ─────────────────────────────────────────────────────────────

app.get('/api/customer/reservations', async (req, res, next) => {
  try {
    const resList = await query('SELECT * FROM reservations ORDER BY reserved_at DESC LIMIT 50');
    const reservations = [];
    for (const r of resList.rows) {
      const itemsRes = await query('SELECT * FROM reservation_items WHERE reservation_id = $1', [r.id]);
      reservations.push({
        id: r.id,
        shopId: r.shop_id,
        shopName: r.shop_name,
        shopAddress: r.shop_address,
        totalAmount: parseFloat(r.total_amount) || 0,
        status: (r.status || 'PENDING').toLowerCase(),
        reservedAt: r.reserved_at,
        pickupDeadlineMinutes: 30,
        verificationCode: r.verification_code || `NB-${r.id}`,
        paid: r.paid === true,
        items: itemsRes.rows.map((i) => ({
          productId: i.product_id,
          productName: i.product_name,
          quantity: i.quantity,
          unitPrice: parseFloat(i.unit_price) || 0,
        })),
      });
    }
    res.json(reservations);
  } catch (err) {
    next(err);
  }
});

app.get('/api/shopkeeper/reservations', async (req, res, next) => {
  try {
    const resList = await query('SELECT * FROM reservations ORDER BY reserved_at DESC LIMIT 50');
    const reservations = [];
    for (const r of resList.rows) {
      const itemsRes = await query('SELECT * FROM reservation_items WHERE reservation_id = $1', [r.id]);
      reservations.push({
        id: r.id,
        shopId: r.shop_id,
        shopName: r.shop_name,
        shopAddress: r.shop_address,
        totalAmount: parseFloat(r.total_amount) || 0,
        status: (r.status || 'PENDING').toLowerCase(),
        reservedAt: r.reserved_at,
        pickupDeadlineMinutes: 30,
        verificationCode: r.verification_code || `NB-${r.id}`,
        paid: r.paid === true,
        items: itemsRes.rows.map((i) => ({
          productId: i.product_id,
          productName: i.product_name,
          quantity: i.quantity,
          unitPrice: parseFloat(i.unit_price) || 0,
        })),
      });
    }
    res.json(reservations);
  } catch (err) {
    next(err);
  }
});

app.post('/api/customer/reservations', async (req, res, next) => {
  try {
    const { shopId, items = [] } = req.body;
    const shopRes = await query('SELECT * FROM shops WHERE shop_id = $1', [String(shopId)]);
    const shop = shopRes.rows[0] || {};

    let total = 0;
    const itemRecords = [];
    for (const item of items) {
      const pRes = await query('SELECT * FROM stock WHERE product_id = $1', [String(item.productId)]);
      const product = pRes.rows[0];
      const price = product ? parseFloat(product.price_inr) : 50;
      const name = product ? product.product_name : 'Item';
      const qty = parseInt(item.quantity, 10) || 1;
      total += price * qty;
      itemRecords.push({ productId: item.productId, productName: name, quantity: qty, unitPrice: price });

      // Reserve stock
      if (product) {
        await query(`
          UPDATE stock
          SET stock_quantity = GREATEST(0, stock_quantity - $1),
              reserved_quantity = reserved_quantity + $1
          WHERE product_id = $2
        `, [qty, product.product_id]);
      }
    }

    const verificationCode = `NB-${Math.floor(1000 + Math.random() * 9000)}`;
    const insRes = await query(`
      INSERT INTO reservations (shop_id, shop_name, shop_address, total_amount, status, verification_code, paid)
      VALUES ($1, $2, $3, $4, 'PENDING', $5, FALSE)
      RETURNING *;
    `, [shop.shop_id || shopId, shop.shop_name || 'Local Shop', shop.street_address || '', total, verificationCode]);

    const resRecord = insRes.rows[0];
    for (const it of itemRecords) {
      await query(`
        INSERT INTO reservation_items (reservation_id, product_id, product_name, quantity, unit_price)
        VALUES ($1, $2, $3, $4, $5)
      `, [resRecord.id, it.productId, it.productName, it.quantity, it.unitPrice]);
    }

    res.status(201).json({
      id: resRecord.id,
      shopId: resRecord.shop_id,
      shopName: resRecord.shop_name,
      shopAddress: resRecord.shop_address,
      totalAmount: total,
      status: 'pending',
      reservedAt: resRecord.reserved_at,
      pickupDeadlineMinutes: 30,
      verificationCode: verificationCode,
      paid: false,
      items: itemRecords,
    });
  } catch (err) {
    next(err);
  }
});

app.put('/api/shopkeeper/reservations/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updateRes = await query(
      'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
      [status.toUpperCase(), parseInt(id, 10)]
    );
    if (updateRes.rows.length === 0) return res.status(404).json({ error: 'Reservation not found' });
    const r = updateRes.rows[0];
    const itemsRes = await query('SELECT * FROM reservation_items WHERE reservation_id = $1', [r.id]);
    res.json({
      id: r.id,
      shopId: r.shop_id,
      shopName: r.shop_name,
      totalAmount: parseFloat(r.total_amount),
      status: r.status.toLowerCase(),
      reservedAt: r.reserved_at,
      verificationCode: r.verification_code,
      paid: r.paid,
      items: itemsRes.rows,
    });
  } catch (err) {
    next(err);
  }
});

app.post('/api/customer/reservations/:id/pay', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateRes = await query(
      'UPDATE reservations SET paid = TRUE WHERE id = $1 RETURNING *',
      [parseInt(id, 10)]
    );
    if (updateRes.rows.length === 0) return res.status(404).json({ error: 'Reservation not found' });
    const r = updateRes.rows[0];
    res.json({ id: r.id, paid: true, status: r.status.toLowerCase() });
  } catch (err) {
    next(err);
  }
});

app.get('/api/shopkeeper/stats', async (req, res, next) => {
  try {
    const pendingRes = await query('SELECT COUNT(*) FROM reservations WHERE UPPER(status) = \'PENDING\'');
    const readyRes = await query('SELECT COUNT(*) FROM reservations WHERE UPPER(status) = \'READY\'');
    const completedRes = await query('SELECT COUNT(*) FROM reservations WHERE UPPER(status) = \'PICKED_UP\'');

    res.json({
      pendingOrders: parseInt(pendingRes.rows[0].count, 10) || 0,
      readyOrders: parseInt(readyRes.rows[0].count, 10) || 0,
      completedToday: parseInt(completedRes.rows[0].count, 10) || 0,
    });
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// Reviews Endpoints
// ─────────────────────────────────────────────────────────────

app.get('/api/shops/:shopId/reviews', async (req, res, next) => {
  try {
    const { shopId } = req.params;
    const result = await query(
      'SELECT * FROM reviews WHERE shop_id = $1 ORDER BY created_at DESC',
      [shopId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.post('/api/customer/reviews', async (req, res, next) => {
  try {
    const { shopId, rating = 5, comment = '' } = req.body;
    const ins = await query(`
      INSERT INTO reviews (shop_id, rating, comment)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [shopId, rating, comment]);
    res.status(201).json(ins.rows[0]);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// Flood Zones Endpoints
// ─────────────────────────────────────────────────────────────

app.get('/api/flood-zones/active', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM flood_zones WHERE status = \'ACTIVE\' ORDER BY reported_at DESC');
    const mapped = result.rows.map((f) => ({
      id: f.id,
      areaName: f.area_name,
      area: f.area_name,
      latitude: parseFloat(f.latitude),
      longitude: parseFloat(f.longitude),
      location: { lat: parseFloat(f.latitude), lng: parseFloat(f.longitude) },
      radiusKm: parseFloat(f.radius_km),
      radiusMeters: Math.round(parseFloat(f.radius_km) * 1000),
      severity: (f.severity || 'MODERATE').toUpperCase(),
      waterDepthCm: f.water_depth_cm || 20,
      waterLevel: `${f.water_depth_cm || 20} cm`,
      description: f.description,
      status: f.status,
      reportedAt: f.reported_at,
      reportedByName: f.reported_by_name || 'Community Member',
    }));
    res.json(mapped);
  } catch (err) {
    next(err);
  }
});

app.post('/api/reports/flood', async (req, res, next) => {
  try {
    const b = req.body;
    const ins = await query(`
      INSERT INTO flood_zones (area_name, latitude, longitude, radius_km, severity, water_depth_cm, description, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'ACTIVE')
      RETURNING *;
    `, [
      b.areaName || b.area || 'Vasai West Area',
      parseFloat(b.latitude || b.lat || 19.38),
      parseFloat(b.longitude || b.lng || 72.83),
      parseFloat(b.radiusKm || 0.5),
      (b.severity || 'MODERATE').toUpperCase(),
      parseInt(b.waterDepthCm || 20, 10),
      b.description || 'Water accumulation reported',
    ]);
    const f = ins.rows[0];
    res.status(201).json({
      id: f.id,
      areaName: f.area_name,
      location: { lat: parseFloat(f.latitude), lng: parseFloat(f.longitude) },
      severity: f.severity,
      waterDepthCm: f.water_depth_cm,
      status: f.status,
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/admin/flood-zones/pending', async (req, res, next) => {
  try {
    const result = await query('SELECT * FROM flood_zones WHERE status = \'PENDING\'');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.put('/api/admin/flood-zones/:id/verify', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status = 'ACTIVE' } = req.body;
    const result = await query('UPDATE flood_zones SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
    res.json(result.rows[0] || {});
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// Admin Platform Endpoints
// ─────────────────────────────────────────────────────────────

app.get('/api/admin/stats', async (req, res, next) => {
  try {
    const [usersCount, shopsCount, pendingShopsCount, floodCount, resCount] = await Promise.all([
      query('SELECT COUNT(*) FROM users'),
      query('SELECT COUNT(*) FROM shops WHERE verified_status = \'APPROVED\''),
      query('SELECT COUNT(*) FROM shops WHERE verified_status = \'PENDING\''),
      query('SELECT COUNT(*) FROM flood_zones WHERE status = \'ACTIVE\''),
      query('SELECT COUNT(*) FROM reservations'),
    ]);

    res.json({
      totalUsers: parseInt(usersCount.rows[0].count, 10) || 0,
      totalShops: parseInt(shopsCount.rows[0].count, 10) || 0,
      pendingShops: parseInt(pendingShopsCount.rows[0].count, 10) || 0,
      activeFloodZones: parseInt(floodCount.rows[0].count, 10) || 0,
      pendingFloodZones: 0,
      totalReservations: parseInt(resCount.rows[0].count, 10) || 0,
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/admin/users', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 0;
    const size = parseInt(req.query.size, 10) || 10;
    const offset = page * size;

    const [usersRes, totalRes] = await Promise.all([
      query('SELECT id, name, email, role, phone, active, created_at FROM users ORDER BY id ASC LIMIT $1 OFFSET $2', [size, offset]),
      query('SELECT COUNT(*) FROM users'),
    ]);

    res.json({
      content: usersRes.rows,
      totalElements: parseInt(totalRes.rows[0].count, 10) || 0,
      totalPages: Math.ceil((parseInt(totalRes.rows[0].count, 10) || 0) / size),
      number: page,
    });
  } catch (err) {
    next(err);
  }
});

app.put('/api/admin/users/:userId/status', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { active } = req.body;
    const result = await query('UPDATE users SET active = $1 WHERE id = $2 RETURNING id, name, email, active', [active, userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// ─────────────────────────────────────────────────────────────
// Centralized Error Handler
app.use(paymentRoutes);

app.use(paymentRoutes);

// ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(`[API Error] ${req.method} ${req.url}:`, err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// Start Server
async function startServer() {
  console.log(`[NearBuy Backend] Starting server...`);
  // Startup connection check to PostgreSQL
  const dbConnected = await checkConnection();
  if (!dbConnected) {
    console.warn(`[NearBuy Backend] Warning: Database connection failed. Please ensure PostgreSQL is running and DB_PASSWORD in backend/.env is set.`);
  }

  app.listen(PORT, () => {
    console.log(`[NearBuy Backend] API server listening on http://localhost:${PORT}`);
    console.log(`[NearBuy Backend] Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer();
