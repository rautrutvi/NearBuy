import express from 'express';
import { query } from '../db/pool.js';
import { createPaymentsTable } from '../db/paymentsSchema.js'; // ensures table exists
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import { pool } from '../db/pool.js';
import { verifyAuth } from '../middleware/auth.js'; // assuming auth middleware exists

const router = express.Router();

// Mock UPI gateway – generates a unique transaction ID
function mockUpiGateway() {
  const date = format(new Date(), 'yyyyMMdd');
  const random = Math.floor(100000 + Math.random() * 900000);
  return `NB${date}${random}`;
}

// POST /api/customer/reservations/:id/pay
router.post('/api/customer/reservations/:id/pay', verifyAuth, async (req, res) => {
  const reservationId = parseInt(req.params.id, 10);
  // Ensure reservation exists
  const resRes = await query('SELECT * FROM reservations WHERE id = $1', [reservationId]);
  if (resRes.rows.length === 0) return res.status(404).json({ error: 'Reservation not found' });
  const reservation = resRes.rows[0];

  // Check if a payment already exists
  const payCheck = await query('SELECT * FROM payments WHERE reservation_id = $1', [reservationId]);
  if (payCheck.rows.length > 0) {
    // Return existing payment
    return res.json(payCheck.rows[0]);
  }

  // Simulate payment via mock UPI
  const txnId = mockUpiGateway();
  const amount = parseFloat(reservation.total_amount) || 0;
  const method = 'UPI';
  const status = 'SUCCESS';
  const insertRes = await query(
    `INSERT INTO payments (reservation_id, txn_id, method, amount, status)
     VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
    [reservationId, txnId, method, amount, status]
  );

  // Mark reservation as paid
  await query('UPDATE reservations SET paid = TRUE, status = $1 WHERE id = $2', ['PAID', reservationId]);

  res.status(201).json(insertRes.rows[0]);
});

// Helper to fetch reservation with items and buyer/shop details
async function fetchReservationDetails(reservationId) {
  const resRes = await query('SELECT * FROM reservations WHERE id = $1', [reservationId]);
  const reservation = resRes.rows[0];
  const itemsRes = await query('SELECT * FROM reservation_items WHERE reservation_id = $1', [reservationId]);
  const shopRes = await query('SELECT * FROM shops WHERE shop_id = $1', [reservation.shop_id]);
  const shop = shopRes.rows[0];
  const userRes = await query('SELECT * FROM users WHERE id = $1', [reservation.user_id]);
  const buyer = userRes.rows[0];
  return { reservation, items: itemsRes.rows, shop, buyer };
}

// GET /api/customer/reservations/:id/receipt – PDF receipt
router.get('/api/customer/reservations/:id/receipt', verifyAuth, async (req, res) => {
  const reservationId = parseInt(req.params.id, 10);
  const { reservation, items, shop, buyer } = await fetchReservationDetails(reservationId);
  if (!reservation) return res.status(404).json({ error: 'Reservation not found' });

  // Authorization – ensure the caller is the buyer or the shop vendor (owner)
  const callerId = req.user.id; // populated by verifyAuth
  const isBuyer = buyer && callerId === buyer.id;
  const isVendor = shop && callerId === shop.owner_id; // assume owner_id column exists
  if (!isBuyer && !isVendor) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const doc = new PDFDocument({ margin: 40 });
  const chunks = [];
  doc.on('data', (chunk) => chunks.push(chunk));
  doc.on('end', () => {
    const pdfBuffer = Buffer.concat(chunks);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${reservationId}.pdf`);
    res.send(pdfBuffer);
  });

  // Header
  doc.fontSize(20).text('NearBuy', { align: 'center' }).moveDown();
  doc.fontSize(12).text(`Bill No: ${reservation.id}`);
  doc.text(`Transaction ID: ${reservation.txn_id || 'N/A'}`);
  const now = new Date();
  doc.text(`Date: ${format(now, 'dd/MM/yyyy HH:mm:ss')} IST`);
  doc.text(`Method: UPI`);
  doc.text(`Status: Paid`);
  doc.moveDown();

  // Buyer & Shop Info
  doc.text(`Buyer: ${buyer?.name || 'Customer'} (${buyer?.email || ''})`);
  doc.text(`Shop: ${shop?.shop_name || ''}`);
  doc.text(`Address: ${shop?.street_address || ''}, ${shop?.city || ''}`);
  doc.moveDown();

  // Items table
  doc.font('Helvetica-Bold');
  doc.text('Item', 50, doc.y, { continued: true });
  doc.text('Qty', 250, doc.y, { continued: true });
  doc.text('Unit Price (Rs.)', 300, doc.y, { continued: true });
  doc.text('Total (Rs.)', 420, doc.y);
  doc.font('Helvetica');
  let grandTotal = 0;
  items.forEach((it) => {
    const lineTotal = parseFloat(it.unit_price) * it.quantity;
    grandTotal += lineTotal;
    doc.text(it.product_name, 50, doc.y, { continued: true });
    doc.text(String(it.quantity), 250, doc.y, { continued: true });
    doc.text(it.unit_price.toFixed(2), 300, doc.y, { continued: true });
    doc.text(lineTotal.toFixed(2), 420, doc.y);
  });
  doc.moveDown();
  doc.font('Helvetica-Bold').text(`Grand Total: Rs. ${grandTotal.toFixed(2)}`);
  doc.moveDown();
  doc.font('Helvetica').text('Please pick up your items within 30 minutes of payment.');
  doc.moveDown();
  doc.text('Demo transaction'); // footer constant

  doc.end();
});

export default router;
