# NearBuy - Hyper-Local Grocery Discovery & Disaster Resilience (Vasai West)

NearBuy is a hyper-local grocery discovery, real-time inventory tracking, and disaster-resilient commerce platform for Vasai West, Maharashtra.

---

## Architecture Overview

- **Frontend**: Vite + React 18 + Tailwind CSS (located in `src/`, served on `http://localhost:5173`).
- **Backend API**: Node.js + Express + `pg` connection pool (located in `backend/`, served on `http://localhost:5000`).
- **Database**: PostgreSQL 17 on `localhost:5432`, database: `nearbuy_app`.
- **Vite Proxy**: Configured in `vite.config.js` to proxy `/api/*` requests from port 5173 to `http://localhost:5000`.
- **Master Datasets**:
  - `csv_files/shops_and_locations.csv`: 6 verified grocery stores across Vasai West with geolocation coordinates.
  - `csv_files/shop_available_stock.csv`: 348 inventory items with prices, stock levels, barcodes, and categories.

---

## Prerequisites

1. **Node.js**: v18 or higher (tested on Node.js v25).
2. **PostgreSQL 17**: Running locally on `localhost:5432`.
   - *Note*: Existing database `nearbuy_db` is untouched and preserved. The application exclusively uses `nearbuy_app`.

---

## Quick Start & Run Steps

### 1. Install Dependencies
Run from the project root:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the example environment configuration to `backend/.env`:
```bash
cp backend/.env.example backend/.env
```
Default configuration in `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_NAME=nearbuy_app
```
> **Note**: If your local PostgreSQL instance requires a password, enter it in `DB_PASSWORD`. If local trust authentication is enabled, it may be left blank.

### 3. Create Database
Connects to the default `postgres` system database and safely creates `nearbuy_app` only if it does not already exist:
```bash
npm run db:create
```

### 4. Setup Tables & Indexes
Creates the `shops` and `stock` tables based on the actual CSV headers, establishes the foreign key relationship (`stock.shop_id -> shops.shop_id`), and builds indexes on `(latitude, longitude)` and `product_name`:
```bash
npm run db:setup
```

### 5. Seed Data from CSVs (Idempotent)
Imports all 6 grocery stores and 348 catalog products using PostgreSQL upsert (`ON CONFLICT ... DO UPDATE`):
```bash
npm run db:seed
```
*Re-running `npm run db:seed` is completely safe and produces no duplicate records.*

### 6. Start Full Application (Backend + Frontend)
Starts both the Express backend and the Vite frontend simultaneously using `concurrently`:
```bash
npm run dev
```

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## Database Schema

### `shops` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `shop_id` | `VARCHAR(50)` | `PRIMARY KEY` | Store ID (e.g. `shop-1`) |
| `shop_name` | `VARCHAR(255)` | `NOT NULL` | Business store name |
| `category` | `VARCHAR(100)` | | Retail category (`Grocery`) |
| `owner_name` | `VARCHAR(255)` | | Contact person |
| `owner_email` | `VARCHAR(255)` | | Vendor email |
| `phone_number` | `VARCHAR(50)` | | Contact number |
| `street_address` | `TEXT` | | Physical address |
| `locality` | `VARCHAR(100)` | | Area name |
| `city` | `VARCHAR(100)` | | City (`Vasai West`) |
| `district` | `VARCHAR(100)` | | District (`Palghar`) |
| `state` | `VARCHAR(100)` | | State (`Maharashtra`) |
| `pincode` | `VARCHAR(20)` | | Postal code (`401202`) |
| `latitude` | `DOUBLE PRECISION` | Indexed | GPS Latitude |
| `longitude` | `DOUBLE PRECISION` | Indexed | GPS Longitude |
| `rating` | `NUMERIC(3,2)` | Default: `0.0` | Store rating |
| `reviews_count` | `INT` | Default: `0` | Total review count |
| `is_open` | `BOOLEAN` | Default: `TRUE` | Store operational status |
| `opening_hours` | `VARCHAR(100)` | | Daily working hours |
| `flood_safety_status`| `VARCHAR(50)` | Default: `SAFE`| `SAFE`, `WATCH`, or `ALERT` |
| `verified_status` | `VARCHAR(50)` | Default: `APPROVED` | Verification status |
| `bank_upi_id` | `VARCHAR(100)` | | UPI ID for payments |
| `image_url` | `TEXT` | | Storefront photo URL |
| `created_at` | `TIMESTAMPTZ` | | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | | Modification timestamp |

### `stock` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `product_id` | `VARCHAR(50)` | `PRIMARY KEY` | Unique SKU (`prod-0001` .. `prod-0348`) |
| `shop_id` | `VARCHAR(50)` | `NOT NULL`, `FK -> shops(shop_id)` | Owning store ID |
| `shop_name` | `VARCHAR(255)` | | Owning store name |
| `product_name` | `VARCHAR(255)` | `NOT NULL`, Indexed | Full product title |
| `category` | `VARCHAR(100)` | Indexed | Department |
| `subcategory` | `VARCHAR(100)` | | Specific category |
| `barcode` | `VARCHAR(50)` | Indexed | 13-digit EAN barcode |
| `price_inr` | `NUMERIC(10,2)` | `NOT NULL` | Selling price (INR) |
| `mrp_inr` | `NUMERIC(10,2)` | | MRP in INR |
| `stock_quantity` | `INT` | Default: `0` | Available inventory count |
| `reserved_quantity`| `INT` | Default: `0` | Units reserved by customers |
| `unit` | `VARCHAR(50)` | | Packaging size (e.g. `5 kg bag`) |
| `low_stock_threshold`| `INT` | Default: `5` | Low stock trigger level |
| `is_available` | `BOOLEAN` | Default: `TRUE` | Stock availability flag |
| `shelf_location` | `VARCHAR(100)` | | Aisle / Shelf / Rack |
| `brand` | `VARCHAR(100)` | | Brand name |
| `description` | `TEXT` | | Item description |
| `image_url` | `TEXT` | | Product image URL |
| `last_restocked_date`| `DATE` | | Restock batch date |
| `last_updated` | `TIMESTAMPTZ` | | Last update timestamp |

---

## API Routes & Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health & PostgreSQL connection status |
| `GET` | `/api/shops` | List all approved shops (optional `?category=...`) |
| `GET` | `/api/shops/:shopId` | Fetch single shop by ID |
| `GET` | `/api/shops/nearby` | Geospatial nearby shops (`?lat=..&lng=..&radiusKm=..`) |
| `GET` | `/api/shops/:shopId/products` | Fetch all products for a given shop |
| `GET` | `/api/products/search` | Search products across shops (`?query=..&category=..`) |
| `GET` | `/api/shopkeeper/products` | Shopkeeper inventory list |
| `POST` | `/api/shopkeeper/products` | Add new product SKU |
| `PUT` | `/api/shopkeeper/products/:id` | Update existing product |
| `DELETE`| `/api/shopkeeper/products/:id` | Remove product |
| `PATCH`| `/api/shopkeeper/products/:id/stock` | Adjust stock delta (`{ delta: +1/-1 }`) |
| `POST` | `/api/shopkeeper/scan-sell` | Quick barcode scan-to-sell |
| `POST` | `/api/auth/login` | User login (Customer / Shopkeeper / Admin) |
| `POST` | `/api/auth/signup` | Register new user account |
| `GET` | `/api/auth/me` | Fetch active user profile |
| `GET` | `/api/customer/reservations` | Buyer reservation history |
| `POST` | `/api/customer/reservations` | Create 30-minute pickup reservation |
| `POST` | `/api/customer/reservations/:id/pay` | Simulate payment for reservation |
| `GET` | `/api/flood-zones/active` | Active flood and waterlogging alerts |
| `POST` | `/api/reports/flood` | Crowdsource flood incident report |
| `GET` | `/api/admin/stats` | Platform metrics & stats |
| `GET` | `/api/admin/users` | Admin user directory |
