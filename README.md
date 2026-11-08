# 🐜 OM ENTERPRISES — Pest Control & Cleaning Services

> A full-stack enterprise web application for **OM ENTERPRISES (Panvel)**, providing certified pest control treatments, deep sanitization, service warranty management, and live order tracking.

[![React](https://img.shields.io/badge/Frontend-React%2019-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Bundler-Vite%208-purple.svg)](https://vitejs.dev/)
[![MUI](https://img.shields.io/badge/UI-Material--UI%20v7-007FFF.svg)](https://mui.com/)
[![Express](https://img.shields.io/badge/Backend-Express.js%205-green.svg)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%207-darkblue.svg)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/Database-MySQL%208-orange.svg)](https://www.mysql.com/)

---

## 📁 Project Architecture & Separation

The project is cleanly separated into two distinct folders:

```text
OM-ENTERPRISES--Pest-Control/
├── backend/                      # Node.js + Express + Prisma REST API
│   ├── prisma/                   # Prisma schema & migrations
│   ├── src/
│   │   ├── config/               # Database connection (Prisma / MariaDB adapter)
│   │   ├── controllers/          # Business logic (admin, booking, customer, service)
│   │   ├── middleware/           # JWT auth, role authorization, no-cache headers
│   │   ├── routes/               # API endpoint definitions
│   │   └── server.js             # Express application entry point
│   ├── .env.example              # Sample environment configuration
│   ├── package.json
│   └── prisma7.config.ts
│
├── frontend/                     # React 19 + Vite + Material-UI Single Page Application
│   ├── public/                   # Static assets, certificate images, real work photos
│   │   └── images/
│   │       ├── certificate.jpg   # Real NIPHM Govt. Certification
│   │       └── work/             # Real field treatment photos from Google Maps
│   ├── src/
│   │   ├── api/                  # Axios HTTP client with JWT interceptor
│   │   ├── components/           # Navbar, Footer, ProtectedRoute, NonAdminRoute
│   │   ├── context/              # AuthContext (JWT session, roles, persistent state)
│   │   ├── pages/                # Home, About, Contact, Login, Register, Profile,
│   │   │                         # BookService, MyBookings, Addresses, AdminDashboard
│   │   ├── utils/                # syncEvents.js (Real-time BroadcastChannel event bus)
│   │   ├── App.jsx               # Routes, theme provider, and route protection
│   │   └── main.jsx              # React DOM root entry
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── PROJECT_DOCUMENTATION.md      # In-depth architectural & viva evaluation reference
└── README.md                     # Project overview and setup instructions
```

---

## 🚀 Key Features

### 1. Dual-Portal Role-Based Access Control (RBAC)
- **Customer Portal**:
  - Browse dynamic services fetched live from MySQL database.
  - Interactive service booking with multiple saved customer addresses.
  - Real-time **My Bookings** tracking with warranty validity countdown and active days calculation.
  - Customer Profile with address counts and completed treatment stats.
- **Admin Portal**:
  - Protected administrative suite with quick access via the top-right initial avatar drawer.
  - **Services Master (Full CRUD)**: Add, edit, activate/deactivate, and delete services with price and warranty validity days.
  - **Bookings Operations**: Filter by status (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`), change order status, and mark bookings as complete with automated warranty expiry calculation.
  - **Registered Customers Directory**: View all clients, phone numbers, emails, and registration dates.
  - **Admin Profile**: Dedicated administrator profile displaying root platform privileges, GSTIN, and NIPHM certificate credentials.

### 2. Business Workflow & Mutual Locking Rules
- **Customer Cancellation Disabled After Confirmation**:
  - Customers can only cancel appointments while in `PENDING` status.
  - Once the Admin marks an order as `CONFIRMED`, the customer's Cancel button is automatically disabled with tooltip: *"Confirmed by admin - Cancellation disabled"*. The backend also enforces HTTP 400 rejection.
- **Admin Options Disabled After Customer Cancellation**:
  - If a customer cancels before confirmation, all status modification controls and action buttons in the Admin Dashboard are locked with badge: *"Options Locked"*. The backend strictly prevents modifying cancelled orders.

### 3. Real-Time Instant Updates (No Page Reload Required)
- Built with a native browser `BroadcastChannel` event bus (`syncEvents.js`) and cross-tab storage fallback.
- Optimistic local state updates for 0ms UI responsiveness.
- Window `focus`, `visibilitychange` listeners, and silent 3.5s background polling keep multiple tabs and sessions synchronized without screen-flickering loaders.
- Anti-caching HTTP headers (`Cache-Control: no-store, no-cache`) ensure fresh database data on every request.

### 4. Authentic Business Credentials & Visual Styling
- **GSTIN**: `27DMLPK4710B1ZB`
- **NIPHM Government Certificate**: No. `0786 - PBD (UIPM-4)/26-27` (National Institute of Plant Health Management, Ministry of Agriculture & Farmers Welfare, Govt. of India).
- **Aesthetic Color Palette**:
  - Warm Taupe: `#B09485`
  - Cream: `#F4EFEA`
  - Deep Charcoal: `#2B2523`
  - Muted Brown: `#8C7366`
  - Golden Yellow: `#DDB872`
  - Periwinkle Blue: `#656E8A`

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MySQL](https://www.mysql.com/) server running on port `3306` with database `om_enterprises`

---

### Step 1: Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Create a `.env` file from `.env.example`:
     ```env
     DATABASE_URL="mysql://root:your_mysql_password@localhost:3306/om_enterprises"
     PORT=5000
     JWT_SECRET=om_enterprises_secret_key_2026
     JWT_EXPIRES_IN=1d
     ```
4. Run database migrations and seed sample data:
   ```bash
   npx prisma db push
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *Backend REST API runs at: `http://localhost:5000`*

---

### Step 2: Frontend Setup

1. Open a second terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Frontend application opens at: `http://localhost:5173` (or `http://localhost:3000`)*

---

## 🔑 Demo & Viva Evaluation Credentials

| Role | Username / Identifier | Password | Access Rights |
|---|---|---|---|
| **Administrator** | `admin@gmail.com` | `Admin@123` | Full admin dashboard, service catalog CRUD, bookings operations, clients directory |
| **Customer** | `9876543210` | `Password@123` | Book treatments, address book, view bookings & warranty countdown |

*(New customer accounts can also be created live using the "Register" button on the navigation bar).*

---

## 📡 Core API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new customer
- `POST /api/auth/login` — Customer login (phone or email)
- `POST /api/admin/login` — Administrator login

### Services (Catalog)
- `GET /api/services` — Public active services list
- `POST /api/admin/services` — Admin: Add new service
- `PUT /api/admin/services/:id` — Admin: Update service details
- `PATCH /api/admin/services/:id/status` — Admin: Toggle active/inactive status
- `DELETE /api/admin/services/:id` — Admin: Delete service

### Bookings
- `POST /api/bookings` — Customer: Create new appointment
- `GET /api/bookings/my-bookings` — Customer: Get personal bookings with warranty status
- `PATCH /api/bookings/:bookingId/cancel` — Customer: Cancel a pending booking
- `GET /api/admin/bookings` — Admin: Get all customer bookings (filterable by status)
- `PATCH /api/admin/bookings/:bookingId/status` — Admin: Update booking status (`CONFIRMED`, `CANCELLED`)
- `PATCH /api/bookings/:bookingId/complete` — Admin: Complete service and calculate warranty expiry

### Customers & Profile
- `GET /api/customers/profile` — Customer profile details
- `GET /api/customers/addresses` — Customer address list
- `POST /api/customers/addresses` — Add new address
- `GET /api/admin/profile` — Admin profile and credentials
- `GET /api/admin/customers` — Admin: Registered clients directory

---

## 📄 License
This project was developed for **OM ENTERPRISES** Pest Control & Cleaning Services.
