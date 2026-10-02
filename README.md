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

**ATELIER-STORE** is a full-stack, editorial luxury e-commerce web application engineered using the **MERN (MongoDB, Express.js, React + Vite, Node.js)** architecture. Inspired by high-end artisanal textile studios and Japanese bespoke tailoring, the platform combines a sophisticated aesthetic with robust backend telemetry, real-time inventory management, dynamic promo/offer engines, automated Nodemailer email notifications, Google OAuth authentication, client-side PDF invoice generation, and offline fallback support.

---

## 👥 User Roles & Features Breakdown (Client vs. Admin)

### 👤 **1. Client / Customer Capabilities**

* **🛍️ Product Browsing & Editorial Collections:**
  * Explore Home Page hero highlights, featured items, and editorial collections.
  * Browse dedicated collection pages: *Women's Wardrobe*, *Men's Tailoring*, *Textiles & Fiber*, and *Lookbook Journal*.
  * Filter and view active discounted items with `🔥 % OFF` badges, strikethrough original prices (~Rs. 48,000~ → Rs. 38,400), and live `⏳ Ends in 23h 45m` countdown timers.

* **📖 Interactive Monograph Product Details:**
  * High-resolution multi-angle photo gallery with thumbnail switching.
  * Interactive colorway palette selector and size selector (S, M, L, XL, XXL).
  * Proportions & Fit guide modal dialog.
  * Live stock availability check (e.g., `Only 3 left in vault` or `Out of Stock`).
  * Read verified patron reviews and rating breakdowns.

* **🔑 Account Management & 1-Click Google Sign-In:**
  * 1-Click fast Google OAuth authentication via native Google Identity Services (GIS) popup.
  * Standard email/password Registration and Login.
  * Automatic profile sync (Patron Name, Email, and Google Avatar picture).
  * Access personal account profile dashboard and order history.

* **🛒 Shopping Bag & Wishlist Management:**
  * Add products with selected sizes and quantities to the Shopping Bag.
  * Save favorite items to Wishlist for later review.
  * Scoped LocalStorage caching: cart items are isolated per logged-in user (`atelierstore_cart_<email>`).
  * Real-time calculation of subtotal, applied discounts, and total settlement.

* **⚡ Direct "Buy Now" Checkout:**
  * Instant "Buy Now" option to proceed directly to Checkout without modifying or overwriting existing Shopping Bag items.

* **💳 Order Placement & Cash on Delivery (COD):**
  * Enter delivery address, contact details, and complete order placement.
  * Automated backend stock deduction upon order completion.

* **✉️ Automated Email Notifications:**
  * Receive instant **HTML Tax Invoice Receipt Email** upon placing an order.
  * Receive **Courier Tracking Alert Email** with AWB tracking number, courier partner name (Pronto/Domex), and estimated delivery time when the order is shipped.

* **📄 Instant Vector PDF Receipt Download:**
  * Download official vector PDF tax receipt with 1-click directly from the browser checkout/account view using `jsPDF`.

* **💬 Support Inquiry Submission:**
  * Submit inquiry/feedback tickets directly to the Atelier Store support team.

---

### 🛡️ **2. Admin / Store Operator Capabilities**

* **🏛️ Live Inventory Telemetry & Vault Management:**
  * View live Inventory Telemetry Dashboard (Total Products, Low Stock Warnings ≤ 5, Out of Stock counts).
  * Quick **`+5 Restock`** button to update MongoDB stock instantly with 1 click.
  * Commission new products with image upload (Multer extension and MIME-type validation).
  * Edit product titles, prices, descriptions, categories, and size stock variations.
  * Delete products with optimistic UI state removal.

* **🔥 Dynamic Item & Storewide Bulk Offer Engine:**
  * **Single Product Offer:** Apply custom percentage discounts (10% to 90%) to individual products with expiry timers (24h, 48h, 5d, 7d).
  * **Storewide Bulk Offer:** Apply percentage discount (10% - 90%) to **ALL products in the database at once** with 1 click.
  * **Bulk Offer Removal:** Remove all active discounts storewide with 1 click.
  * **Single Offer Removal:** Remove discount from a specific product.

* **📦 Order Processing & Logistics Management:**
  * Real-time view of all customer orders sorted chronologically.
  * Update order status (`Awaiting Dispatch`, `Dispatched / In Transit`, `Delivered`).
  * Assign/Update Courier Tracking AWB code (e.g. `DOMEX-9982`), automatically triggering customer shipping alert email.
  * Cancel / Delete orders with **automatic database stock restoration**.

* **🎫 Patron Support Inquiry Desk:**
  * View and manage customer inquiry tickets submitted via the contact support form.

* **📊 Real-Time Telemetry & Dashboard Metrics:**
  * Track overall store telemetry including total revenue, active orders, stock levels, and active offer campaigns.

---

## ✨ Key Technical Features & Systems

### 1. 🔥 Timed Item & Storewide Bulk Offer Engine
* **Single Item & Bulk Offers:** Admin can apply percentage discounts (10% to 90%) to a single product or to **ALL inventory items at once** via a single click.
* **Configurable Expiry Timers:** Set offer durations for **24 Hours (1 Day)**, **2 Days (48 Hours)**, **5 Days**, or **7 Days**.
* **Live Storefront Countdown Badges:** Displays `🔥 % OFF` highlight badges, live `⏳ Ends in 23h 45m` countdowns, and strikethrough original prices (~Rs. 48,000~ → Rs. 38,400) across all pages (Hero, Catalog, Women's, Men's, and Detail pages).
* **Automated Discount Checkout:** Adds items to Shopping Bag and Direct Checkout ("Buy Now") using active discounted prices automatically.

### 2. 📦 Automated Order Management & Inventory Control
* **Checkout Flow & Direct Purchase:** Support for Cash on Delivery (COD) and isolated "Buy Now" direct checkout.
* **Automatic Inventory Stock Deduction:** Subtracts ordered item quantities directly from MongoDB upon order placement.
* **Stock Auto-Restoration:** Automatically restores inventory stock to database when an order is cancelled or deleted.
* **Courier Tracking & AWB Dispatch:** Admin can update order status (`Awaiting Dispatch`, `Dispatched / In Transit`, `Delivered`) and assign courier AWB tracking codes (e.g., `DOMEX-9982`).
* **Patron Order Lookup:** Customers can view their personal order history via patron email lookup.

### 3. ✉️ Automated Nodemailer Email Service (Gmail SMTP)
* **Order Confirmation Email:** Automatically sends a luxury HTML tax invoice receipt to the customer's email upon order placement.
* **Courier Dispatch Alert Email:** Automatically sends a real-time shipping notification email containing the courier tracking code (AWB), courier partner name (Pronto/Domex), and estimated delivery date when an order is dispatched.

### 4. 📄 Direct Client-side Vector PDF Invoice Generator
* **Instant Receipt Download:** 1-click vector PDF invoice generation using `jsPDF` without needing browser print dialogs.
* **Professional Layout:** Itemized manifest table, DDP prepaid freight details, customer info, and encrypted transaction metadata.

### 5. 🔑 Google OAuth 2.0 One-Touch Authentication
* **1-Click Google Sign-In:** Integration with Google Identity Services (GIS) SDK and backend verification endpoint (`POST /api/users/google-login`).
* **Profile Sync:** Automatically syncs patron name, email, and Google profile picture upon login.

### 6. 🏛️ Atelier Vault Admin Telemetry & Inventory System
* **Live Telemetry Dashboard:** Monitors total product counts, low-stock warnings (editions with stock ≤ 5), and out-of-stock items.
* **Instant Restock Controls:** Quick `+5 Restock` button updates MongoDB instantly using asynchronous PUT requests.
* **Commissioning New Editions:** Image upload integration using Multer with extension and MIME-type validation.
* **Optimistic UI Deletion:** Deleting or modifying a product updates UI state immediately before server round-trips complete.

---

## 🛠️ Tech Stack & Architecture

### **Frontend**
* **Framework:** React 18 (Vite SPA)
* **Styling:** Vanilla CSS & Tailwind CSS with dynamic design tokens
* **State Management:** Scoped `useState`, `useEffect`, and `LocalStorage` persistence
* **Icons & Fonts:** Google Material Symbols & Editorial Google Fonts (Cinzel, Inter)
* **PDF Utility:** `jsPDF` for client-side receipt rendering

### **Backend**
* **Runtime:** Node.js (ES Modules `"type": "module"`)
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose ORM
* **Email Service:** Nodemailer (Gmail SMTP integration)
* **File Uploads:** Multer with mime-type checking & static directory exposure
* **Concurrency:** `concurrently` package for single-terminal development

---

## 📡 Complete API Endpoints Reference

### **Products & Offers API**
* `GET /api/products` — Retrieve all inventory products
* `GET /api/products/:id` — Retrieve single product details by MongoDB ObjectId or custom ID
* `POST /api/products` — Create a new product edition (with image upload support)
* `PUT /api/products/:id` — Update product details / restock stock count
* `DELETE /api/products/:id` — Delete a product edition
* `PUT /api/products/:id/offer` — Apply or update discount offer for a single product
* `DELETE /api/products/:id/offer` — Remove discount offer from a single product
* `POST /api/products/offer/bulk` — Apply storewide percentage discount to **ALL products**
* `DELETE /api/products/offer/bulk` — Remove discount offers from **ALL products**

### **Orders API**
* `GET /api/orders` — Retrieve all customer orders (Admin)
* `GET /api/orders/user/:email` — Retrieve order history for a specific patron email
* `GET /api/orders/:id` — Retrieve single order details
* `POST /api/orders` — Place a new customer order (Triggers stock deduction & email invoice)
* `PUT /api/orders/:id/status` — Update order status / tracking code (Triggers shipping alert email)
* `DELETE /api/orders/:id` — Delete/cancel an order (Triggers automatic stock restoration)

### **Users & Google OAuth API**
* `POST /api/users/google-login` — Authenticate user via Google OAuth 2.0 credential token
* `POST /api/users/login` — Standard patron login
* `POST /api/users/register` — Standard patron registration

### **Inquiries API**
* `GET /api/inquiries` — Retrieve all patron support inquiries
* `POST /api/inquiries` — Submit a new patron support inquiry ticket

---



## 🔗 Profile & Repository Links

* **Personal GitHub Profile:** [https://github.com/sithumcha](https://github.com/sithumcha)
* **Organization GitHub Repository:** [https://github.com/Quick-Institute/ATELIER-STORE.git](https://github.com/Quick-Institute/ATELIER-STORE.git)

---

*Developed with focus on artisanal aesthetics and software engineering principles.*
