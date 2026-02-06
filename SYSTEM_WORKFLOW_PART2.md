## System Workflow – Part 2 (Fleet/Garage, Finance, Helpdesk & Dashboards)

This document is the continuation of **Part 1** and focuses on the remaining functional modules: **Fleet & Garage**, **Finance/Activities**, **Helpdesk/Tickets**, and **Dashboards/Reports**. Read Part 1 first for core architecture, users, assets and stores.

---

## 1. Fleet & Garage Module

The Fleet module manages all vehicle‑related information, garage operations, spare parts, and job cards.

### 1.1 Backend – Vehicle & Garage Routes

All Fleet/Garage routes are mounted under `/api/v/*` in `backend/index.js`:

- **Route files** in `backend/routes/vehicles/`:
  - `vehicleRoutes.js` → `/api/v/vehicle`
  - `vTypes.js` → `/api/v/type`
  - `vMake.js` → `/api/v/make`
  - `vGarage.js` → `/api/v/garage`
  - `vDriver.js` → `/api/v/driver`
  - `vSpareCategory.js` → `/api/v/sparecategory`
  - `vSpareParts.js` → `/api/v/sparepart`
  - `vSpareQty.js` → `/api/v/sparepartQty`
  - `vServiceRequest.js` → `/api/v/service`
  - `garageReceive.js` → `/api/v/receive`
  - `deptRoutes.js` → `/api/depts` (vehicle‑related departments)
  - `jobCardRoutes.js` → `/api/v/jobcard`
  - `partRequests.js` → `/api/v/parts`
  - `vDisposalRoutes.js` → `/api/v/disposal` (currently disabled in `index.js` until DB is ready)

Common patterns across these files:

- **Security**:
  - Most endpoints require: `Auth, authorize('admin', 'garage')`.
  - Ensures only Garage/Fleet officers and admins can modify vehicle records.
- **Data access**:
  - All use Sequelize models under `backend/models/vehicles/**`.
  - Many endpoints include `include` options for eager loading relations (e.g. vehicle details in service requests).

#### 1.1.1 Vehicle Registration & Listing (`vehicleRoutes.js`)

- `POST /api/v/vehicle`:
  - Creates a new vehicle record.
  - Example fields: registration plates, make, model, type, department, driver/officer, status.
  - Creates an audit entry (e.g. "New Vehicle Creation") via the `Audit` model.
- `GET /api/v/vehicle`:
  - Supports pagination (`page`, `limit`) and free‑text `search`.
  - Uses `Sequelize.Op.iLike` across fields (`old_number_plate`, `new_number_plate`, `make`, `driver`, `officer`, `type`, `chassis_no`, `user_department`).
  - Returns:
    - `vehicles`, `totalRecords`, `totalPages`, `currentPage`.

**Workflow – Registering a vehicle:**
1. Garage admin opens Fleet → **Vehicles → Add Vehicle** page.
2. Fills in vehicle details; UI calls `POST /api/v/vehicle`.
3. Backend validates and creates record + audit log.
4. Vehicle appears in **Vehicle List** screens which use `GET /api/v/vehicle` with pagination and search.

#### 1.1.2 Service Requests & Garage Receive (`vServiceRequest.js`, `garageReceive.js`)

- `vServiceRequest.js` handles **service requests**:
  - `POST /api/v/service/request`
    - Creates a service request record (vehicle needs maintenance/repair).
    - Protected with `Auth, authorize('admin', 'garage')`.
  - `GET /api/v/service/request`
    - Lists all service requests with vehicle details (`include: [{ model: VehicleModel }]`).
  - `GET /api/v/service/recieved`
    - Lists received service requests filtered by `isRequest: true` or similar flag.
  - `PATCH /api/v/service/:id`
    - Updates a service request (status changes, comments, completion, etc.).
    - Sanitises string input (using `xss` where configured) before updating.

- `garageReceive.js` manages the **physical receipt of vehicles into the garage**:
  - Records when a vehicle has arrived, condition, and initial inspection notes.
  - Used to transition service requests into active jobs.

**Workflow – Opening and processing a service request:**
1. Driver or department user submits a **service request** via Fleet UI.
2. UI calls `POST /api/v/service/request`.
3. Garage officer views **Open Service Requests** (using `GET /api/v/service/request`).
4. When vehicle arrives, they record receipt via relevant endpoint (either service update or `garageReceive` route).
5. Job card is created (see below), parts requested, and work performed.
6. Status is updated through PATCH calls as the job progresses.

#### 1.1.3 Job Cards & Parts (`jobCardRoutes.js`, `partRequests.js`, `vSpareParts.js`, `vSpareQty.js`)

- **Job Cards** (`jobCardRoutes.js` under `/api/v/jobcard`):
  - Represent individual jobs performed on a vehicle (e.g. repairs, servicing).
  - Store:
    - Vehicle, driver, odometer, complaints, findings, work done, start/end dates, etc.
  - CRUD endpoints allow:
    - Creating a job card when work is opened.
    - Updating job card as work progresses.
    - Closing a job card when completed.

- **Spare Parts Master Data**:
  - `vSpareCategory.js` and `vSpareParts.js` manage spare part categories and part catalogues.
  - `vSpareQty.js` holds quantity per part/location (garage store).

- **Parts Requests** (`partRequests.js` under `/api/v/parts`):
  - For each job card, mechanics can request spare parts.
  - Endpoint:
    - Creates a record linking **job card**, **part**, **quantity**, **cost**.
    - Updates spare part quantities (consumption from garage stock).

**Workflow – Job card and spare parts:**
1. Service request is accepted; garage officer creates a **job card**.
2. Mechanics record diagnostics and planned work on the job card.
3. When parts are needed:
   - They create **parts requests** via `/api/v/parts`.
   - Backend checks available quantities and updates `vSpareQty` stock.
4. Job card is updated as work is done and ultimately closed.
5. Fleet reports use job card and parts data to calculate maintenance cost per vehicle.

### 1.2 Frontend – Fleet UI

- **Main entry**: `frontend/src/pages/Fleet/Dashboard.jsx` and `Fleet/Dashboard/`.
- **Key feature areas**:
  - `Fleet/Vehicles/*.jsx` – registering and managing vehicles.
  - `Fleet/InHouse/*.jsx` – in‑house workshop operations.
  - `Fleet/JobCard/*.js` – job card creation/update views.
  - `Fleet/SpareParts/*.jsx` – spare parts catalogues and stock.
  - `Fleet/Reports/*.jsx|*.js` – fleet reports (usage, maintenance, costs).
  - `Fleet/Settings/*.jsx|*.js` – master data (types, makes, categories, etc.).

**End‑to‑end Fleet flow (condensed):**
1. Fleet user logs in and navigates to **Fleet Dashboard**.
2. Registers vehicles and sets up master data (types, makes, spare parts).
3. Service requests are created and received in the garage.
4. Job cards are created with linked parts requests and work records.
5. Data flows into Fleet reports and global dashboards.

---

## 2. Finance & Activities Module

The system records and tracks **activities** (e.g. workshops, trainings) and their reports, which often link to finance and budgeting.

### 2.1 Backend – Activity & Report Routes

- **Routes**:
  - `backend/routes/activity/activityRoutes.js` mounted as `/api/activity`.
  - `backend/routes/activity/reportRoutes.js` mounted as `/api/reports`.

- **Key models**:
  - `backend/models/activity/activityModel.js`
  - `backend/models/activity/participantModel.js`

- **Security**:
  - Routes typically use `Auth, authorize('admin', 'finance')` or similar, so that only authorised finance/activities users can access.

#### 2.1.1 Activity Management (`activityRoutes.js`)

Functionality includes:

- **Listing user‑specific activities**:
  - `GET /api/activity/my`
    - Uses `req.user.id` to fetch activities created by the logged‑in user.
    - Supports pagination with `page` and `limit`.
- **Creating new activities**:
  - `POST /api/activity`
    - Creates a new `Activity` record with fields such as title, dates, location, budget, status, etc.
    - May create related `Participant` entries for attendees.
- **Updating / approving activities**:
  - `PATCH /api/activity/:id` or similar endpoints:
    - Change statuses (e.g. planned, in progress, completed, closed).
    - Store approvals and financial confirmations.

#### 2.1.2 Activity Reports & File Uploads (`reportRoutes.js`)

- `reportRoutes.js` provides endpoints under `/api/activity` or `/api/reports` for handling **activity reports and attachments**:
  - Uses `multer` with:
    - Destination `uploads/reports`.
    - Allowed types: `.pdf`, `.doc`, `.docx`.
    - Max size: 5 MB.
  - `POST /api/activity/upload` (path may vary):
    - `Auth, authorize('admin', 'finance')`, `upload.single('activityReport')`.
    - Validates file presence and `id` of the activity.
    - Finds activity by `id` and updates it with:
      - `reportPath` (saved filename).
      - `status` updated to `activity_closed` or similar.

**Workflow – Activity lifecycle:**
1. Activity planner (e.g. finance or program staff) creates an **activity** via frontend → `POST /api/activity`.
2. Activity is implemented; participant lists and details are updated.
3. After completion, user uploads a **report document** via **Upload Report** UI:
   - UI sends `multipart/form-data` to the upload endpoint.
4. Backend validates, stores the file, updates the activity with `reportPath` and status.
5. Finance/management views reports through:
   - `/api/activity` listings.
   - `/api/reports` endpoints for aggregated or filtered report views.

### 2.2 Frontend – Finance UI

- **Pages**: `frontend/src/pages/Finance/**`
  - `Finance/Dashboard.jsx` & `Finance/Dashboard/` – finances overview.
  - `Finance/Activities/*.jsx` – lists, filters, and views all activities.
  - `Finance/Activity/*.jsx` – create/edit activity, manage details.
  - `Finance/Reports/*.jsx` – activity/budget/expenditure reports.
  - `Finance/Users/*.jsx` – finance‑specific user management if present.

**Example user journey:**
1. Finance officer logs in and opens **Finance Dashboard**.
2. Creates an activity, sets budgets and dates.
3. After execution, uploads the report via **Upload Report** screen.
4. Uses **Reports** pages to monitor spending and completed activities.

---

## 3. Helpdesk / Ticketing Module

This module allows users to open support tickets and track their resolution, often for ICT or inventory issues.

### 3.1 Backend – Tickets & Comments

- **Routes** in `backend/routes/helpdesk/`:
  - `tickets/ticketRoutes.js`
  - `tickets/agents.js`
  - `comments/commentsRoutes.js`

Mounted in `backend/index.js` through the helpdesk router (not shown fully here, but logically under `/api/helpdesk/*` or similar).

- **Key features**:
  - **Tickets**:
    - Create a new ticket with subject, description, priority, category, and requester.
    - Assign tickets to agents (ICT staff, system admins).
    - Track status (open, in progress, resolved, closed).
  - **Agents**:
    - Manage the list of helpdesk agents.
    - Used by ticket assignment logic.
  - **Comments**:
    - Allow conversation between requester and agent inside a ticket.
    - Stored in `comments` model; exposed via `commentsRoutes.js`.

**Workflow – Handling a support ticket:**
1. User experiences an issue (e.g. cannot access a module).
2. Opens **Helpdesk → New Ticket** on frontend, filling in details.
3. UI calls `POST /api/helpdesk/tickets` (path may vary based on current routing).
4. Ticket is assigned to an agent (automatic or manual).
5. Agent and user exchange comments via `commentsRoutes.js`.
6. When resolved, agent closes the ticket; ticket status is updated and visible in ticket lists and reports.

### 3.2 Frontend – Helpdesk UI

- The helpdesk UI usually lives under:
  - `frontend/src/pages/assets` or a dedicated `Helpdesk/` folder, depending on the current refactor.
  - Typical screens:
    - **My Tickets**
    - **New Ticket**
    - **Ticket Details** (with comments thread).
    - **Helpdesk Dashboard** for agents.

**Integration with other modules:**
- Tickets can be linked conceptually to:
  - Assets (e.g. tickets about failing equipment).
  - Stores (e.g. missing stock).
  - Fleet (e.g. vehicle breakdown).
- While links can be explicit or implicit, helpdesk acts as a communication and tracking layer for operational issues across modules.

---

## 4. Dashboards & Cross‑Module Reports

The system exposes both **module‑specific dashboards** and **global admin dashboards**.

### 4.1 Backend – Reporting Endpoints

- **System‑level reports**:
  - `/api/system` via `systemRoutes.js` – core reports and health/status used by admin dashboards.
- **Activity/Finance reports**:
  - `/api/reports` via `activity/reportRoutes.js`.
- **Stores reports**:
  - `/api/stores/reports` via `stores/reportsRoutes.js`.
- **Fleet reports**:
  - Within `fleet` route files (e.g. aggregated queries in `vServiceRequest.js`, `jobCardRoutes.js`, `vSpareParts.js`).
- **Audit logs**:
  - `/api/logs` or similar via `routes/Logs/auditRoutes.js`, summarising changes across modules.

Each report endpoint:
- Accepts filters (date range, department, facility, module).
- Returns aggregated statistics and/or detailed records for visualisation on the frontend.

### 4.2 Frontend – Dashboards

- **Global dashboards**:
  - `Dashboard/index.jsx` – high‑level system overview.
  - `Dashboard/Chart.jsx`, `PieChart.jsx`, `Stats.jsx` – visual components (charts, KPIs).
  - `Admin/Dashboard.jsx`, `Admin/SystemReports.jsx`, `Admin/ModuleReports.jsx` – admin‑oriented summaries.

- **Module dashboards**:
  - `AssetsInventory/Dashboard/*.jsx` – asset counts, statuses, utilisation.
  - `Stores/Dashboard.jsx` & `Stores/StoresDashboard.jsx` – store balances, GRNs, issues, expiries.
  - `Fleet/Dashboard.jsx` & `Fleet/Dashboard/` – vehicles, jobs, service requests and downtime.
  - `Finance/Dashboard.jsx` & `Finance/Dashboard/` – activities, completed reports, budgets.
  - `ICT/Dashboard.jsx` – overview of ICT‑related indicators.

**Workflow – Example: Admin reviews system status**
1. Admin logs in and opens **Admin Dashboard**.
2. Frontend:
   - Calls `/api/system/*` for system status.
   - Calls `/api/stores/reports`, `/api/reports`, `/api/v/*` report endpoints for aggregated data.
3. UI renders a combination of:
   - Total assets, vehicles, GRNs, issues.
   - Outstanding service requests and tickets.
   - Completed activities and submitted reports.
4. Admin uses this information to monitor performance and identify bottlenecks.

---

## 5. Module‑to‑Module Workflow Summary

Bringing both parts together, here is how the modules typically interact in real‑world scenarios:

- **1. Asset Procurement to Stores and Usage**
  1. Procurement arrives → **Stores** officer records GRN via `/api/stores/grn`.
  2. Items move into **Stores stock**; ledger and stock balances update.
  3. For ICT equipment:
     - **Assets Inventory** imports/registers the items via `/api/assets`.
     - Assets are then requisitioned and issued to departments/users.

- **2. Fleet Vehicle Lifecycle**
  1. Vehicle is procured and registered in **Fleet** via `/api/v/vehicle`.
  2. If related to ICT servers or equipment, it may also appear in **Assets Inventory**.
  3. When breakdowns occur:
     - Users raise **Helpdesk tickets** and/or **Fleet service requests**.
     - Garage handles the job via **job cards** and uses **spare parts** tracked in garage stock.

- **3. Activities & Finance**
  1. Program or finance staff create **activities** (trainings, workshops) via `/api/activity`.
  2. Assets and vehicles may be requisitioned to support activities (cross‑module dependency).
  3. After completion, they upload **activity reports** via `/api/activity/upload`.
  4. Finance dashboards and reports summarise the status and outputs of these activities.

- **4. Support, Monitoring & Governance**
  1. Users raise operational issues via **Helpdesk** tickets.
  2. Admins use **audit logs** and **system reports** to ensure data integrity and compliance.
  3. Dashboards across modules give management insight into performance, utilisation and risks.

---

## 6. How to Use These Documents

- **Part 1**: Start here to understand:
  - Authentication, authorisation, security, and audit.
  - Core data domains: **Users**, **Assets**, **Stores (stock)**.
- **Part 2 (this document)**: Build on Part 1 to see:
  - How **Fleet**, **Finance/Activities**, and **Helpdesk** extend the system.
  - How **dashboards** and **reports** bring together data from all modules.

Together, these two files give you a **complete end‑to‑end workflow map** of the MOH Inventory Management System, from login and configuration to daily operations and management reporting.

