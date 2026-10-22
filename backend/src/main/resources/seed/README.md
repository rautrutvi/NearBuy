# NearBuy CSV Data Directory

This directory stores master datasets for offline synchronization, bulk imports, and manual or automated editing.

---

## 1. `shops_and_locations.csv`
Contains store profiles, precise geolocation, owner contact information, and verification status for all 6 grocery malls in Vasai West.

### Columns (24):
| Column | Type | Description |
|---|---|---|
| `shop_id` | String | Unique shop identifier (e.g. `shop-1`) |
| `shop_name` | String | Registered business / store name |
| `category` | String | Primary retail category (`Grocery`) |
| `owner_name` | String | Vendor contact person |
| `owner_email` | String | Vendor authentication & notification email |
| `phone_number` | String | Store phone with country code |
| `street_address` | String | Full storefront address |
| `locality` | String | Area / neighborhood |
| `city` | String | City (e.g. `Vasai West`) |
| `district` | String | District (`Palghar`) |
| `state` | String | State (`Maharashtra`) |
| `pincode` | String | 6-digit postal code (`401202`) |
| `latitude` | Float | GPS latitude for map pins & routing |
| `longitude` | Float | GPS longitude for map pins & routing |
| `rating` | Float | Average customer rating (0.0 - 5.0) |
| `reviews_count`| Integer | Total reviews received |
| `is_open` | Boolean | `TRUE` if currently open, `FALSE` if closed |
| `opening_hours`| String | Daily operational hours |
| `flood_safety_status` | String | `SAFE`, `WATCH`, or `ALERT` |
| `verified_status` | String | `APPROVED`, `PENDING`, or `REJECTED` |
| `bank_upi_id` | String | Merchant UPI ID for settlements |
| `image_url` | String | Storefront banner image |
| `created_at` | Timestamp| Registration date |
| `updated_at` | Timestamp| Last modification timestamp |

---

## 2. `shop_available_stock.csv`
Contains 348 itemized stock entries (58 items per grocery mall) spanning all major supermarket departments:
- **Grains & Rice**: Basmati Rice (5kg), Kolam Rice (5kg), Sona Masoori (5kg), Brown Rice, Thick Poha.
- **Atta & Flours**: MP Sharbati Whole Wheat Atta (10kg & 5kg), Gram Flour / Besan, Fine Sooji / Rava, Refined Maida.
- **Pulses & Dals**: Toor Dal, Moong Dal Split, Chana Dal, White Urad Gota, Kashmiri Rajma, Kabuli Chana, Red Masoor.
- **Edible Oils & Ghee**: Sunflower Oil (1L & 5L), Soyabean Oil, Saffola Gold Pro, Mustard Oil, Groundnut Oil, Amul Cow Ghee, Gowardhan Ghee.
- **Spices & Seasoning**: Tata Salt, Madhur Sugar (5kg), Organic Jaggery, Turmeric Powder, Red Chilli Powder, Coriander Powder, Garam Masala, Jeera.
- **Dairy & Breakfast**: Amul Butter (500g), Processed Cheese Blocks, Malai Paneer, Toned Milk, Corn Flakes, Rolled Oats, Maggi 2-Minute Noodles.
- **Snacks & Beverages**: Tata Tea Gold, Red Label Tea, Nescafe Classic Coffee, Bournvita, Real Fruit Juice, Parle-G, Good Day Cookies, Aloo Bhujia, Lay's Chips, California Almonds, Whole Cashews.
- **Household & Cleaning**: Surf Excel Detergent (5kg), Vim Dishwash Gel, Lizol Floor Cleaner, Harpic Toilet Cleaner, Dettol Liquid Handwash.
- **Personal Care**: Colgate Strong Teeth Toothpaste, Dettol Germ Protection Soap.

### Columns (20):
| Column | Type | Description |
|---|---|---|
| `product_id` | String | Unique SKU code (e.g. `prod-0001` to `prod-0348`) |
| `shop_id` | String | Foreign key linking to `shops_and_locations.csv` (`shop-1` to `shop-6`) |
| `shop_name` | String | Name of the owning grocery store |
| `product_name` | String | Full title of the product |
| `category` | String | Department (`Grocery`, `Dairy & Bakery`, `Snacks & Beverages`, `Household & Cleaning`, `Personal Care`) |
| `subcategory` | String | Specific category (`Pulses & Lentils`, `Grains & Rice`, `Edible Oils`, etc.) |
| `barcode` | String | 13-digit EAN barcode |
| `price_inr` | Decimal | Discounted selling price in INR |
| `mrp_inr` | Decimal | Maximum Retail Price |
| `stock_quantity` | Integer | **Editable**: Current stock units available |
| `reserved_quantity` | Integer | Units reserved by buyers awaiting pickup |
| `unit` | String | Packaging format (e.g. `1 kg pack`, `5 kg bag`, `1 L pouch`) |
| `low_stock_threshold` | Integer | Restock alert trigger level |
| `is_available` | Boolean | `TRUE` if in stock, `FALSE` if exhausted |
| `shelf_location` | String | In-store Aisle / Rack / Chiller section |
| `brand` | String | Manufacturer or brand name |
| `description` | String | Product specifications |
| `image_url` | String | High quality product image URL |
| `last_restocked_date` | Date | Batch restock date |
| `last_updated` | Timestamp| Timestamp of latest stock change |

---

## How to Edit:
1. **Adding a New Shop**: Append a new row to `shops_and_locations.csv` with a unique `shop_id` (e.g. `shop-7`).
2. **Adding New Products**: Append rows to `shop_available_stock.csv` referencing the corresponding `shop_id`.
3. **When a Customer Buys or Reserves an Item**:
   - For an instant purchase: Decrement `stock_quantity` by the purchased quantity and update `last_updated`. If `stock_quantity` reaches 0, set `is_available=FALSE`.
   - For a reservation: Increment `reserved_quantity` and decrement `stock_quantity`.
