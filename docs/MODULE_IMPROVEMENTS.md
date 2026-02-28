# Module-by-module improvements

Improvements listed per module. Order within each module is: **fixes first**, then **UX/data**, then **features**, then **hardening**.

---

## 1. Dashboard

- **Error handling**: On 401 from `/api/admin/reports/summary`, show “Session expired, please sign in again” and optionally redirect to login or refresh token.
- **Empty state**: When all counts are 0, show a short “Get started” message and links to add items/assets/users.
- **Loading**: Replace “Loading...” with a simple skeleton or spinner for consistency.
- **Caching**: Consider short-lived client cache or `stale-while-revalidate` so rapid navigation doesn’t hammer the summary API.
- **Charts**: Add simple charts (e.g. pending requisitions by type, or trend over time if you add date filters later).

---

## 2. ICT module

### 2.1 ICT Assets

- **Search/filter**: Add search by asset tag/name/serial and filter by status/category so large lists are usable.
- **Pagination**: If the list can grow large, add backend pagination (e.g. `?page=1&limit=20`) and a simple table pagination UI.
- **Validation**: Backend already validates; ensure frontend shows validation errors per field where applicable (e.g. duplicate asset tag).
- **Bulk actions**: Optional bulk export (CSV) or bulk status update for maintenance/assignment.

### 2.2 ICT Maintenance

- **Asset display**: In the list/detail, show asset tag/name (from `assetId`) by including `asset` in the API response so users don’t see raw IDs.
- **Filter by asset**: Allow filtering maintenance records by asset.
- **Date validation**: Validate `nextServiceDate` ≥ `maintenanceDate` on backend and surface in UI.

### 2.3 ICT Requisitions

- **Status workflow**: Clarify allowed status transitions (e.g. pending → approved → issued) and enforce them in the backend; show status badges and, if applicable, “Approve” / “Reject” actions.
- **Link to issues**: From a requisition, link to related ICT issues (or show “Issued” when linked to an issue).

### 2.4 ICT Issues

- **Requisition/asset context**: List view should show requisition ref and asset details (from API includes) so users don’t need to open each record.
- **Issue date**: Ensure issue date is editable where policy allows, and displayed consistently.

### 2.5 ICT Servers

- **Consistency**: Align with ICT Assets patterns (search, filter, pagination, error display).
- **Physical/virtual**: If the spec has type (physical/virtual), host server, etc., ensure schema and forms capture and display them.

---

## 3. Fleet module

### 3.1 Vehicles

- **Search/filter**: Search by registration, make, model; filter by status/type.
- **Pagination**: Add for large vehicle lists.
- **Validation**: Unique registration number enforced in backend and clear error in UI; validate year/numeric fields.
- **Soft delete / status**: If “deleted” vehicles should be hidden, use a status (e.g. `inactive`) or soft-delete instead of hard delete.

### 3.2 Spare parts

- **Link to vehicles**: If spare parts are tied to vehicle types/models, add that relation and show it in list/form.
- **Stock levels**: If applicable, add quantity and low-stock warning or reorder threshold.

### 3.3 Requisitions

- **Requester**: Ensure requester is set from auth (`req.user.id`) and displayed; optional filter “My requisitions”.
- **Status workflow**: Same idea as ICT: clear status flow and optional approve/reject.

### 3.4 Receiving

- **Link to requisition**: If receiving is against a requisition, show requisition ref and line items; update requisition status when received.
- **Vehicle link**: If receiving is for a vehicle, link to the vehicle record and show it in the list.

### 3.5 Job cards

- **Link vehicle/assignee**: List and form should show vehicle and assigned user (from API includes).
- **Status**: Clear status flow (e.g. open → in progress → closed) and filter by status.
- **Dates**: Ensure due date / completion date are captured and displayed.

---

## 4. Stores module

### 4.1 Store items

- **Fix payload**: Frontend still sends `sku` and `isAssetSource`; backend schema has no such fields. Remove from frontend payload and form (or add to schema if required). Use only `name`, `category`, `unit`, `brand`, `barcode` (and optionally `quantityInStock` if you allow manual adjust).
- **Edit**: Add edit (PATCH) and “Edit” button so users can change name, category, unit, brand, barcode without deleting.
- **Search/filter**: Search by name/barcode; filter by category.
- **Pagination**: For large item lists.
- **Delete guard**: Backend: prevent delete if item has GRN lines or ledger entries (or soft-delete); frontend: show a clear warning.

### 4.2 GRN

- **Received-by / dates**: If schema has `receivedById` and `receivedDate`, allow setting them in the form (e.g. default to current user and today).
- **Line validation**: Backend: ensure item IDs exist and quantities > 0; return clear errors. Frontend: show item names in lines (from items fetch) and validate at least one line.
- **Stock update**: Ensure creating a GRN posts to `StockLedger` (IN) and updates `StoreItem.quantityInStock` in a transaction.

### 4.3 Requisitions (Form 76A)

- **Auth vs requester**: Backend create uses `req.user?.id` as `requesterId`; stores routes are currently public, so unauthenticated create returns 401. Either:
  - Re-enable auth for `/api/stores/requisitions` (and optionally `/api/stores/issues`), or
  - Allow optional `requesterId` in body when no user (e.g. for kiosk) and document it.
- **Status**: Use consistent status values (e.g. `PENDING` in DB vs `pending` in UI) and show status in list; allow status update (e.g. approve/reject) with permission.
- **Serial number**: Ensure `serialNumber` and other Form 76A fields are in the create payload and displayed in list/detail.

### 4.4 Issues

- **Requester/issued-by**: Create issue with `issuedById` from `req.user.id`; if stores are public, same choice as requisitions (auth or optional body field).
- **Link requisition**: Show requisition details and which items/quantities are being issued; optionally reduce “pending” quantity on the requisition when an issue is created.
- **Stock**: Each issue should post OUT to `StockLedger` and decrease `StoreItem.quantityInStock` in a transaction.

### 4.5 Stock ledger

- **Read-only list**: List ledger entries by item (or global) with date range filter; ensure transaction types (IN/OUT/ADJUST) and balance are clear.
- **Adjustments**: If you need manual stock adjustments, add an “Adjustment” API that creates a ledger entry and updates quantity.

---

## 5. Finance module

### 5.1 Activities

- **Participants**: Backend already supports participants; ensure create/update send and return them; frontend form already has participant rows—ensure they’re sent correctly and validation matches (e.g. name required per participant).
- **Validation**: Backend: validate amount > 0, dates, required fields; return field-level errors where useful.
- **Created-by**: Set `createdById` from `req.user.id`; list/detail can show creator name from include.
- **Search/filter**: Filter by department, status, date range, activity type; optional search by title/voucher.
- **Pagination**: For large lists.

---

## 6. Admin module

### 6.1 Users

- **Password**: Admin user create does not set a password; new users cannot log in. Add optional “Set password” on create/edit (with “Send reset link” later if you add email). Backend: accept optional `password` (plain), hash with bcrypt, set `passwordHash`; never return `passwordHash` in API.
- **Duplicate email/username**: Backend already checks email; add unique check for `username` if present. Frontend: show “Email already in use” etc. from API error.
- **List**: Optional filter by department and role; search by name/email.
- **Audit**: Optionally log who created/updated/deactivated users (you already have audit middleware in some routes).

### 6.2 Roles

- **Permissions**: Schema has no Permission/RolePermission; roles are just names. If you need RBAC later, add Permission model and role–permission mapping; for now document “role is label only.”
- **Cannot delete in-use role**: Before delete, check `users` with this `roleId`; return 400 with a clear message if any.

### 6.3 Departments

- **Cannot delete in-use department**: Check users and other relations before delete; return 400 with clear message.
- **Code uniqueness**: Backend should enforce unique `code` on create/update and return clear error.

### 6.4 Settings

- **Key validation**: Validate setting key format (e.g. no spaces); list all settings for admin with edit/delete.
- **Sensitive values**: Don’t log or display full value for keys like `smtp_password`; mask in UI.

### 6.5 Reports

- **Summary**: Already used by dashboard; ensure Admin Reports page uses same endpoint and shows the same (or more) metrics.
- **Export**: Optional CSV/Excel export of summary or per-entity lists (users, assets, etc.) for reporting.
- **Date range**: If you add time-series data later, add date range to summary or new “period report” endpoint.

---

## 7. Cross-cutting

- **Auth**: Decide which routes require auth (e.g. all except `/api/auth/login` and maybe health). Re-enable auth for stores requisitions/issues if users are logged in; otherwise keep a documented “public” path with optional `requesterId`/`issuedById` in body.
- **API errors**: Standardise `{ error: string, code?: string, details?: Record<string, string> }` and use `details` for field errors; frontend shows `error` and per-field from `details`.
- **Pagination**: Use a common pattern (e.g. `?page=1&limit=20`, response `{ data, total, page, limit }`) for list endpoints that can grow.
- **Audit**: Extend audit middleware to all create/update/delete where needed; store userId, action, entity, timestamp (and optionally old/new if required).
- **Tests**: Add a few integration tests per module (e.g. create item, create GRN, create requisition) to avoid regressions.

---

## Quick reference: fix first

| Module        | Priority fix |
|---------------|-------------|
| Stores Items  | Remove `sku` / `isAssetSource` from frontend; add Edit item. |
| Stores Req/Issues | Fix auth: either require login and use `req.user.id`, or accept optional requester/issuedBy in body. |
| Admin Users   | Support setting password on create/update (hash in backend). |
| All list screens | Add search/filter and pagination where lists can be large. |

Use this as a checklist; implement per module so each area is stable before moving to the next.
