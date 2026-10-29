# 🎓 UniThrift: P2P Campus Marketplace (DBMS Project)

An enterprise-grade, Peer-to-Peer (P2P) campus classifieds platform natively built to facilitate highly secure, isolated, and strictly role-based transactions exclusively within registered University bounds. 

This platform was constructed with a heavy emphasis on native Database Management System (DBMS) architecture, relying extensively on SQL constraints, referential integrity cascades, natively embedded automation Triggers, and structured relational Views.

---

## 🛠 Tech Stack Overview

- **Database:** MySQL (Relational mappings, strict ENUM scaling, ACID compliance)
- **Backend:** Node.js, Express.js (RESTful API logic, JWT Authentication)
- **Frontend:** React.js, Tailwind CSS (Responsive dashboards, organic GUI tracking)
- **Storage:** Native Local `/uploads` referencing exact explicit static paths.

---

## 🧠 Core DBMS Engineering Architectures

This project specifically targets and proves advanced Database engineering concepts to firmly satisfy academic scaling constraints. 

### 1. Advanced Normalization & Relational Integrity
The system implements strict 3NF database scaling. The `Products`, `Orders`, `WishlistItems`, and `CartItems` tables physically completely rely on stringent `FOREIGN KEY` constraints natively bound against the absolute local `Users` ID structure utilizing absolute `ON DELETE CASCADE`. This ensures extreme anti-orphan architectures—if a user is purged, their entire systemic marketplace trace gracefully vanishes off the core memory perfectly natively.

### 2. Reactive SQL Triggers & Automation (`schema.sql`)
Instead of heavily scripting volatile structural lifecycle logic exclusively onto the Node webserver layer, UniThrift pushes core logical execution down completely onto the MySQL internal systemic level itself natively.

- **Trigger (`After_Order_Completed`):** Automatically intrinsically monitors the `Orders` pipeline natively globally. When an organic purchase natively successfully hits `"Completed"`, the exact SQL engine explicitly autonomously:
  - Updates the master `Products` row `Status = 'Sold'`.
  - Clears competing orphan instances structurally flawlessly identically off the exact `CartItems` mapping.
  - Cleaves the item cleanly off all other respective `WishlistItems` mappings instantly universally.

### 3. Dedicated Administrator Role Expansion (`ALTER TABLE`)
The explicit `Users` construct natively organically enforces distinct boundaries scaling across ENUM mappings: `('Buyer', 'Seller', 'Both', 'Admin')`. The DB enforces strict role mapping globally at the highest systemic level avoiding arbitrary user overrides natively organically completely bypassing Javascript logic.

### 4. Dynamic Views Data Abstraction
To enforce extreme systemic access masking locally seamlessly perfectly, structural explicit relational view tables like `Buyer_View` and `Seller_View` cleanly wrap highly explicit relational mappings cleanly merging `Orders` natively organically against `Products` dynamically providing decoupled safe interaction zones.

---

## 🚀 Key Functional Features

- **Decentralized Regional Filtering:** Natively parses individual login `Tokens` to accurately structurally serve items dynamically restricted exactly into the bounds of their localized `University` organically seamlessly.
- **Bi-Directional P2P Checkout Logic:** Structurally tracks all requests visually gracefully explicitly explicitly organically parsed for both sides (Seller Incoming Requests / Buyer Outgoing Pipeline).
- **Role-Based Access Constraints (RBAC):** UI perfectly collapses features implicitly restricting "Buy Now" for explicit pure Sellers natively intrinsically intelligently structurally.
- **God-View Admin Overrides (`/admin`):** Secure structural dashboard dynamically mapping explicit globally raw SQL outputs (System Stats, Raw Ecosystem Listings, and Expungement controls).

---

## 💻 Local Installation & Deployment

1. **Database Spin-Up:** 
   Execute the core SQL configurations safely over inside your terminal locally:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
2. **Environment Variables (`backend/.env`):**
   ```text
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=unithrift
   JWT_SECRET=supersecret_dev_key
   PORT=5000
   ```
3. **Run the Backend (API & Routing Node)**
   ```bash
   cd backend
   npm install
   npm run dev
   ```
4. **Run the Frontend (React Application)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

**Global Admin Access Route:**
- **Email:** `admin@unithrift.com`
- **Password:** `ramita@18`
