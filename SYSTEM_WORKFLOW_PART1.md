## System Workflow – Part 1 (Core Platform, Users, Assets & Stores)

This document explains how the **core backend and key functional modules** work together, from login up to Assets and Stores. Part 2 covers Fleet/Garage, Finance/Activities, Helpdesk and Reporting dashboards.

---

## 1. High‑Level Architecture

- **Backend**: Node.js + Express, PostgreSQL via Sequelize, in `backend/`.
  - Main entry: `backend/index.js`.
  - Database + ORM: `backend/config/db.js` and `backend/models/**`.
  - Routes (HTTP API): `backend/routes/**`.
  - Security & logging: `backend/middleware/**`.
- **Frontend**: React SPA in `frontend/`.
  - Routed pages in `frontend/src/pages/**`.
  - API calls via service files (e.g. `frontend/src/services/*Service.js`).
- **Deployment**:
  - **PM2** runs the backend (`ecosystem.config.js`, `backend/pm2-start.sh`).
  - **Nginx** reverse proxy terminates TLS and forwards to Node.

---

## 2. Cross‑Cutting Concerns

- **Authentication**
  - Users log in via `POST /api/users/login` (`backend/routes/users/userRoutes.js`).
  - On success, the backend issues a **JWT** signed with the server secret.
  - The token is sent with each request (typically `Authorization: Bearer <token>`).
  - `backend/middleware/auth.js`:
    - Verifies the JWT.
    - Attaches the authenticated user object to `req.user`.
    - Rejects unauthenticated requests with `401`.

- **Authorization (Roles & Modules)**
  - Implemented via `backend/middleware/authorize.js`.
  - Route handlers declare which roles/modules are allowed, for example:
    - `Auth, authorize('admin')`
    - `Auth, authorize('admin', 'store')`
    - `Auth, authorize('admin', 'garage')`
    - `Auth, authorize('admin', 'finance')`
  - The middleware:
    - Reads `req.user.role` and sometimes module information.
    - Compares against the allowed list and returns `403` if not permitted.

- **Security Middleware**
  - Configured in `backend/middleware/security.js` and wired in `backend/index.js`:
    - **Rate limiting**: `generalLimiter`, `authLimiter`, `uploadLimiter`.
    - **CORS**: `corsOptions` to control origins and headers.
    - **Helmet‑style headers**: `securityHeaders`.
    - **Input validation / sanitisation**: `validateInput` and, on some routes, custom string cleaning or the `xss` package.
    - **Error handling**: `errorHandler` centralises JSON error responses.
  - Requests flow:
    1. `cors(corsOptions)`
    2. `securityHeaders`
    3. `requestLogger`
    4. `validateInput`
    5. `generalLimiter` (or a specific limiter on certain routes)
    6. Route‑specific **Auth** and **authorize**.

- **Logging & Audit**
  - Application logs: `morgan` for HTTP access, plus custom `console.log`/`console.error` (only verbose in development).
  - Audit logs for critical data actions live in `backend/models/Logs/auditModel.js` and related routes.
  - Authentication and data changes use `middleware/auditLogger.js` helpers like:
    - `logAuthEvent`
    - `logDataModification`

---

## 3. System Module (Configuration & Health)

- **Backend routes**: `backend/routes/system/systemRoutes.js` mounted at `/api/system`.
- **Typical endpoints** (exact names can vary, but logically):
  - `GET /api/system/health`
    - Quick health check used by scripts (e.g. `CHECK_BACKEND.sh`, `DIAGNOSE_SERVER.sh`) and monitoring.
    - Confirms that the Express app is running and, optionally, that the database is reachable.
  - `GET /api/system/config` or similar
    - Returns system settings: enabled modules, configuration flags, and version information.
  - Admin‑only system configuration/maintenance endpoints guarded by:
    - `Auth, authorize('admin')`.

- **Frontend**
  - Admin system settings pages (e.g. `frontend/src/pages/Admin/SystemSettings.jsx`, `SystemReports.jsx`).
  - These pages:
    - Call `/api/system/*` to fetch system‑wide settings and reports.
    - Provide UI for super‑admins to manage modules, roles, and reports.

**End‑to‑end workflow (example – health check):**
1. An operator or script calls `GET /api/system/health`.
2. Express route checks basic server status and optionally DB connectivity.
3. Returns JSON like `{ status: 'ok', uptime, env }`.
4. Nginx/PM2 or scripts act on this (e.g. restarting the app if unhealthy).

---

## 4. User & Access Management Module

### 4.1 Backend – Users & Staff

- **User routes**: `backend/routes/users/userRoutes.js` mounted at `/api/users`.
  - **Registration / Creation**
    - `POST /api/users/register`
      - Public (or limited) user signup with password policy enforcement.
    - `POST /api/users/` (admin only)
      - `Auth, validatePasswordMiddleware` used.
      - Validates password with `validatePassword` ensuring length, complexity and no similarity to username.
      - Hashes password using bcrypt with rounds from `BCRYPT_ROUNDS`.
      - Stores user with role/module metadata (e.g. `role`, `module`, `depart`).
      - Audit log created via `logDataModification(AUDIT_ACTIONS.USER_CREATE, ...)`.
  - **Login**
    - `POST /api/users/login`
      - Verifies credentials.
      - On success, issues JWT to the client.
      - Records the login in the audit log (`logAuthEvent`).
  - **User listing / management**
    - Routes like `GET /api/users/` (admin only, via `Auth, authorize('admin')`).
    - Allow administrators to manage active users, reset passwords, and assign roles/modules.

- **Staff routes**: `backend/routes/users/staffRoutes.js` mounted at `/api/staff`.
  - Manage supporting staff data (departments, designations, contacts).
  - Used by other modules (e.g. Assets, Vehicles) for default `staffId`, officer assignments, etc.

### 4.2 Frontend – Auth & Admin

- **Login UI**
  - `frontend/src/pages/Auth/Login.jsx` (and `Login.css`).
  - Submits credentials to `POST /api/users/login`.
  - On success:
    - Stores JWT (e.g. in Redux store or local storage).
    - Navigates to the module‑specific dashboard (Assets, Stores, Fleet, etc.) depending on the user’s role/module.

- **Admin User Management**
  - Pages such as:
    - `Admin/UserManagement.jsx`
    - `Admin/RolesPermissions.jsx`
  - Fetch user lists from `/api/users`.
  - Allow creating, editing, activating/deactivating users with appropriate backend API calls.

**End‑to‑end workflow (example – grant a new Stores officer user):**
1. Admin logs in via `/api/users/login` and opens **User Management**.
2. Admin creates a new user via UI → `POST /api/users/` (with `role='store'` or similar module).
3. Backend:
   - Validates password (policy).
   - Hashes password.
   - Creates `user` record.
   - Writes an audit log entry.
4. The new user receives credentials and logs in, acquiring JWT.
5. From then on, calls to `/api/stores/*` use `Auth` + `authorize('admin', 'store')` to ensure only authorised officers can access Stores functionality.

---

## 5. Assets (ICT Inventory) Module

### 5.1 Backend – Asset Management

- **Routes**: `backend/routes/assets/*.js` mounted in `backend/index.js`:
  - `/api/assets` → `assetsRoutes.js`
  - `/api/issue` → `issueRoutes.js`
  - `/api/dispatch` → `dispatchRoutes.js`
  - `/api/maintenance` → `maintenanceRoutes.js`
  - `/api/disposal` → `DisposalRoutes.js`
  - `/api/requisition` → `requisition.js`
  - `/api/transfers` → `tranferRoutes.js`
  - `/api/reports` → `reportRoutes.js` (for activity/asset reports)

- **Key Middleware**
  - All sensitive routes are protected with **Auth** and **authorize**, e.g.:
    - `Auth, authorize('admin', 'it')` for ICT asset management endpoints.
    - Input sanitisation using custom helpers and `xss` to prevent XSS and code injection.
  - Many bulk‑operations (e.g. CSV/Excel imports) use **Sequelize transactions** to ensure data integrity.

- **Typical Asset Lifecycle**
  1. **Registration / Import**
     - `POST /api/assets` (in `assetsRoutes.js`).
       - For bulk imports, the payload may contain a `rows` array.
       - Code:
         - Sanitises the entire body (`sanitizeInput`).
         - Starts a DB transaction with `sequelize.transaction()`.
         - Resolves default `Type`, `Category`, `Brand`, `Model`, `Staff` if not explicitly provided.
         - Creates one or more `Asset` records via `Asset.create`.
         - Writes corresponding **audit records** in `Audit` model.
         - Commits transaction if all succeed, otherwise rolls back.
  2. **Requisition & Issue (ICT side)**
     - Users create **requisition** entries via `/api/requisition`.
     - Approved items are issued via `/api/issue`.
     - These routes:
       - Check available asset quantities.
       - Update asset statuses (e.g. `InStores`, `Issued`, `InUse`).
       - Record audit trails on every state change.
  3. **Dispatch / Transfer / Maintenance / Disposal**
     - `dispatchRoutes.js`: Manage movement of assets between locations or users.
     - `tranferRoutes.js`: Track changes in owning department/facility.
     - `maintenanceRoutes.js`: Log scheduled and unscheduled maintenance.
     - `DisposalRoutes.js`: Handle asset disposal process and final status.
     - Each action:
       - Updates `assetsModel` and related tables.
       - Uses transactions where multiple tables (e.g. Asset + Audit + Logs) must be kept in sync.
       - Keeps detailed audit records (who, what, when, where).

### 5.2 Frontend – Assets Inventory

- **Main pages**: `frontend/src/pages/AssetsInventory/**`
  - `index.jsx` – module entry / dashboard.
  - `AddAsset.jsx`, `EditAsset.jsx` – asset registration and editing.
  - `Inventory/*.jsx` – listing and searching assets.
  - `Issue/*.jsx`, `Requisition/*.jsx`, `Maintanance/*.jsx` – workflow screens for asset lifecycle events.
  - `Reports/*.jsx` – asset reports (registries, status overviews, etc.).
  - `Servers/*.jsx` and `VirtualServers/*.jsx` – specialised views for server assets.

- **Workflow (example – asset registration and issuance)**
  1. User navigates to **Assets Inventory → Add Asset**.
  2. Fills in form fields; on submit, frontend sends `POST /api/assets`.
  3. Backend:
     - Sanitises input, validates, creates asset and audit entry, returns JSON.
  4. UI refreshes asset list via `GET /api/assets` with pagination, search, etc.
  5. Later, another user navigates to **Requisition** page.
     - Creates a requisition, resulting in calls to `/api/requisition`.
  6. Upon approval, an officer uses **Issue Asset** screen.
     - UI calls `/api/issue`, updating asset status and writing audit logs.

---

## 6. Stores Module (GRN, Stock Ledger, Requisitions)

### 6.1 Backend – Stores Routing Overview

- **Router**: `backend/routes/stores/index.js` mounted at `/api/stores`.
  - Sub‑modules:
    - `/api/stores/grn` → `grnRoutes.js` (Goods Received Notes).
    - `/api/stores/ledger` → `ledgerRoutes.js` (Stock Ledger).
    - `/api/stores/form76a` → `form76aRoutes.js` (Requisitions / Issuance).
    - `/api/stores/reports` → `reportsRoutes.js` (Stores‑specific reports).
  - Legacy/back‑compat routes:
    - `/api/stores/issuance` → `issuanceRoutes.js`.
    - `/api/stores/requisition` → `requisitionRoutes.js`.
    - `/api/stores/dashboard` → `dashboardRoutes.js`.
    - `/api/stores/items` → `itemRoutes.js`.
    - `/api/stores/suppliers` → `supplierRoutes.js`.
    - `/api/stores/locations` → `locationRoutes.js`.

All critical routes use `Auth, authorize('admin', 'store')` or similar to limit access to Stores officers and admins.

### 6.2 GRN (Goods Received Notes) Workflow

- **Backend**: `backend/routes/stores/grnRoutes.js` under `/api/stores/grn`.
  - **Create GRN**
    - `POST /api/stores/grn`
      - Protected by `Auth, authorize('admin', 'store')`.
      - Uses `multer` for handling up to 10 attachments (e.g. PDFs, scanned documents).
      - Starts a DB transaction: `const transaction = await GRN.sequelize.transaction();`
      - Generates a unique GRN number (`generateGRNNumber()`).
      - Creates `GRN` header with supplier, delivery, and invoice information.
      - Parses `items` array:
        - For each, creates `GRNItem` with description, quantity ordered/delivered/accepted, prices, totals.
      - Saves any attachments and associates them with the GRN.
      - Commits the transaction if all steps succeed; rolls back on error.
  - **List / Get GRNs**
    - `GET /api/stores/grn` and `GET /api/stores/grn/:id`
      - Provide paginated or detailed views for the frontend.

- **Frontend**: `frontend/src/pages/Stores/GRN.jsx`
  - Presents GRN capture form and table of line items.
  - On submit:
    - Constructs `FormData` with header + `items` JSON string + file attachments.
    - Calls `/api/stores/grn` via `storesService`.
  - Displays success or error messages based on backend response.

**End‑to‑end GRN flow:**
1. Stores officer logs in and navigates to **Stores → GRN**.
2. Fills supplier, LPO, invoice, and delivery information.
3. Enters line items (descriptions, quantities, prices).
4. Attaches supporting documents if any.
5. Submits form → `POST /api/stores/grn`.
6. Backend creates `GRN` + `GRNItem` records in a transaction and returns created record.
7. UI redirects to a listing or detail page and updates summary dashboards.

### 6.3 Stock Ledger Workflow

- **Backend**: `backend/routes/stores/ledgerRoutes.js` under `/api/stores/ledger`.
  - **List Ledger Entries**
    - `GET /api/stores/ledger`
      - Supports filters (date ranges, item, location, etc. – implemented via SQL/Sequelize queries).
      - Returns paginated ledger rows sorted by date.
  - **Create Ledger Entry**
    - `POST /api/stores/ledger`
      - Protected with `Auth, authorize('admin', 'store')`.
      - Extracts:
        - `transaction_date`, `reference_type`, `reference_number`
        - `item_description`, `item_code`, `unit_of_issue`
        - `quantity_received`, `quantity_issued`, `balance_on_hand`
        - `unit_cost`, `total_value`, `department`, `remarks`
        - `created_by`, `is_manual_entry`
      - Runs a parameterised SQL insert:
        - `INSERT INTO ledger (...) VALUES (...) RETURNING *`
      - Returns:
        - `{ status: 'success', message: 'Ledger entry created successfully', data: result[0] }`.

- **Frontend**:
  - Main pages:
    - `Stores/Ledger.jsx`
    - `Stores/StockLedger.jsx`
  - Use `storesService` to call:
    - `GET /api/stores/ledger` for listing/filtering.
    - `POST /api/stores/ledger` for manually adding entries (if exposed in UI).
  - Handle errors, empty states, and loading indicators to avoid blank pages.

**Automatic vs manual ledger entries:**
- **Automatic**:
  - Other workflows (GRN, Issuance) may create ledger entries automatically to keep stock balances consistent.
  - Example logic (seen in `issuanceRoutes.js`):
    - On issuance, update `StockBalance` and create a corresponding `StockLedger` record.
- **Manual**:
  - Stores officers may enter corrections or historical entries via the Ledger UI, which hit `POST /api/stores/ledger`.

### 6.4 Issues / Requisitions (Form 76A)

- **Backend**:
  - `form76aRoutes.js`: Represents the **official MOH Form 76A** requisition/issue record.
  - `requisitionRoutes.js` and `issuanceRoutes.js` (legacy / more detailed stock engine).
  - `issuanceRoutes.js` example:
    - Receives `items` array plus issuance metadata (issued to, location, etc.).
    - Starts transaction `t = await Issuance.sequelize.transaction()`.
    - Creates an `issuance` header.
    - For each item:
      - Creates issuance item record.
      - Fetches current `StockBalance` for that item/location.
      - Validates enough quantity is available.
      - Updates `quantity_on_hand` and `quantity_available`.
      - Creates a `StockLedger` row with negative quantity (issue).
    - Updates linked requisition items as fulfilled.
    - Commits transaction.

- **Frontend**:
  - `Stores/Form76A.jsx` – specialised MOH form view.
  - `Stores/Requisition.jsx` and `Stores/Requisition/*.jsx`.
  - `Stores/ReceivingGoods.jsx`, `Stores/Adjustments.jsx`, `Stores/Returns.jsx`, etc.
  - Flows:
    1. User creates a requisition in the UI → calls `/api/stores/requisition` or `/api/stores/form76a`.
    2. Approved requisitions then drive issuance operations via `/api/stores/issuance`.
    3. The ledger and balances are updated automatically as per the backend logic.

### 6.5 Supporting Stores Entities

- **Suppliers**: `supplierRoutes.js` under `/api/stores/suppliers`.
- **Items / Products**: `itemRoutes.js` and related pages:
  - `Stores/ItemsManagement.jsx`, `Stores/Products/*.jsx`.
- **Locations**: `locationRoutes.js` under `/api/stores/locations`:
  - Managed via `LocationsManagement.jsx`.
- **Dashboard & Reports**:
  - `dashboardRoutes.js` and `reportsRoutes.js` provide summary and analytical endpoints.
  - UI pages:
    - `Stores/Dashboard.jsx`, `Stores/StoresDashboard.jsx`, `Stores/Reports.jsx`.

---

## 7. How Part 1 & Part 2 Fit Together

- **Part 1 (this document)** covers:
  - Core backend architecture, security and system module.
  - User & Access Management.
  - Assets (ICT inventory) module.
  - Stores (GRN, Ledger, Requisitions / Form 76A).
- **Part 2** will cover:
  - Fleet & Garage (vehicles, job cards, spare parts).
  - Finance & Activities (training/workshop activities, expenditure tracking).
  - Helpdesk/Tickets and comments.
  - Dashboards and reporting across all modules.

Use both halves together to get a complete view of how the **MOH Inventory Management System** works end‑to‑end.

