# Om Enterprises - Pest Control Services Management System
## WPT (Web Programming Technologies) Mini Project

---

## 1. Project Overview & Business Details

**OM ENTERPRISES** is a full-stack web application designed for booking and managing professional pest control and deep cleaning services. The system is built with authentic business credentials and supports **Role-Based Access Control (RBAC)** for two primary actors:
- **Customers / Users** (Domestic and Commercial)
- **Administrators**

### Authentic Business Profile & Government Registration
- **Business Name:** OM ENTERPRISES (Pest Control & Cleaning Services)
- **GST Registration Number (GSTIN):** `27DMLPK4710B1ZB` (Maharashtra State Code: 27)
- **Government Training & Accreditation:** National Institute of Plant Health Management (NIPHM), Department of Agriculture & Farmers Welfare, Ministry of Agriculture & Farmers Welfare, Government of India
- **Certificate Number:** `0786 - PBD (UIPM-4)/26-27` (Urban Integrated Pest Management - UIPM)
- **Certified Specialist:** Tejasvi Sunil Kumbhar
- **Registered Address:** Shree Jyotirling Apartment, D-101, Derawali, Panvel, Raigad, Maharashtra - 410221
- **Contact Helplines:** `+91 95875 33344` / `+91 79411 88860`
- **Official Email:** `info@omenterprisespanvel.com`
- **Working Hours:** Monday – Saturday: 8:00 AM – 8:30 PM | Sunday: 9:00 AM – 5:00 PM (Emergency Pest Treatments)
- **Google Maps Rating:** 5.0 ★★★★★ (Verified Local Reviews)

---

### Architecture: 3-Tier Client-Server Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                 Presentation Layer (Frontend)               │
│  React.js (Vite) + Material-UI (MUI) + React Router v7      │
│  State Management: React Context API (AuthContext)          │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / REST APIs (JSON + JWT)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Application Layer (Backend)                 │
│  Node.js + Express.js REST API Server (Port 5000)           │
│  Authentication: JWT (JSON Web Tokens) + Bcryptjs Hashing   │
│  Middlewares: authMiddleware, roleMiddleware, CORS          │
└──────────────────────────────┬──────────────────────────────┘
                               │ Prisma Client (MariaDB/MySQL)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer (Data)                    │
│  MySQL Relational Database (om_enterprises)                 │
│  Tables: Customer, CustomerAddress, Service, Booking, Admin │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Mandatory Pages & Navigation Layout

### Navigation Bar (Top Header) - Role-Based Display
The top navigation bar is strictly clean, focused, and role-aware:
- **Brand Logo & Title**: "OM ENTERPRISES"
  - For Customers / Guests: Subtitle is "Pest Control & Cleaning Services", clicking logo links to `/` (Home).
  - For Administrators: Subtitle is "Admin Portal", clicking logo links directly to `/admin` (Admin Dashboard).
- **Navigation Links**:
  - **For Customers & Guests**: Strictly ONLY **Home** (`/`), **About Us** (`/about`), and **Contact Us** (`/contact`).
  - **For Administrators**: Home, About Us, and Contact Us are **completely excluded**, and the top navbar contains **no center buttons**. The brand logo points directly to `/admin`, and the Avatar menu provides clean session control.
  - **Footer Layout**: Does not include any quick navigation or admin dashboard links, displaying strictly the verified enterprise brief, official Panvel address, direct helplines, and GSTIN/NIPHM credentials.
  - **Route Protection (`NonAdminRoute`)**: If an active administrator attempts to navigate directly to `/`, `/about`, or `/contact`, they are automatically redirected to `/admin`.
- **Right Side**:
  - When Logged Out: **Login** and **Register** buttons.
  - When Logged In: **User Initial Icon (Avatar)** displaying the user's initial (e.g. `R` for Ramesh, `A` for Administrator).

### Side Bar (Drawer Under User Initial Icon)
Clicking the **User Initial Icon** in the top navigation bar slides open the side drawer containing:
1. **User Profile Header**: Displays Avatar with initial, Name, Phone / Email, and role badge (`ADMINISTRATOR` or `DOMESTIC CLIENT`).
2. **For Customers**:
   - **My Profile** (`/profile`): Centered personal information card with 2x2 grid layout and account stats.
   - **Book Service** (`/book`): Dynamic service package dropdown from active database services, saved address selector, date picker, and total amount summary.
   - **My Bookings** (`/bookings`): Status tracking (`PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`), warranty countdown tracker, and cancel booking option.
   - **My Addresses** (`/addresses`): **Full CRUD** for customer service addresses (Add new address, view saved addresses, edit address, delete address).
3. **For Administrators**:
   - **Admin Dashboard** (`/admin`): Complete administrative control panel for services, bookings, warranty expiry calculator, and customer records.
4. **Sign Out**: Clean logout action that terminates the session and redirects to login.

---

## 3. Home Page Structure & Sequence

The Home Page (`HomePage.jsx`) is structured according to real-world commercial pest control standards:
1. **Hero Banner**:
   - Highlighting certified odorless pest management in Panvel, Palaspa & Navi Mumbai.
   - Real office address and direct helpline: `+91 95875 33344`.
   - Quick action buttons: "Book a Treatment" and "Contact Us".
2. **Section 1: Top Rated Services (Dynamic from Database)**:
   - Fetches all active services directly from the backend database via `GET /api/services`.
   - Displays 4.9 ★ rating badge, package warranty days from DB, dynamic price in ₹, and "Book This Treatment" button.
   - Alternating aesthetic Periwinkle Blue and Cream cards.
3. **Section 2: Company Certifications & Government Compliance**:
   - **Govt. Pest Management License**: MH-RAI/UPM/2019/8472 (Directorate of Plant Protection, Maharashtra).
   - **ISO 9001:2015 Quality Certified**: Audited standard operating procedures for chemical calibration.
   - **IPCA Registered Member**: Active member of Indian Pest Control Association.
   - **CIB & WHO Compliant Formulations**: 100% odorless Bayer & Syngenta certified eco-friendly solutions.
4. **Section 3: Real Work Field Operations Gallery**:
   - 6 high-resolution field photos representing real treatments:
     - Termite Sub-surface Drill & Injection Treatment (Palaspa, Panvel)
     - Kitchen Herbal Cockroach Gel Dotting (Khanda Colony, New Panvel)
     - Commercial ULV Cold Fogging & Misting (MIDC Taloja / Panvel)
     - Bed Bug Thermal & Residual Spray (Kamothe, Navi Mumbai)
     - Deep Sofa & Carpet Shampooing (Kharghar, Navi Mumbai)
     - Balcony Pigeon & Bird Netting (Derawali, Panvel)
5. **Section 4: Real Customer Reviews (Google Maps 5.0★)**:
   - 5.0 Google Rating badge with 180+ verified reviews.
   - Authentic customer quotes from Panvel & Navi Mumbai residents (Sachin Patil, Pooja Deshmukh, Rohan Gaikwad, Amit Kulkarni, Snehal Sawant, Dattatray Shinde).

---

## 4. Database Design & Normalization

The database is designed according to **Third Normal Form (3NF)** to eliminate data redundancy and preserve integrity.

### Entity Relationship Summary:
- **`Customer`** (1 : N) **`CustomerAddress`**: A customer can have multiple service addresses (e.g., Home, Office).
- **`Customer`** (1 : N) **`Booking`**: A customer can place multiple bookings.
- **`Service`** (1 : N) **`Booking`**: A service package (e.g., Termite Treatment) can be booked multiple times.
- **`CustomerAddress`** (1 : N) **`Booking`**: An address is associated with multiple service appointments.
- **`Admin`**: Stores administrative credentials and profile data.

---

## 5. Security & Role-Based Access Control (RBAC)

1. **Authentication**:
   - Passwords hashed using **`bcryptjs`** with salt rounds = 10.
   - On successful login, the server issues a digitally signed **JSON Web Token (JWT)** containing user ID, role, and expiration (`1d`).
2. **Authorization & RBAC**:
   - `authMiddleware`: Extracts `Authorization: Bearer <token>` from HTTP request headers, verifies signature with `process.env.JWT_SECRET`, and attaches `req.user` to the request.
   - `roleMiddleware`: Validates `req.user.role === 'ADMIN'` or `'CUSTOMER'`. Unauthorized access yields `403 Access Denied`.
3. **Session Management**:
   - Frontend `AuthContext` stores token and user in `localStorage`.
   - Axios request interceptor attaches the token to outgoing requests.
   - Response interceptor detects `401 Unauthorized` and logs out the user cleanly.
4. **Form Validations**:
   - Client-side validation: Required fields, 10-digit phone number regex (`/^[0-9]{10}$/`), minimum 8-character password, positive price.
   - Server-side validation: Validates types, required fields, foreign key existence, and prevents duplicate accounts.

---

## 6. CRUD Operations Implementation

| Entity | Create (C) | Read (R) | Update (U) | Delete (D) |
|---|---|---|---|---|
| **Services** | `POST /api/admin/services` (Includes `validity`) | `GET /api/services` (Public) & `GET /api/admin/services` | `PUT /api/admin/services/:id` & `PATCH /api/admin/services/:id/status` | `DELETE /api/admin/services/:id` |
| **Addresses** | `POST /api/customers/addresses` | `GET /api/customers/addresses` | `PUT /api/customers/addresses/:id` | `DELETE /api/customers/addresses/:id` |
| **Bookings** | `POST /api/bookings` | `GET /api/bookings/my-bookings` & `GET /api/admin/bookings` | `PATCH /api/bookings/:id/cancel` & `PATCH /api/admin/bookings/:id/status` | `PATCH /api/bookings/:id/complete` (Lifecycle completion) |
| **Customers** | `POST /api/auth/register` | `GET /api/customers/profile` & `GET /api/admin/customers` | Profile management | Session termination |

---

## 7. How to Run the Application

### Prerequisites:
- Node.js (v18+)
- MySQL running on port 3306 (database `om_enterprises`)

### Step 1: Start Backend (Terminal 1)
```powershell
# In project root: "c:\Users\aksha\Downloads\Om Enterprises backend"
npm run dev
```
*Backend runs at: `http://localhost:5000`*

### Step 2: Start Frontend (Terminal 2)
```powershell
# In project root: "c:\Users\aksha\Downloads\Om Enterprises backend"
npm run frontend:dev
```
*Or navigate into `frontend` and run:*
```powershell
cd frontend
npm run dev
```
*Frontend opens at: `http://localhost:3000` (or `http://localhost:5173`)*

---

## 8. Evaluation Viva Credentials

- **Admin Account:**
  - Email: `admin@gmail.com`
  - Password: `Admin@123`
- **Customer Account:**
  - Phone / Identifier: `9876543210`
  - Password: `Password@123`
  - *(Or click "Register" on the top navigation bar to create a new customer account live during your demonstration!)*

---

## 9. UI Brand Palette & Theme System

| Color Name | Hex Code | Visual Role | Applied Elements |
|---|---|---|---|
| **Warm Taupe / Background** | `#B09485` | Structural Accent & Card Borders | App dividers, card borders, table container outlines, hero banner background |
| **Cream / Off-White** | `#F4EFEA` | Panel & Surface Background | Main page background, summary cards, table headers, info dialog backgrounds |
| **Deep Charcoal** | `#2B2523` | Primary Typography & Headings | Page titles, category headers, bold body text, CANCELLED status chip |
| **Muted Brown** | `#8C7366` | Primary Actions & Brand Accent | Main CTA buttons, active tabs, user avatar background, COMPLETED status chip |
| **Golden Yellow** | `#DDB872` | Highlights & Badges | Offer tags, PENDING status chips, warranty highlights |
| **Periwinkle Blue** | `#656E8A` | Alternate Service Cards & Badges | Alternating service cards on Home, CONFIRMED status chips, stats cards |

---

## 10. Admin Profile & Sidebar Navigation Features

- **Side Drawer Navigation (`Navbar.jsx`)**:
  - The user initial avatar on the top right opens the aesthetic side drawer.
  - When logged in as Administrator, the drawer contains:
    - **Admin Profile** (`/profile`): Displays full administrative credentials, system access level, enterprise registration details, and live platform statistics.
    - **Admin Dashboard** (`/admin`): Complete administrative suite to manage live service catalogs, real customer bookings, and registered clients.
    - **Sign Out**: Clears authentication tokens and safely redirects to the login screen.
- **Admin Profile View (`ProfilePage.jsx`)**:
  - Dynamically fetches administrative identity (`GET /api/admin/profile`) and platform metrics (`GET /api/admin/services`, `GET /api/admin/bookings`, `GET /api/admin/customers`).
  - Centered personal and credential container featuring Administrator ID, email, security access permissions, enterprise details (`OM ENTERPRISES`), GSTIN (`27DMLPK4710B1ZB`), and NIPHM Government Certification reference (`0786 - PBD (UIPM-4)/26-27`).
- **Seamless Role Compatibility**:
  - Customers continue to see their domestic/commercial client profile, address book count, and booking history in the same centered aesthetic layout.

---

## 11. Real-Time Synchronization & Instant Status Updates (No Reload Required)

- **Instant Optimistic UI Updates**:
  - When Admin changes order status (`PENDING` -> `CONFIRMED` -> `COMPLETED` / `CANCELLED`) or marks a booking complete, the UI dropdown, status chip, and actions update **immediately** without waiting for network round-trips.
  - When a customer cancels a booking in "My Bookings", the `CANCELLED` badge and updated action state reflect **immediately**.
- **Real-Time Cross-Tab & Cross-Device Event Bus (`syncEvents.js`)**:
  - Implemented using native browser `BroadcastChannel` with fallback to `localStorage` storage events.
  - When an order is booked (`BOOKING_CREATED`), status updated (`BOOKING_STATUS_CHANGED`), or service catalog modified (`SERVICE_UPDATED`), all active tabs and sessions are instantly notified with 0ms latency.
- **Silent Background Auto-Sync & Visibility Listeners**:
  - Automatically fetches fresh database updates in the background every 3.5 seconds and immediately on window `focus` / tab switch without unmounting tables or showing screen-flickering spinners.
- **HTTP No-Cache Headers (`server.js`)**:
  - All `/api/*` endpoints serve `Cache-Control: no-store, no-cache, must-revalidate` to prevent any stale cached 304/200 responses from modern browser caches.

---

## 12. Booking Cancellation & Confirmation Locking Rules

- **Customer Cancellation Disabled Post-Confirmation**:
  - When a booking's status changes to `CONFIRMED` (or `COMPLETED`), the customer can no longer cancel the appointment.
  - In `MyBookingsPage.jsx`, the "Cancel" button is rendered in a disabled state with a descriptive tooltip: *"Confirmed by admin - Cancellation disabled"*.
  - Backend controller (`cancelBooking`) strictly returns HTTP 400 error if a client attempts to cancel a `CONFIRMED` booking.
- **Admin Options Disabled Post-Customer Cancellation**:
  - If a customer cancels a booking before admin confirmation (status `CANCELLED`):
    - All admin modification controls in `AdminDashboardPage.jsx` are completely locked.
    - The "Change Status" dropdown is disabled with tooltip: *"Customer cancelled before confirmation - All admin options locked"*.
    - The action button is replaced with a locked badge: *"Options Locked"*.
  - Backend controller (`updateBookingStatus` & `completeBooking`) rejects any attempt to alter a `CANCELLED` booking.



