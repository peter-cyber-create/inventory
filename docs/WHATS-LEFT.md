# What’s left to do

Summary of what’s in place and what you might do next (testing, polish, optional features).

---

## Done

- **Auth:** Login (username/email + password), JWT, session expiry redirect, module-based sidebar/route access.
- **Layout:** Fixed header (Ministry of Health branding), collapsible sidebar (scrolls when many items), main content area is the only scrollable region (`h-screen`, sidebar `min-h-0` + `overflow-y-auto`, main `min-h-0 overflow-auto`).
- **Branding:** “Government” removed; header, login, and page title use **Ministry of Health** / **IMS — Integrated Management System**.
- **Modules:** Dashboard, ICT (Assets, Maintenance, Requisitions, Issues, Servers), Fleet (Vehicles, Spare Parts, Requisitions, Receiving, Job Cards), Stores (Items, GRN, Ledger, Requisitions, Issues), Finance (Activities), Admin (Users, Roles, Departments, Settings, Reports).
- **Forms:** Enterprise form pattern applied (metadata header, collapsible sections, line-item grids where needed, audit panel) across Asset Registration, GRN, Store Requisitions/Issues, Fleet Job Cards/Requisitions, ICT Requisitions, Finance Activities, User Management.
- **Deploy:** `./scripts/deploy.sh` (sync + build + migrate + restart), Nginx notes, troubleshooting doc.

---

## Suggested next steps

1. **Deploy and test**  
   Run `./scripts/deploy.sh`, hard-refresh, then test login, main flows (e.g. one requisition, one GRN, one issue, one job card) and module-specific access for restricted users.

2. **Backend approval workflow (optional)**  
   Forms are ready for status (Draft/Submitted/Approved/Rejected). Add status and approver fields in the backend and wire **ApprovalActions** (Submit / Approve / Reject) where you want workflow.

3. **MOH branding (optional)**  
   Add logo or crest in the header, or a “Ministry of Health” favicon, if you have assets.

4. **Validation and UX (optional)**  
   Add more cross-field and duplicate checks (see `docs/FORM-ARCHITECTURE.md`), and any MOH-specific validations or help text.

5. **Reports**  
   Admin → System Reports already has a summary; extend with more reports or exports if needed.

---

## Layout and scroll behaviour

- **Header:** Fixed at top, does not scroll.
- **Sidebar:** Fixed height; **navigation list scrolls** when there are many items (`flex-1 min-h-0 overflow-y-auto` on `<nav>`).
- **Main content:** Fills remaining height and **only this area scrolls** (`flex-1 min-h-0 overflow-auto` on `<main>`). Page content (tables, forms) scrolls inside this region.

So: navbar (sidebar) scrolls when needed; the area where contents are displayed is the main panel, and that panel scrolls while header and sidebar stay fixed.
