# Ministry of Health Unified Operations Platform
## Complete Design, Workflow, and Implementation Specification

## 1. Vision statement

Design and implement a world-class Ministry of Health Unified Operations Platform that manages ICT Assets, Fleet, Stores, Finance, and Administration in one seamless system.

The platform target quality bar is:

- authoritative (government-grade and policy-driven),
- elegant (minimal, premium interface),
- intelligent (workflow-aware and proactive),
- audit-ready (fully traceable decisions and changes).

This document is the single full-system specification: design language, architecture, lifecycle logic, workflow behavior, page-level expectations, and implementation standards.

---

## 2. Core system principles (strict)

1. Every entity has an explicit lifecycle with controlled transitions.
2. Every action is policy-aware and role/module-restricted.
3. Every change is audit-traceable (who, when, what).
4. Every interface guides “what next” at record and page level.
5. Invalid actions are blocked in UI and API (defense-in-depth).
6. Clarity over complexity: remove clutter and ambiguous controls.

---

## 3. Architecture (strict reference)

### 3.1 Frontend

- React SPA
- Global shell:
  - Header (identity, notifications, context)
  - Sidebar (module-aware navigation)
  - Main workspace

Reusable primitives:

- `PageLayout` (title, subtitle, page actions)
- `DataTable` (search, filters, pagination, loading/empty states)
- `FormField` (labels, required, hint, error)
- `FormSectionCollapsible` (structured long forms)
- `StatusChip` (semantic states)
- `ActionMenu` pattern (one primary action + More)

### 3.2 Backend

- Express + TypeScript
- Prisma + PostgreSQL
- Layering:
  - routes -> controllers -> services -> prisma

### 3.3 Security and policy

- Authentication required for all protected routes
- Module-level access control
- Role restrictions where business policy requires it
- Zod request validation per endpoint
- Audit middleware on create/update/delete/critical transitions

### 3.4 Session management

- Admin-configurable idle timeout (`session_timeout_minutes`)
- frontend idle tracking and forced logout
- independent JWT expiry as hard boundary

---

## 4. Global UX system

### 4.1 Status semantics

- `available` -> green
- `assigned` -> blue
- `maintenance` -> amber
- `disposed` -> gray

### 4.2 Action hierarchy

- ONE primary action (state-dependent)
- secondary actions in More menu
- disabled + guarded actions when blocked by policy

### 4.3 Mandatory page anatomy

Every operational page must provide:

- title + operational subtitle
- single primary action
- search/filter panel
- data table or structured section cards
- empty state with guidance
- contextual operational hints (for example: pending returns, approvals)

### 4.4 Visual system tone

- premium, calm, minimal, authoritative
- deep government blue primary, muted teal accent
- consistent spacing grid, soft corners, subtle shadows
- light transitions, no decorative motion noise

---

## 5. Intelligence layer (required behavior)

The system should not behave as plain CRUD. It must be workflow-intelligent.

### 5.1 Next best action

At record level, show recommended next valid action based on status and policy.

Examples:

- ICT assigned asset -> “Return asset before transfer/disposal”
- Fleet job card in progress -> “Submit for approval”
- Store requisition pending -> “Review and approve/reject”

### 5.2 Risk indicators

- overdue returns
- repeated maintenance on same asset/vehicle
- idle assets (never used in threshold window)
- potential stock anomalies

### 5.3 Smart alerts

- maintenance due soon/overdue
- pending approvals
- exception conditions (policy violations attempted)

### 5.4 Cross-module insight hooks

- assets assigned to inactive staff/users
- vehicles with abnormal repair cost trend
- stock movement inconsistencies between requisition/issue/ledger

---

## 6. Module specifications (complete)

## 6.1 ICT module (flagship)

### 6.1.1 Purpose

Full lifecycle management of ICT assets from intake to final disposal.

### 6.1.2 Lifecycle model

Canonical lifecycle:

`Requisition -> Issue -> Assigned -> Maintenance -> Return -> Transfer/Disposal`

Enforcement rules:

- serial number mandatory at bulk inventory intake
- staff must be selected from master staff source
- return required before transfer/disposal
- disposal is terminal (end-of-lifecycle state)

### 6.1.3 Page catalog

#### A) ICT Dashboard (`/ict/dashboard`)

- operational summary cards
- maintenance due/pending requisition snippets
- quick action navigation

#### B) Assets register (`/ict/assets`)

- searchable/paginated list
- status chips
- primary action by state:
  - available -> Issue
  - assigned/maintenance -> Return
- More menu:
  - edit
  - per-asset requisition
  - issue
  - assign staff
  - maintenance
  - transfer
  - disposal
  - delete

#### C) Asset details (`/ict/assets/:id`)

- lifecycle status + next-action guidance banner
- tabs:
  - Overview
  - Requisitions
  - Issues
  - Maintenance
  - Transfers
  - Returns
  - Disposals
- quick return action where valid
- complete lifecycle history context

#### D) Bulk capture (`/ict/assets/add`)

- manual row capture
- Excel template download/import
- validation preview before persist
- row fields:
  - ICT Device
  - Category
  - Model
  - Serial Number (required)
  - Engraved Number
  - Funding Source (optional)
  - Comments (if enabled in template schema)
  - Year (if enabled in template schema)

#### E) Maintenance page (`/ict/maintenance`)

- add/edit maintenance records
- asset selection
- schedule and cost tracking

#### F) Requisitions (`/ict/requisitions`)

- create requisition
- filter by status
- approve/reject transitions

#### G) Issues (`/ict/issues`)

- issue from approved/pending workflow
- link issued record to asset and recipient

#### H) Servers (`/ict/servers`)

- physical and virtual server registration
- host relationships for virtual servers

### 6.1.4 Staff master data (HR-aligned)

Staff intake and lookup endpoints:

- `GET /api/ict/staff`
- `GET /api/ict/staff/template`
- `POST /api/ict/staff/import`
- `POST /api/ict/staff/bulk`

Staff fields:

- name
- title/designation
- department
- division/section/unit
- email
- phone

Issue/assign UX requirement:

- live search while typing
- select from system list
- auto-fill title/department/division on selection

---

## 6.2 Fleet module

### 6.2.1 Purpose

Manage vehicle operations, service requests, inspections, parts, and workshop lifecycle.

### 6.2.2 Core pages

#### A) Fleet Dashboard (`/fleet/dashboard`)

- operational summary, pending requests, quick actions

#### B) Vehicles (`/fleet/vehicles`)

Key vehicle fields:

- old/new number plate
- type/make/model
- chassis number
- engine number
- year of manufacture
- fuel/power
- total cost
- country of origin/color
- user department
- driver/officer/contact
- age

#### C) Service Requisition (`/fleet/requisitions`)

Key fields:

- project/unit
- HoD
- requesting officer
- driver info
- vehicle selection
- mileage stats
- request date
- faults/service details

#### D) Garage Receiving (`/fleet/receiving`)

- receiving form with technical checklist
- pass/fail style checklist expectation
- remarks + acceptance signatures

#### E) Spare Parts (`/fleet/spare-parts`)

- part name/no/category/brand
- unit price/qty/UOM

#### F) Job Cards (`/fleet/job-cards`)

Target lifecycle:

- created
- in progress
- awaiting approval
- completed

### 6.2.3 Intelligence targets

- vehicle health indicator
- maintenance trend warnings
- high-cost repeated repairs alerting

---

## 6.3 Stores module

### 6.3.1 Purpose

Control stock intake, stock request/issue, and movement visibility.

### 6.3.2 Core pages

#### A) Stores Dashboard (`/stores/dashboard`)

- stock and transaction summary
- quick links to GRN/requisition/issues

#### B) Item master (`/stores/items`)

- item code/name
- category
- unit
- reorder thresholds (where configured)

#### C) GRN (`/stores/grn`)

Header:

- contract no
- LPO no
- delivery note no
- tax invoice no
- GRN no
- date
- supplier/contact/location
- remarks

Lines:

- description/unit
- qty ordered/delivered/accepted
- price + remarks

#### D) Requisitions / Form 76A (`/stores/requisitions`)

Header and lines for requisition/issue voucher format.

#### E) Issues (`/stores/issues`)

- issue against requisition
- controlled release and ledger impact

#### F) Ledger (`/stores/ledger`)

- IN/OUT/ADJUST movement visibility

### 6.3.3 Intelligence targets

- real-time stock warnings
- reorder alerts
- ordered-vs-accepted discrepancies

---

## 6.4 Finance module

### 6.4.1 Purpose

Track funded activities, participants, accountability, and reporting integrity.

### 6.4.2 Core pages

#### A) Finance Dashboard (`/finance/dashboard`)

- activity + accountability summary

#### B) Activity Create (`/activities/add`)

- activity header
- financial fields
- participant data (manual + Excel import)

#### C) Activities Listing (`/activities/listing`)

- search/filter/list
- navigate to details/update

#### D) Activity Details (`/activities/:id`)

- full activity detail
- participant breakdown

#### E) Activity Update (`/activities/update/:id`)

- edit activity and participants

#### F) Finance Users (`/finance/users`)

- finance user onboarding/configuration

#### G) Finance Reports (`/report/*`)

- date/funding/person filters
- export workflows

### 6.4.3 Intelligence targets

- incomplete record flags
- accountability anomalies
- funding utilization insight

---

## 6.5 Administration module

### 6.5.1 Purpose

System governance, policy control, and identity/structure administration.

### 6.5.2 Core pages

#### A) User Management (`/admin/users`)

Fields:

- username
- email/health email
- first and last name
- role
- phone
- designation
- module access
- department
- active status
- password change flow

#### B) Roles (`/admin/roles`)

- role catalog and assignment policy basis

#### C) Departments (`/admin/departments`)

- organization structure source for module alignment

#### D) Settings (`/admin/settings`)

- key-value controls
- includes security keys such as session timeout

#### E) Admin Reports (`/admin/reports`)

- system-wide visibility

### 6.5.3 Governance enhancements

- role-to-module matrix visualization
- user activity monitoring
- setting descriptions/help text

---

## 7. Data model map (platform)

### 7.1 Core models

- User
- Role
- Department
- SystemSetting

### 7.2 ICT models

- IctAsset
- IctRequisition
- IctIssue
- IctMaintenance
- Server
- IctAssetRequisition
- IctAssetDirectIssue
- IctAssetTransfer
- IctAssetDisposal
- IctAssetReturn
- Staff

### 7.3 Fleet models

- Vehicle
- FleetRequisition
- ReceivingRecord
- JobCard
- SparePart

### 7.4 Stores models

- StoreItem
- GoodsReceivedNote
- GrnItem
- StoreRequisition
- StoreIssue
- StockLedger

### 7.5 Finance models

- FinanceActivity

---

## 8. Audit and traceability standards

Every critical operation must capture:

- actor (who)
- timestamp (when)
- target entity (what)
- action type (create/update/delete/transition)

Lifecycle logs should be queryable by:

- user
- entity
- date range
- module

---

## 9. Advanced required features (program-level)

1. Notifications:
   - overdue returns
   - maintenance due
   - pending approvals
2. Global audit timeline with filtering
3. Dashboard intelligence with actionable metrics
4. AI-ready query layer for future natural-language insights

---

## 10. Quality bar and non-negotiables

The platform must:

- feel fast and responsive,
- reduce cognitive load,
- guide decisions,
- prevent incorrect operations,
- maintain consistent interaction patterns.

The platform must avoid:

- cluttered forms/actions,
- redundant fields,
- unclear next steps,
- inconsistent visual structure.

---

## 11. Implementation delivery framework

### 11.1 Phase 1: Foundation and consistency

- global design system hardening
- action hierarchy standardization
- status chips + primary action model

### 11.2 Phase 2: ICT flagship completion

- finalize lifecycle and intelligence hints
- complete template/import governance
- strengthen staff/admin data binding

### 11.3 Phase 3: Fleet/Stores/Finance parity

- replicate lifecycle-first UX patterns
- introduce risk indicators and alerting points

### 11.4 Phase 4: Intelligence and governance expansion

- notifications center
- cross-module risk analytics
- global audit explorer

---

## 12. Operational ownership and maintenance policy

This document is the authoritative system specification and must be updated whenever:

- routes or payloads change,
- lifecycle rules change,
- fields change,
- module pages are added/retired,
- policy and role restrictions change.

Recommended ownership:

- Product owner + Technical lead + Module leads (ICT/Fleet/Stores/Finance/Admin)

Change governance:

- every major merge affecting behavior includes doc update in this file.

# System Design and Workflow (Complete System Handbook)

## 1) System objective

The platform is a unified government operations system with five business domains:

- ICT Assets
- Fleet Management
- Stores Management
- Finance
- Administration

It is designed to ensure:

- operational traceability,
- controlled state transitions,
- role/module-based access,
- audit-ready transaction history.

This document describes every module, page, subpage, major form, field family, and workflow behavior in one file.

---

## 2) Architecture overview

### 2.1 Frontend architecture

- Stack: React SPA
- Global shell:
  - Header
  - Sidebar (module-aware)
  - Main content area
- Shared UI primitives:
  - `PageLayout` (title/subtitle/actions card)
  - `DataTable` (list rendering + loading/empty states)
  - `FormField` (labels/required/hints/errors)
  - `FormSectionCollapsible` (sectioned long forms)

### 2.2 Backend architecture

- Stack: Express + TypeScript
- Data layer: Prisma + PostgreSQL
- Pattern:
  - routes -> controllers -> services -> prisma
- Security:
  - `requireAuth`
  - `requireModule(...)`
- Validation:
  - Zod schema per route
- Auditing:
  - audit middleware on create/update/delete style endpoints

### 2.3 Identity and access

- Login at `/login`
- Token-based API authentication
- Module-level access for ICT/Fleet/Stores/Finance/Admin routes
- Frontend sidebar and route guard reflect backend module access

### 2.4 Session timeout policy

- Admin-setting key: `session_timeout_minutes`
- Frontend idle tracker logs users out on inactivity
- JWT expiry still applies independently

---

## 3) Global UX and workflow standards

### 3.1 Status semantics

- `available` (green)
- `assigned` (blue)
- `maintenance` (amber)
- `disposed` (gray)

### 3.2 Action hierarchy

- One primary action (status-dependent)
- Secondary actions in `More` menu
- Disabled actions when policy blocks transition

### 3.3 Page anatomy standard

Each major page should include:

- page title + subtitle (what this page controls),
- clear primary action,
- filters/search,
- list/detail action mapping,
- empty-state message with next step.

---

## 4) Module deep dive

## 4.1 ICT module (most advanced lifecycle implementation)

### 4.1.1 ICT Dashboard (`/ict/dashboard`)

Purpose:

- high-level ICT operational overview.

Current content direction:

- total asset counts,
- pending requisitions,
- maintenance due visibility,
- quick navigation actions to operational pages.

### 4.1.2 ICT Assets list (`/ict/assets`)

Purpose:

- central register of all ICT assets.

List columns (current):

- Asset Tag (links to details)
- Name
- Category
- Status (chip)
- Location
- Assigned To
- Actions

Primary row action (status-based):

- available -> Issue
- assigned/maintenance -> Return

More-menu actions:

- edit
- requisition
- issue
- assign staff
- maintenance
- transfer
- disposal
- delete

Policy-coupled behavior:

- transfer/disposal only valid after return to available
- return disabled when asset already available/disposed

### 4.1.3 ICT Asset details (`/ict/assets/:id`)

Purpose:

- single source of lifecycle truth per asset.

Top section:

- current status chip
- next action guidance text
- return action (when valid)

Tabs:

- Overview
- Requisitions
- Issues
- Maintenance
- Transfers
- Returns
- Disposals

Displayed history entities:

- per-asset requisition logs
- direct issue logs + standard issue records
- maintenance records
- transfer records
- return records
- disposal records

### 4.1.4 Bulk capture page (`/ict/assets/add`)

Purpose:

- fast onboarding of inventory assets without assignment.

Capture methods:

1. Manual line-by-line entry
2. Excel template download/import

Current row-level fields:

- ICT Device (dropdown)
- Category
- Model
- Serial No (mandatory)
- Engraved No
- Funding (optional)

Template-related endpoints:

- `GET /api/ict/assets/bulk/template`
- `POST /api/ict/assets/bulk/import`
- `POST /api/ict/assets/bulk`

### 4.1.5 Issue to staff flow (asset action)

Behavior:

- user types staff name in search input,
- live filtered list appears,
- selecting person auto-fills department/title,
- issue payload posted to asset issue endpoint.

### 4.1.6 Assign staff flow

Behavior:

- choose staff from staff master source,
- assign asset to selected staff,
- state moves to `assigned`.

### 4.1.7 Maintenance flow

Records:

- task/issue,
- action taken,
- technician/provider,
- serviced date,
- next service date,
- cost.

Page:

- `/ict/maintenance`

### 4.1.8 ICT requisitions (`/ict/requisitions`)

Capabilities:

- create requisition,
- filter by status,
- approve/reject pending requests.

Typical fields:

- requisition type,
- asset type,
- quantity,
- justification.

### 4.1.9 ICT issues (`/ict/issues`)

Capabilities:

- issue from pending requisition to selected user,
- list issued records.

### 4.1.10 ICT servers (`/ict/servers`)

Supports:

- physical server capture,
- virtual server capture linked to host server.

Fields include:

- name, IP, serial/engraved, brand, product no, type, host link.

### 4.1.11 ICT staff master data (`/api/ict/staff`)

Purpose:

- HR-provided staff source for issue/assign workflows.

Endpoints:

- list
- Excel template download
- Excel parse/import preview
- bulk persist

Staff fields:

- name
- title
- department
- division
- email
- phone

### 4.1.12 ICT lifecycle rules

Critical policies enforced:

- serial mandatory during bulk asset capture
- funding optional
- staff selection from system data (no uncontrolled manual person identity)
- return required before transfer/disposal
- disposal ends operational lifecycle

---

## 4.2 Fleet module

### 4.2.1 Fleet dashboard (`/fleet/dashboard`)

Purpose:

- fleet operational quick view and module navigation.

### 4.2.2 Vehicles (`/fleet/vehicles`)

Purpose:

- master register for vehicles.

Typical fields:

- old/new plate
- type/make/model
- chassis/engine no
- YOM
- fuel/power
- total cost
- country/color
- user department
- driver/officer/contact
- age

### 4.2.3 Requisitions (`/fleet/requisitions`)

Service request capture:

- project/unit
- HoD
- requesting officer
- driver and contacts
- vehicle details/mileage
- request date
- faults/service details

### 4.2.4 Receiving (`/fleet/receiving`)

Garage receiving checklist:

- transport officer/date/time
- selected vehicle details
- mileage
- technical checklist (battery, radiator, brakes, etc.)
- remarks/signatures/acceptance fields

### 4.2.5 Spare parts (`/fleet/spare-parts`)

Fields:

- part name/no
- category
- brand
- unit price
- quantity
- UOM

### 4.2.6 Job cards (`/fleet/job-cards`)

Workflow-oriented fields:

- job/activity description
- vehicle details
- parts used
- labor/dates
- approvals/status progression

---

## 4.3 Stores module

### 4.3.1 Stores dashboard (`/stores/dashboard`)

Purpose:

- operational summary and shortcuts.

### 4.3.2 Items (`/stores/items`)

Item master examples:

- item code/name
- category
- unit
- reorder data

### 4.3.3 GRN (`/stores/grn`)

Header:

- contract no, LPO, delivery note, tax invoice, GRN no, date
- supplier/contact/location
- remarks

Items lines:

- description/unit
- ordered/delivered/accepted quantities
- unit price
- line remarks

### 4.3.4 Requisitions Form 76A (`/stores/requisitions`)

Header:

- serial/requisition no
- date/country/ministry
- from department
- to store
- purpose

Line items:

- description
- unit
- ordered/approved/issued quantities

### 4.3.5 Issues (`/stores/issues`)

Purpose:

- issue stock against approved requisitions.

### 4.3.6 Ledger (`/stores/ledger`)

Purpose:

- stock movement visibility (IN/OUT/ADJUST).

---

## 4.4 Finance module

### 4.4.1 Finance dashboard (`/finance/dashboard`)

Purpose:

- summary and quick links for activity and reports.

### 4.4.2 Activity create (`/activities/add`)

Fields:

- activity metadata/header
- amount/funding
- participants (manual + import)

### 4.4.3 Activity listing (`/activities/listing`)

Purpose:

- search/filter/list and navigate to details/update.

### 4.4.4 Activity details (`/activities/:id`)

Purpose:

- full record view, participant breakdown, navigation to update.

### 4.4.5 Activity update (`/activities/update/:id`)

Purpose:

- modify activity and participant details.

### 4.4.6 Participants import

Flow:

- upload Excel file
- parse rows
- attach to activity payload

### 4.4.7 Finance users (`/finance/users`)

Purpose:

- user onboarding within finance context.

### 4.4.8 Reports (`/report/*`)

Filter-style pages:

- date range
- funding filter
- person search
- pending/flagged/accountability views
- export actions

---

## 4.5 Administration module

### 4.5.1 User management (`/admin/users`)

Fields:

- username/email/health email
- first/last name
- role
- phone/designation
- module assignment
- department
- active flag
- password change flow

### 4.5.2 Roles (`/admin/roles`)

Purpose:

- role catalog management.

### 4.5.3 Departments (`/admin/departments`)

Purpose:

- organizational structure foundation for module data.

### 4.5.4 Settings (`/admin/settings`)

Purpose:

- key-value system controls.

Notable key:

- `session_timeout_minutes`

### 4.5.5 Reports (`/admin/reports`)

Purpose:

- platform-level operational visibility.

---

## 5) Data model highlights (current)

Core:

- `User`, `Role`, `Department`, `SystemSetting`

ICT:

- `IctAsset`
- `IctRequisition`
- `IctIssue`
- `IctMaintenance`
- `Server`
- `IctAssetRequisition`
- `IctAssetDirectIssue`
- `IctAssetTransfer`
- `IctAssetDisposal`
- `IctAssetReturn`
- `Staff`

Fleet:

- `Vehicle`, `FleetRequisition`, `ReceivingRecord`, `JobCard`, `SparePart`

Stores:

- `StoreItem`, `GoodsReceivedNote`, `GrnItem`, `StoreRequisition`, `StoreIssue`, `StockLedger`

Finance:

- `FinanceActivity`

---

## 6) End-to-end operational workflow (high level)

1. Admin sets users, roles, module access, departments, and settings.
2. ICT imports HR staff list to staff master.
3. ICT bulk-captures assets into inventory.
4. Assets are issued/assigned to staff through search-based selection.
5. Maintenance events are logged as needed.
6. Assets are returned to inventory when custody ends.
7. Transfer/disposal only happens after return and policy checks.
8. Stores/Fleet/Finance continue with module-specific flows and reporting.
9. Idle sessions timeout based on admin policy.

---

## 7) Known gaps and pending enhancements

- Normalize staff department/division to admin IDs (not text-only)
- Apply status-led primary action + More-menu pattern to Fleet/Stores/Finance pages
- Add richer cross-module reports for lifecycle audit and non-returned assets
- Add more explicit notification/escalation flows
- Expand automated test coverage for lifecycle transitions

---

## 8) Document ownership and maintenance

Recommended process:

- Update this document whenever:
  - routes change,
  - field sets change,
  - lifecycle rules change,
  - new module pages or templates are added.
- Keep this file as the single source of product + workflow truth for onboarding, QA, and training.

---

## 9) Implementation matrix: routes, UI surfaces, APIs, and audit hooks

This section is the **machine-oriented companion** to the narrative specification above. It reflects the repository as of the last documentation pass: `frontend/src/App.jsx`, `frontend/src/components/layout/Sidebar.jsx`, and the primary `api` calls in each screen. When routes or payloads change, update this section in the same PR.

### 9.1 Shell, authentication, and module visibility

| Concern | Implementation | Notes |
| --- | --- | --- |
| Authenticated shell | `frontend/src/layouts/Layout.jsx` wraps all routes except `/login` | JWT stored client-side via existing auth helper; axios interceptor attaches credentials |
| Idle logout | `Layout.jsx` reads `GET /api/admin/settings/key/session_timeout_minutes` | On expiry, user is sent to `/login?session=idle` |
| Sidebar module filter | `frontend/src/components/layout/Sidebar.jsx` → `getNavForUser(user)` | If `user.module` is empty, `All`, or `All modules`, every nav group is shown; otherwise only the matching module group (labels: ICT, Fleet Management, Stores Management, Finance, Administration) |
| Backend module enforcement | `requireModule('<NAME>')` on route trees | Frontend visibility and backend authorization must stay aligned on module spellings (`ICT`, `Fleet`, `Stores`, `Finance`, `Admin`) |

### 9.2 Sidebar vs router (deep links)

The sidebar does **not** list every registered path. Deep or secondary routes (still valid in `App.jsx`) include:

| Path | Purpose |
| --- | --- |
| `/` | Redirects to `/dashboard` |
| `/ict/assets/add` | Bulk capture wizard (`AddAsset.jsx`) |
| `/ict/assets/:id` | Asset detail + return flow (`IctAssetDetails.jsx`) |
| `/finance/activities` | Legacy alias → same listing as activities module |
| `/activities/add`, `/activities/update/:id`, `/activities/participants/:id`, `/activities/:id` | Finance activity CRUD and participants |
| `/report/funding`, `/report/person`, `/report/accountability`, `/report/flagged`, `/report/participant/activity`, `/report/user/amounts` | Finance reports (Finance nav currently links only to `/report/activities`) |

### 9.3 Route catalog (primary pages)

Columns: **Path** (relative to app root), **React component**, **Typical module** (for `requireModule`), **Principal API families** (non-exhaustive; see §9.5 for ICT asset lifecycle).

| Path | Component | Module | Principal APIs |
| --- | --- | --- | --- |
| `/login` | `frontend/src/pages/Login.jsx` | — | `POST /api/auth/login` |
| `/dashboard` | `frontend/src/modules/dashboard/Dashboard.jsx` | any authenticated | `GET /api/admin/reports/summary` |
| `/ict/dashboard` | `frontend/src/modules/ict/IctDashboard.jsx` | ICT | `GET /api/admin/reports/summary` |
| `/ict/assets` | `frontend/src/modules/ict/IctAssets.jsx` | ICT | `GET/POST/PATCH/DELETE /api/ict/assets`, `GET /api/admin/users`; popups → §9.4 |
| `/ict/assets/add` | `frontend/src/modules/ict/assetsInventory/AddAsset.jsx` | ICT | `POST /api/ict/assets/bulk`, `GET /api/ict/assets/bulk/template`, `POST /api/ict/assets/bulk/import` |
| `/ict/assets/:id` | `frontend/src/modules/ict/IctAssetDetails.jsx` | ICT | `GET /api/ict/assets/:id`; return popup → `POST /api/ict/assets/return` |
| `/ict/maintenance` | `frontend/src/modules/ict/IctMaintenance.jsx` | ICT | `GET/POST/PATCH/DELETE /api/ict/maintenance`, `GET /api/ict/assets` |
| `/ict/requisitions` | `frontend/src/modules/ict/IctRequisitions.jsx` | ICT | `GET/POST /api/ict/requisitions`, `PATCH /api/ict/requisitions/:id/status` |
| `/ict/issues` | `frontend/src/modules/ict/IctIssues.jsx` | ICT | `GET /api/ict/issues`, `GET /api/ict/requisitions`, `GET /api/ict/assets`, `GET /api/admin/users`, `POST /api/ict/issues` |
| `/ict/servers` | `frontend/src/modules/ict/IctServers.jsx` | ICT | `GET/POST /api/ict/servers` |
| `/fleet/dashboard` | `frontend/src/modules/fleet/FleetDashboard.jsx` | Fleet | `GET /api/admin/reports/summary` |
| `/fleet/vehicles` | `frontend/src/modules/fleet/FleetVehicles.jsx` | Fleet | `GET/POST/PATCH/DELETE /api/fleet/vehicles` |
| `/fleet/spare-parts` | `frontend/src/modules/fleet/FleetSpareParts.jsx` | Fleet | `GET/POST/PATCH/DELETE /api/fleet/spare-parts` |
| `/fleet/requisitions` | `frontend/src/modules/fleet/FleetRequisitions.jsx` | Fleet | `GET/POST /api/fleet/requisitions`, `PATCH /api/fleet/requisitions/:id/status`, `GET /api/fleet/vehicles` |
| `/fleet/receiving` | `frontend/src/modules/fleet/FleetReceiving.jsx` | Fleet | `GET/POST /api/fleet/receiving`, `GET /api/fleet/requisitions` |
| `/fleet/job-cards` | `frontend/src/modules/fleet/FleetJobCards.jsx` | Fleet | `GET/POST/PATCH /api/fleet/job-cards`, `POST /api/fleet/job-cards/:id/close`, `GET /api/fleet/vehicles`, `GET /api/admin/users` |
| `/stores/dashboard` | `frontend/src/modules/stores/StoresDashboard.jsx` | Stores | `GET /api/admin/reports/summary` |
| `/stores/items` | `frontend/src/modules/stores/StoresItems.jsx` | Stores | `GET/POST/PATCH/DELETE /api/stores/items` |
| `/stores/grn` | `frontend/src/modules/stores/StoresGRN.jsx` | Stores | `GET/POST /api/stores/grn`, `GET /api/stores/items` |
| `/stores/ledger` | `frontend/src/modules/stores/StoresLedger.jsx` | Stores | `GET /api/stores/ledger` |
| `/stores/requisitions` | `frontend/src/modules/stores/StoresRequisitions.jsx` | Stores | `GET/POST /api/stores/requisitions`, `PATCH .../status`, `GET /api/admin/departments`, `GET /api/stores/items` |
| `/stores/issues` | `frontend/src/modules/stores/StoresIssues.jsx` | Stores | `GET/POST /api/stores/issues`, `GET /api/stores/requisitions`, `GET /api/stores/items` |
| `/finance/dashboard` | `frontend/src/modules/finance/FinanceDashboard.jsx` | Finance | `GET /api/admin/reports/summary` |
| `/finance/activities` | `frontend/src/modules/finance/Activities/index.jsx` | Finance | `GET /api/finance/activities` |
| `/activities/add` | `frontend/src/modules/finance/Activity/index.jsx` | Finance | `POST /api/finance/activities`, `POST /api/finance/activities/participants/import` |
| `/activities/listing` | `frontend/src/modules/finance/Activities/index.jsx` | Finance | `GET /api/finance/activities` |
| `/activities/update/:id` | `frontend/src/modules/finance/Activity/UpdateActivity.jsx` | Finance | `GET/PATCH /api/finance/activities/:id` |
| `/activities/participants/:id` | `frontend/src/modules/finance/Activity/ActivityParticipants.jsx` | Finance | `GET /api/finance/activities/:id` |
| `/activities/:id` | `frontend/src/modules/finance/Activity/ActivityDetails.jsx` | Finance | `GET /api/finance/activities/:id` |
| `/finance/users` | `frontend/src/modules/finance/Users/index.jsx` | Finance | `GET /api/admin/users` |
| `/admin/users` | `frontend/src/modules/admin/AdminUsers.jsx` | Admin | `GET/POST/PATCH/DELETE /api/admin/users`, `GET /api/admin/departments`, `GET /api/admin/roles`, `GET /api/admin/lookups/departments-and-designations` |
| `/admin/roles` | `frontend/src/modules/admin/AdminRoles.jsx` | Admin | `GET/POST/PATCH/DELETE /api/admin/roles` |
| `/admin/departments` | `frontend/src/modules/admin/AdminDepartments.jsx` | Admin | `GET/POST/PATCH/DELETE /api/admin/departments` |
| `/admin/settings` | `frontend/src/modules/admin/AdminSettings.jsx` | Admin | `GET/POST/PATCH/DELETE /api/admin/settings` |
| `/admin/reports` | `frontend/src/modules/admin/AdminReports.jsx` | Admin | `GET /api/admin/reports/summary` |
| `/report/activities` | `frontend/src/modules/finance/Reports/ActivitiesByDate.jsx` | Finance | `GET /api/finance/reports/activities` |
| `/report/funding` | `frontend/src/modules/finance/Reports/ActivitiesByFunding.jsx` | Finance | `GET /api/finance/reports/funding` |
| `/report/person` | `frontend/src/modules/finance/Reports/ActivitiesPerPerson.jsx` | Finance | `GET /api/finance/reports/person` |
| `/report/accountability` | `frontend/src/modules/finance/Reports/PendingAccountability.jsx` | Finance | `GET /api/finance/reports/accountability` |
| `/report/flagged` | `frontend/src/modules/finance/Reports/Flaggedusers.jsx` | Finance | `GET /api/finance/reports/flagged`, exports under same prefix |
| `/report/participant/activity` | `frontend/src/modules/finance/Reports/ActivityPerParticipant.jsx` | Finance | `GET .../participant/activity`, excel/pdf export paths |
| `/report/user/amounts` | `frontend/src/modules/finance/Reports/UsersAmount.jsx` | Finance | `GET .../user/amounts`, excel/pdf export paths |

### 9.4 ICT per-asset modal flows (not separate routes)

Opened from **`IctAssets.jsx`** unless noted.

| Modal / surface | Source file | HTTP | Validations (UI + server) |
| --- | --- | --- | --- |
| Stores requisition (per asset) | `assetsInventory/Requisition/AddRequisition.jsx` | `POST /api/ict/assets/requisition` | `requestedBy` required; body includes `assetId`, optional `serialNo`, `model`, `comments` |
| Issue to staff | `assetsInventory/Issue/AddIssue.jsx` | `POST /api/ict/assets/issue` | `issuedBy` + staff selection required; maps to `issuedTo`, optional `department`, `title` |
| Assign staff (HR master) | `assetDetails/Popups/AssignUser.jsx` | `GET /api/ict/staff`, `POST /api/ict/assets/assign-staff` | `assetId`, `staffId` |
| Maintenance (quick log) | `assetDetails/Popups/AddMaintenance.jsx` | `POST /api/ict/maintenance` | `issueDescription` (from task name), optional technician/dates |
| Transfer | `assetDetails/Popups/AddTransfer.jsx` | `POST /api/ict/assets/transfer` | Server enforces custody policy (asset must be `available` for transfer/disposal) |
| Disposal | `assetDetails/Popups/AddDisposal.jsx` | `POST /api/ict/assets/disposal` | Same availability gate as transfer |
| Return | `assetDetails/Popups/AddReturn.jsx` | `POST /api/ict/assets/return` | UI disables when status is already `available`; `returnedBy` required |

**`IctAssetDetails.jsx`** hosts **Return** only via `AddReturnPopup` (same endpoint).

**Inline modals on `IctAssets.jsx`:** “Asset Registration” / edit uses `POST/PATCH /api/ict/assets` with the classic single-asset field set (`assetTag`, `name`, `category`, etc.).

### 9.5 ICT asset API and audit identifiers (backend contract)

Base path: `/api/ict/assets` (all routes use `requireAuth` + `requireModule('ICT')`).

| Method | Path | `auditLog` action (when present) | Purpose |
| --- | --- | --- | --- |
| GET | `/` | — | List/search |
| GET | `/:id` | — | Detail for history tabs |
| POST | `/` | `CREATE` / `IctAsset` | Single create |
| PATCH | `/:id` | `UPDATE` / `IctAsset` | Update |
| DELETE | `/:id` | `DELETE` / `IctAsset` | Remove |
| POST | `/bulk` | `CREATE` / `IctAssetBulk` | Wizard rows |
| GET | `/bulk/template` | — | Excel template |
| POST | `/bulk/import` | — | Excel import |
| POST | `/requisition` | `CREATE` / `IctAssetRequisition` | Per-asset stores requisition |
| POST | `/issue` | `CREATE` / `IctAssetDirectIssue` | Direct issue to named staff |
| POST | `/assign-staff` | `UPDATE` / `IctAsset` | Link to `Staff` record |
| POST | `/transfer` | `CREATE` / `IctAssetTransfer` | Ownership/custody transfer |
| POST | `/disposal` | `CREATE` / `IctAssetDisposal` | Disposal |
| POST | `/return` | `CREATE` / `IctAssetReturn` | Return to inventory |

Staff master (import/template/bulk) lives under `/api/ict/staff` with the same ICT module gate; list is used by issue/assign popups.

### 9.6 Policy gates mirrored in UI (ICT list)

| User action | UI gate (`IctAssets.jsx`) | Server responsibility |
| --- | --- | --- |
| Transfer | Disabled unless `status === 'available'` | Prevents transfer when asset not returned / not available |
| Disposal | Same as transfer | Same |
| Return | Disabled when `status === 'available'` | Avoids duplicate return |

### 9.7 Future-facing audit narrative (targets)

Today, lifecycle events map to discrete `auditLog` tuples on ICT asset routes. A **global audit explorer** (specified elsewhere in this document) should ingest:

- the same audit stream used by `auditLog`,
- finance activity mutations,
- stores/fleet approval transitions,

and normalize them into a single timeline model keyed by `entityType`, `entityId`, `actorUserId`, and `occurredAt`.

