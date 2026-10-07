# NearBuy Backend

NearBuy is a hyper-local offline-first commerce & disaster resilience platform built with Spring Boot 4.x (Java 17 / JDK 26 compatible), Spring Security 7, Spring Data JPA, PostgreSQL, and JWT.

---

## Run backend locally

### 1. Prerequisites
- **Java**: JDK 17 or higher (tested and verified on JDK 26)
- **Database**: PostgreSQL (running locally on port `5432`)
- **Maven**: Bundled Maven wrapper (`./mvnw` or `.\mvnw.cmd`)

### 2. Setup PostgreSQL Database
Make sure PostgreSQL is running on `localhost:5432`. Create the database:
```sql
CREATE DATABASE nearbuy_db;
```

### 3. Environment Variables
Set the database password environment variable (and optionally JWT secret):
```bash
# Windows PowerShell
$env:DB_PASSWORD="your_postgres_password"

# Windows Command Prompt
set DB_PASSWORD=your_postgres_password

# Linux / macOS Bash
export DB_PASSWORD=your_postgres_password
```

### 4. Build and Run
From the `backend` directory:
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```
The server will start on `http://localhost:8080`.

### 5. Automated Tests
Run the complete integration and unit test suite:
```bash
# Windows
.\mvnw.cmd test

# Linux / macOS
./mvnw test
```

---

## Seed Test Accounts

On first startup with an empty database, `DataSeeder` automatically populates default accounts, shops, products with barcodes, and flood zones near Virar, Maharashtra:

| Role | Email | Password | Description |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@test.com` | `admin123` | Platform Admin (approvals, user suspend/activate, stats) |
| **CUSTOMER** | `customer@test.com` | `pass123` | Buyer account (place reservations, pay, review, report flood) |
| **SHOPKEEPER** | `shop@test.com` | `pass123` | Vendor account (manage shop, inventory, scan-to-sell) |
| **SHOPKEEPER** | `sharma@test.com` | `pass123` | Sharma General Kirana & Provisions |
| **SHOPKEEPER** | `lifecare@test.com` | `pass123` | Lifecare Medical & Monsoon Pharmacy |
| **SHOPKEEPER** | `gupta@test.com` | `pass123` | Gupta Hardware & Monsoon Safety Tools |
| **SHOPKEEPER** | `apex@test.com` | `pass123` | Apex Supermarket & Daily Essentials |
| **SHOPKEEPER** | `ravi@test.com` | `pass123` | Ravi Electronics (PENDING) |
| **SHOPKEEPER** | `preeti@test.com` | `pass123` | Preeti Organic Vegetables (PENDING) |

---

## API Documentation & Postman Collection

A complete Postman collection is located at:
`backend/postman/nearbuy.json`

Import this collection into Postman to test all endpoints across:
- **Phase A**: Auth & Security (`/api/auth/**`)
- **Phase B**: Shops & Geospatial (`/api/shops/**`, `/api/shopkeeper/shops/**`, `/api/admin/shops/**`)
- **Phase C**: Products & Inventory (`/api/products/**`, `/api/shopkeeper/products/**`)
- **Phase D**: Reservations & Schedulers (`/api/customer/reservations/**`, `/api/shopkeeper/reservations/**`, `/api/shopkeeper/stats`)
- **Phase E**: Verified Reviews (`/api/customer/reviews`, `/api/shops/{shopId}/reviews`)
- **Phase F**: Flood Zones (`/api/reports/flood`, `/api/flood-zones/active`, `/api/admin/flood-zones/**`)
- **Phase G**: Scan-to-Sell & Platform Administration (`/api/shopkeeper/scan-sell`, `/api/admin/users/**`, `/api/admin/stats`)
- **Phase H**: Seed Data & Geographic coordinates
