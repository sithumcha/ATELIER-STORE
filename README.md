# 🧵 ATELIER-STORE — Artisanal Luxury MERN E-Commerce Platform

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://github.com/sithumcha/ATELIER-STORE.git)
[![React + Vite](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB.svg)](https://github.com/sithumcha/ATELIER-STORE.git)
[![Node + Express](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green.svg)](https://github.com/sithumcha/ATELIER-STORE.git)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)](https://github.com/sithumcha/ATELIER-STORE.git)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](https://github.com/sithumcha/ATELIER-STORE.git)

> **Personal GitHub Profile:** [https://github.com/sithumcha](https://github.com/sithumcha)  
> **Organization Repository Link:** [https://github.com/Quick-Institute/ATELIER-STORE.git](https://github.com/Quick-Institute/ATELIER-STORE.git)

---

## 📖 Executive Summary

**ATELIER-STORE** is a full-stack, editorial luxury e-commerce web application engineered using the **MERN (MongoDB, Express.js, React + Vite, Node.js)** architecture. Inspired by high-end artisanal textile studios and Japanese bespoke tailoring, the platform combines a sophisticated aesthetic with robust backend telemetry, real-time inventory management, dynamic promo/offer engines, and offline fallback support.

---

## ✨ Key Project Features & Capabilities

### 1. 🔥 Timed Item & Storewide Bulk Offer Engine
* **Single Item & Bulk Offers:** Admin can apply percentage discounts (10% to 90%) to a single product or to **ALL inventory items at once** via a single click.
* **Configurable Expiry Timers:** Set offer durations for **24 Hours (1 Day)**, **2 Days (48 Hours)**, **5 Days**, or **7 Days**.
* **Live Storefront Countdown Badges:** Displays `🔥 % OFF` highlight badges, live `⏳ Ends in 23h 45m` countdowns, and strikethrough original prices (~Rs. 48,000~ → Rs. 38,400) across all pages (Hero, Catalog, Women's, Men's, and Detail pages).
* **Automated Discount Checkout:** Adds items to Shopping Bag and Direct Checkout ("Buy Now") using the active discounted price automatically.

### 2. 🏛️ Atelier Vault Inventory & Admin Telemetry
* **Live Telemetry Dashboard:** Monitors inventory thresholds, low-stock warnings (editions with stock ≤ 5), and out-of-stock counts.
* **Instant Restock Controls:** Quick `+5 Restock` button updates MongoDB instantly using asynchronous PUT requests.
* **Commissioning New Editions:** Image upload integration using Multer with extension and MIME-type validation.
* **Optimistic UI Deletion:** Deleting a product reflects immediately in UI state before server round-trips complete.

### 3. 🎨 Editorial Multi-Page Storefront
* **Dynamic Collections:** Dedicated editorial pages for *Women's Wardrobe*, *Men's Clothing / Tailoring*, *Textiles & Fiber*, and *Lookbook Journal*.
* **Interactive Monograph Product Detail:** Multi-angle gallery, colorway palette selector, proportions fit modal, verified patron reviews, and purchase eligibility check.
* **Custom SPA Routing:** Browser Back/Forward buttons stay synchronized with React view states using `popstate` event listening without page reloads.

### 4. 🔒 User Scoped Session & Storage Management
* **Scoped LocalStorage Caching:** Cart and Wishlist items are isolated per user (`atelierstore_cart_<email>`), preventing data leakage upon logout/login.
* **Direct Checkout Isolation:** "Buy Now" directs single items to Checkout without modifying or clearing existing Cart items.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
* **Framework:** React 18 (Vite SPA)
* **Styling:** Vanilla CSS & Tailwind CSS with dynamic design tokens
* **State Management:** Scoped `useState`, `useEffect`, and `LocalStorage` persistence
* **Icons & Fonts:** Google Material Symbols & Editorial Google Fonts (Cinzel, Inter)

### **Backend**
* **Runtime:** Node.js (ES Modules `"type": "module"`)
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose ORM
* **File Uploads:** Multer with mime-type checking & static directory exposure
* **Concurrency:** `concurrently` package for single-terminal development

---

## 🛠️ 15 Core Engineering Challenges & Solutions

| # | Technical Challenge | Root Cause | Engineering Solution | Code File Link |
|---|---|---|---|---|
| **1** | MongoDB ObjectId vs Custom String ID | Seed data used `"p1"`, MongoDB generated 24-hex ObjectIds causing Mongoose `CastError`. | Regex `/^[0-9a-fA-F]{24}$/` checks ID format to use `findById()` vs `findOne({ id })`. | [`productRoutes.js`](file:///d:/Intern/server/routes/productRoutes.js#L22-L27) |
| **2** | Currency String Price Parsing | Prices contained `"LKR 42,000"` or `"$45.00"` strings, breaking DB sorting and filtering. | Sanitized with Regex `/[^0-9.]/g` into clean Float Primitives in backend controllers. | [`productRoutes.js`](file:///d:/Intern/server/routes/productRoutes.js#L41-L45) |
| **3** | CORS Policy Blocking Error | Frontend (`:5173`) and Backend (`:5001`) ran on different ports, blocked by browsers. | Enabled Express `cors` middleware (`app.use(cors())`). | [`server.js`](file:///d:/Intern/server/server.js#L25) |
| **4** | Uploaded Image 404 Error | Uploaded files in `/uploads` were not accessible via HTTP request URLs. | Exposed directory statically with `app.use('/uploads', express.static(...))`. | [`server.js`](file:///d:/Intern/server/server.js#L29) |
| **5** | 413 Payload Too Large Error | Express default body limit (1MB) rejected high-resolution uploaded photos. | Expanded Express body limit & Multer limits to `10MB`. | [`uploadMiddleware.js`](file:///d:/Intern/server/middleware/uploadMiddleware.js#L9) |
| **6** | Custom SPA Routing Sync | Browser Back/Forward buttons didn't update active view without React Router. | Added global `popstate` event listener in `App.jsx` `useEffect`. | [`App.jsx`](file:///d:/Intern/client/src/App.jsx#L112-L121) |
| **7** | LocalStorage Session Persistence | Page refresh cleared cart and user session. | Implemented lazy state initialization and user-scoped keys (`atelierstore_cart_<email>`). | [`App.jsx`](file:///d:/Intern/client/src/App.jsx#L129-L132) |
| **8** | "Buy Now" Checkout Isolation | Buy Now mixed direct item with existing shopping cart items. | Created isolated `directCheckoutItem` state for direct checkout routing. | [`App.jsx`](file:///d:/Intern/client/src/App.jsx#L85-L99) |
| **9** | Node.js ES Modules Syntax Error | `SyntaxError: Cannot use import statement outside a module` on server start. | Added `"type": "module"` to `package.json` and explicit `.js` import extensions. | [`package.json`](file:///d:/Intern/server/package.json#L6) |
| **10** | Dual Terminal Dev Workflow | Required running two separate terminal windows for client and server. | Configured `concurrently` script in root `package.json` to start both via `npm run dev`. | [`package.json`](file:///d:/Intern/package.json#L7-L13) |
| **11** | File Type Upload Validation | Risk of non-image files (PDF/TXT) being uploaded to image endpoints. | Built `checkFileTypes` validator checking extension and MIME-type against image regex. | [`uploadMiddleware.js`](file:///d:/Intern/server/middleware/uploadMiddleware.js#L31-L40) |
| **12** | Database Connection Crashes | Database connection drops crashed the Node.js server with unhandled rejections. | Wrapped `mongoose.connect` in `async try-catch` with clean `process.exit(1)` termination. | [`db.js`](file:///d:/Intern/server/config/db.js#L5-L13) |
| **13** | Floating-Point Price Precision | Discounts and taxes generated long float strings (e.g. `4200.0000000000005`). | Applied `Math.round()` on checkout subtotals and discounts. | [`CheckoutPage.jsx`](file:///d:/Intern/client/src/pages/CheckoutPage.jsx#L68-L77) |
| **14** | Offline API Fallback Support | Blank page/crash when backend database was temporarily offline. | Added pre-curated fallback products array inside `try-catch-finally` fetch blocks. | [`AdminProducts.jsx`](file:///d:/Intern/client/src/admin/AdminProducts.jsx#L14-L43) |
| **15** | Instant State Sync on Delete | Product deletions didn't reflect on UI until page refresh. | Performed optimistic state filter update (`setProducts(prev => prev.filter(...))`) immediately. | [`AdminProducts.jsx`](file:///d:/Intern/client/src/admin/AdminProducts.jsx#L51-L59) |

---

## 📡 API Endpoints Reference

### **Products & Offers**
* `GET /api/products` — Retrieve all products
* `GET /api/products/:id` — Retrieve product details by ID or string code
* `POST /api/products` — Create a new product edition
* `PUT /api/products/:id` — Update product details / stock count
* `DELETE /api/products/:id` — Delete a product edition
* `PUT /api/products/:id/offer` — Apply/update single product discount offer
* `DELETE /api/products/:id/offer` — Remove single product discount offer
* `POST /api/products/offer/bulk` — Apply storewide bulk offer to **ALL products**
* `DELETE /api/products/offer/bulk` — Remove offers from **ALL products**

### **Orders & Inquiries**
* `GET /api/orders` — Retrieve patron order history
* `POST /api/orders` — Place a new patron order
* `GET /api/inquiries` — Retrieve patron inquiry tickets

---

## 💻 Local Setup & Execution Guide

### Prerequisites
* **Node.js** (v18.0.0 or higher)
* **MongoDB** (Local instance or MongoDB Atlas URI)

### Installation Steps

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/sithumcha/ATELIER-STORE.git
   cd ATELIER-STORE
   ```

2. **Install Dependencies:**
   ```bash
   # Install root, client, and server dependencies
   npm install
   npm run dev --prefix client
   npm run dev --prefix server
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5001
   MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_db
   MAX_FILE_SIZE_MB=10
   ```

4. **Start Application Concurrently:**
   Run a single terminal command from the workspace root:
   ```bash
   npm run dev
   ```
   * **Frontend:** `http://localhost:5173`
   * **Backend:** `http://localhost:5001`

---

## 🔗 Profile & Repository Links

* **Personal GitHub Profile:** [https://github.com/sithumcha](https://github.com/sithumcha)
* **Organization GitHub Repository:** [https://github.com/Quick-Institute/ATELIER-STORE.git](https://github.com/Quick-Institute/ATELIER-STORE.git)

---
*Developed with focus on artisanal aesthetics and software engineering principles.*
