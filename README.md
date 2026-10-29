# 🛍️ NearBuy — Hyperlocal Commerce & Community Hazard Radar

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> A modern, resilient hyperlocal marketplace connecting neighborhood buyers with verified local merchants. Featuring real-time inventory management, QR/barcode POS checkout, automated receipt generation, in-store pickup reservations, and community hazard/flood navigation radar.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
  - [Buyer Portal](#1-buyer-portal)
  - [Vendor / Merchant Portal](#2-vendor--merchant-portal)
  - [Admin Mission Control](#3-admin-mission-control)
  - [Interactive Hazard Radar](#4-interactive-hazard-radar)
- [System Architecture & Security](#-system-architecture--security)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Authors & Acknowledgments](#-authors--acknowledgments)

---

## 🌟 Overview

During extreme weather events (such as heavy monsoons) or supply chain disruptions, centralized e-commerce deliveries often break down. **NearBuy** addresses this by decentralizing commerce:
1. Connecting local residents with open neighborhood stores within walking distance.
2. Tracking live inventory levels to prevent wasted trips.
3. Providing 30-minute pickup reservations verified via OTP.
4. Mapping real-time flood waterlogging and hazards for safer navigation.
5. Providing shopkeepers with a digital POS terminal featuring camera barcode/QR scanning and automated receipt generation.

---

## 🚀 Key Features

### 1. Buyer Portal
- **Real-Time Catalog Search**: Search products across verified nearby stores with category filters (Monsoon Essentials, Groceries, Pharmacy, Hardware).
- **30-Minute Pickup Reservations**: Reserve critical supplies in advance with a 4-digit counter verification OTP.
- **Persistent Cart**: Lightweight shopping cart drawer backed by Zustand with offline persistence.
- **Store Reviews & Ratings**: Submit verified ratings and community feedback for neighborhood merchants.

### 2. Vendor / Merchant Portal
- **Store Onboarding**: Submit store registration (enters a `PENDING` queue for platform verification).
- **Live Inventory Management**: Add new products dynamically with images, barcodes, category, and pricing.
- **One-Click Stock Adjustment**: Direct `+` / `-` stock counter delta updates on active inventory items.
- **QR / Barcode POS Scanner**: Scan or enter barcodes for instant checkout, real-time stock decrement, and order logging.
- **Automated Digital Receipts**: Instant receipt generation on completed sales.
- **Reservation Queue**: Live tracking and status progression (`Pending` ➔ `Ready` ➔ `Picked Up`).

### 3. Admin Mission Control
- **Strict Role-Gated Access**: Restricted exclusively to platform administrators (`rautrutvi@gmail.com`).
- **Merchant Verification Queue**: Review and approve/reject newly registered stores before they can sell items or appear in buyer searches.
- **Hazard Telemetry Moderation**: Inspect and verify community-submitted waterlogging and flood reports.
- **Live Platform Analytics**: Track total verified shops, active daily users, orders, and ratings.

### 4. Interactive Hazard Radar
- **OpenStreetMap & Leaflet Integration**: Map overlay displaying store pins and waterlogged areas.
- **3-Tier Severity Badges**: Color-coded danger alerts (`Safe` / `Watch` / `Alert`).
- **Safe Route Suggestions**: Detour advisories to help buyers avoid flooded underpasses and waterlogged junctions.

---

## 🛡️ System Architecture & Security

- **Portal Separation**: Once authenticated, users are strictly routed to their assigned role workspace (Buyer, Vendor, or Admin) without cross-portal exposure.
- **Multi-Layer Route Guards**: Frontend `ProtectedRoute` guards combined with backend Spring Security JWT validation.
- **Offline-First Resilience**: Service-layer fallback architecture using `localStorage` caching ensures store registration, product creation, and scanning continue to function smoothly even during temporary server downtime.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS (Utility-first, Glassmorphism, Responsive UI)
- **State Management**: Zustand (Auth & Cart state with `persist` middleware)
- **Animations**: Framer Motion & HTML5 Canvas 2D API (Particle Network, 3D Tilt Cards)
- **Routing**: React Router v6
- **HTTP Client**: Axios with JWT request interceptors
- **Icons**: Lucide React

### Backend
- **Framework**: Spring Boot 3.x (Java 17)
- **Security**: Spring Security with JWT (JSON Web Tokens)
- **Persistence**: Spring Data JPA / Hibernate
- **Database**: MySQL / H2 Database
- **Build Tool**: Maven

---

## 📂 Project Structure

```text
NearBuy/
├── frontend/                     # React + Vite Client Application
│   ├── src/
│   │   ├── api/                  # Axios client, services (shop, product, auth, flood, reservation)
│   │   ├── components/
│   │   │   ├── buyer/            # CartDrawer, ProductModal, ReservationCard, ReviewSection
│   │   │   ├── map/              # FloodMap (Leaflet & OSM)
│   │   │   └── ui/               # Reusable UI (Buttons, Badges, 3D Cards, Particle Canvas)
│   │   ├── pages/
│   │   │   ├── admin/            # AdminDashboard (Verification & Moderation)
│   │   │   ├── buyer/            # BuyerDashboard, BuyerProfile
│   │   │   ├── vendor/           # VendorDashboard, BarcodeScanner
│   │   │   ├── LandingPage.jsx   # 3D interactive hero, portal entry
│   │   │   ├── LoginPage.jsx     # Authentication gateway
│   │   │   └── SignupPage.jsx    # Role-based onboarding wizard
│   │   ├── store/                # Zustand stores (useAuthStore, useCartStore)
│   │   ├── App.jsx               # Navigation bar, mobile menu, route declarations
│   │   └── main.jsx              # React root entrypoint
│   ├── package.json
│   └── vite.config.js
│
└── backend/                      # Spring Boot REST API
    ├── src/main/java/com/nearbuy/
    │   ├── controller/           # REST endpoints (Admin, Shopkeeper, Customer, Auth)
    │   ├── model/                # JPA entities (User, Shop, Product, Reservation, FloodZone)
    │   ├── repository/           # Spring Data JPA repositories
    │   ├── security/             # JWT filters, authentication tokens
    │   └── service/              # Business logic (ScanSell, Verification, Reservations)
    ├── pom.xml
    └── application.yml
