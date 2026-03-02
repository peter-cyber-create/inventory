# Enterprise Transaction Form Architecture

All major forms in Government IMS follow this structure so they behave like controlled government documents, not basic data entry forms.

---

## 1. Shared components

| Component | Purpose |
|-----------|--------|
| **FormMetadataHeader** | Document number, status, created by, department, date, reference code, linked transaction. Always at top of form. |
| **FormSectionCollapsible** | Collapsible section (Section A, B, C…) with clear title. Use for logical grouping. |
| **LineItemGrid** | Dynamic line-item table: Item \| Quantity \| Unit \| Available \| Unit cost \| Total. Add/remove rows, stock validation, real-time totals. |
| **ApprovalActions** | Submit for approval \| Approve \| Reject (with reason) \| Cancel. Role-based visibility. |
| **AuditTrailPanel** | Side panel: Created, Modified, Approved, Issued, linked records. |
| **FormField** | Label + required indicator + error. |
| **FormActions** | Primary/secondary buttons (Save, Cancel). |

Location: `frontend/src/components/ui/` and `frontend/src/constants/formWorkflow.js`.

---

## 2. Form structure (every major form)

1. **Metadata header** (always present)  
   Use `FormMetadataHeader` with: document number (auto or reference), status (Draft/Submitted/Approved/Rejected/Completed), created by, department, date, reference code, linked transaction (if any).

2. **Structured body** (collapsible sections)  
   Use `FormSectionCollapsible` for each logical block, e.g.:
   - Section A – Identity / Header info  
   - Section B – Financial / Details  
   - Section C – Assignment / Delivery  
   - Section D – Lifecycle / Remarks  

3. **Line-item grid** (where applicable)  
   Use `LineItemGrid` for: Requisitions, GRN, Job Cards (parts), Store Issues.  
   Columns: Item, Quantity, Unit, Available stock, Unit cost, Total.  
   Enforce: real-time totals, stock validation, no negative stock.

4. **Approval workflow**  
   Use `ApprovalActions` when backend supports status and approval:  
   - Draft: creator can edit and “Submit for approval”.  
   - Submitted: approver sees “Approve” / “Reject (with reason)”.  
   - Approved/Rejected/Completed: form read-only or limited actions.  

5. **Audit trail**  
   Use `AuditTrailPanel` in a side column: Created, Modified, Approved, Issued, linked records.

6. **Validation**  
   - Required fields.  
   - Cross-field (e.g. expiry date &gt; issue date).  
   - Duplicate detection (e.g. serial number unique).  
   - Stock: quantity ≤ available; show warning when shortage.  
   - Real-time error feedback next to fields or in a summary.

---

## 3. Forms and how they use the structure

| Form | Metadata | Sections | Line grid | Approval | Audit | Conditional logic |
|------|----------|----------|-----------|----------|-------|-------------------|
| **Asset Registration** | ✓ Doc# = asset tag, status | A Identity, B Financial, C Assignment, D Lifecycle | — | Optional | ✓ | If category = Server → rack location, IP |
| **ICT Requisitions** | ✓ | A Request details, B Justification | — | ✓ | ✓ | If type = Emergency → justification required |
| **Fleet Requisitions** | ✓ | A Request, B Vehicle/Mileage | — | ✓ | ✓ | — |
| **GRN** | ✓ | A Supplier & delivery, B Line items, C Remarks | ✓ | Optional | ✓ | — |
| **Store Issues** | ✓ | A Requisition, B Line items (issue qty) | ✓ | ✓ | ✓ | Stock validation per line |
| **Job Cards** | ✓ | A Vehicle/Issue, B Parts, C Labour/Dates | ✓ (parts) | ✓ | ✓ | — |
| **Activities** (Finance) | ✓ | A Activity details, B Financial | — | ✓ | ✓ | — |
| **User Management** | ✓ | A General, B Details, C Assignment | — | — | ✓ | — |

---

## 4. Workflow lifecycle

- **Draft** – Editable; creator can submit.  
- **Submitted** – Pending approval; approver can approve or reject (with reason).  
- **Approved** – Locked or limited edits.  
- **Rejected** – Locked; creator may correct and resubmit if supported.  
- **Completed** – Final; read-only.

Status should lock fields after approval (disable inputs when `isLocked(status)`).

---

## 5. Role interaction matrix

| Role | Draft | Submitted | Approved/Completed |
|------|--------|-----------|---------------------|
| **Creator** | Edit, Submit | View | View |
| **Approver** | View | Approve, Reject | View |
| **Viewer** | View | View | View |

Use `canEdit`, `canSubmit`, `canApprove`, `isLocked` from `constants/formWorkflow.js` once backend exposes creator/approver and status.

---

## 6. Conditional logic (examples)

- **Vehicle type = Government owned** → Show insurance, registration expiry.  
- **Requisition type = Emergency** → Require justification field.  
- **Asset category = Server** → Show rack location, IP address.  
- **Date logic** → Expiry date cannot be before issue date; show error.  
- **Stock** → Quantity to issue ≤ available; highlight row or block submit.

Implement with simple `if (form.field === 'value')` and optional sections or extra `FormField`s.

---

## 7. Validation rules (upgrade)

- **Required** – Use `required` and `ims-label-required`.  
- **Cross-field** – Validate on submit and set `<FormField error="…">`.  
- **Duplicate** – Call API or check list; show error on serial/code.  
- **Budget / stock** – Compare to available; show warning or block submit.  
- **Date** – Compare two dates; real-time feedback.  
- **Real-time** – On blur or onChange, set field-level or summary errors.

---

## 8. Layout pattern

- **Modal or full page** – Use `Modal` for create/edit; or full page for complex flows.  
- **Two-column on large screens** – Main form (metadata + sections + grid + actions) in left/top; `AuditTrailPanel` in right/side.  
- **One column on small screens** – Stack metadata, sections, grid, audit, actions.

Reference implementations: **ICT Assets** (metadata + collapsible sections + audit + conditional Server fields), **Stores GRN** (metadata + sections + `LineItemGrid` + audit).

**Applied to:** Asset Registration, GRN, Store Requisitions (Form 76A), Store Issues, Fleet Job Cards, ICT Requisitions, Fleet Requisitions, Finance Activities, User Management (metadata + collapsible sections + audit).
