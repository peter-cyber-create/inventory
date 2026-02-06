## MOH Inventory System – Non‑Technical Workflow (Module by Module)

This document explains, in simple language, **how staff use the system day‑to‑day**, module by module. For each module, it describes the **main screens/forms** and the **key fields** that users fill in. It deliberately avoids technical details like APIs, databases, or code.

---

## 1. Logging In (All Modules)

### 1.1 Login Screen

This is the entry point for everyone.

- **Where it is used**
  - All users (Stores, Fleet/Garage, Finance, ICT, Admin) use the same login screen.
  - After login, the system sends each person to the correct dashboard for their role.

- **Fields on the Login Form**
  - **Username**
    - The user’s official system username.
  - **Password**
    - The user’s secure system password.
  - **Remember session** (checkbox)
    - If ticked, keeps the user signed in for longer on the same device.

- **What happens after login**
  - If details are correct, the user is taken to:
    - ICT Dashboard – for ICT officers.
    - Fleet Dashboard – for garage/fleet officers.
    - Stores Dashboard – for storekeepers.
    - Finance Dashboard – for finance users.
    - Admin Dashboard – for system administrators.
  - If details are wrong, a clear message is shown and no access is granted.

---

## 2. User & Access Management (Admin)

These screens are mainly for system administrators.

### 2.1 Create / Manage User Accounts

- **Who uses this**
  - System Administrators.

- **Typical fields on the “Add User” form**
  - **Username**
  - **Email**
  - **First name**
  - **Last name**
  - **Mobile phone**
  - **Designation / Job title**
  - **Module / Role**
    - Examples: ICT, Store, Garage, Finance, Admin.
  - **Department / Unit**
  - **Official health email**
  - **Department ID** (internal reference)
  - **Active / Inactive** flag
  - **Password**
    - Must meet security rules (length, mix of characters, etc.).

- **What this form is used for**
  - Creating new system users.
  - Updating their details (e.g. when staff are transferred).
  - Activating or deactivating accounts.

---

## 3. ICT Assets Inventory Module

This module manages ICT equipment such as computers, servers, and related assets.

### 3.1 “Add ICT Asset” Form (Two Independent Tables)

This form is split into **two independent tables**, not one table with a next button. Users can complete either section and then submit the overall form.

#### Table A – Assigned User Information

- **Who uses this**
  - ICT asset managers.

| Field name       | What the user enters / sees                          |
|------------------|------------------------------------------------------|
| Assigned User    | Name of the person the ICT equipment is assigned to. |
| Department       | Department where that person works.                  |
| Phone number     | Official mobile or office contact.                   |
| Job title        | Position/designation of the assigned user.          |
| Email            | Work email address.                                  |
| Purchase date    | Date when the asset was bought or received.         |

#### Table B – ICT Asset Line Items

For each asset row in this **separate** table:

| Field name       | What the user enters / sees                                                                 |
|------------------|---------------------------------------------------------------------------------------------|
| Asset description| Friendly name of the item (e.g. “Desktop Computer”, “Laptop – Dell”).                      |
| Category         | High‑level group (e.g. Desktop, Laptop, Printer).                                          |
| Model            | Specific model name or series.                                                              |
| Serial number    | Manufacturer’s serial number marked on the device.                                         |
| Engraved number  | Asset tag / engraved number physically put on the equipment for tracking.                  |
| Funding source   | Source of funds for the purchase (e.g. “GLOBAL FUND”, “GOU”, “Donor X”, “Project name”).   |

Users can add as many asset rows as needed in Table B.

### 3.2 Other ICT Asset Screens (high level)

- **Asset List / Inventory View**
  - Search and filter ICT assets by department, user, category, status, etc.
- **Asset Edit**
  - Same type of fields as “Add ICT Asset”, but used to correct or update records.
- **Requisition & Issue (ICT)**
  - Simple forms that link ICT equipment to staff requisitions and issue actions.

---

## 4. Stores Module (GRN, Requisitions, Stock Ledger)

The Stores module handles **goods received**, **requisitions**, **issues**, and **stock balances**.

### 4.1 Goods Received Note (GRN) Screen

This screen mirrors the official government GRN form.

- **Who uses this**
  - Storekeepers and procurement receiving officers.

- **Header fields**
  - **Contract No.**
  - **LPO No. (Local Purchase Order number)**
  - **Delivery note number**
  - **Tax invoice number**
  - **GRN number**
    - Automatically or manually set: unique reference for the GRN.
  - **Date**
    - Date of receipt.
  - **Supplier name**
  - **Supplier contact**
  - **Delivery location**
  - **General remarks**

- **Line‑item table fields** (for each received item)
  - **Description**
    - Name/description of the item.
  - **Unit**
    - Unit of measure (e.g. box, piece, carton).
  - **Quantity ordered**
  - **Quantity delivered**
  - **Quantity accepted**
    - The quantity that was actually accepted into stock.
  - **Unit price**
  - **Total value**
  - **Item‑level remarks**
    - Notes such as damages, short deliveries, or quality concerns.

- **Main actions**
  - **Create GRN**
  - **Edit existing GRN**
  - **Print GRN**

### 4.2 Form 76A – Requisition / Issue Voucher

This is the official Ministry of Health **Form 76A** used to request and issue items from the store.

- **Who uses this**
  - Departmental staff (requesters) and storekeepers (issuers/approvers).

- **Form header fields**
  - **Serial number**
    - Usually generated automatically (e.g. `REQ-2026...`).
  - **Date**
  - **Country**
    - Pre‑filled as “The Republic of Uganda”.
  - **Ministry**
    - Pre‑filled as “Ministry of Health”.
  - **From department**
    - Department requesting the items.
  - **To store**
    - The store that will issue the items.
  - **Purpose / remarks**
    - Short explanation of why the items are needed.

- **Line‑item table fields** (for each item requested)
  - **Description**
  - **Unit**
  - **Quantity ordered**
    - Quantity requested by the department.
  - **Quantity approved**
    - Quantity authorised after review.
  - **Quantity issued**
    - Quantity actually issued from the store.

- **Workflow steps (plain language)**
  1. The requesting department fills in Form 76A (header + items).
  2. The form is submitted and appears in the list as **Draft** or **Submitted**.
  3. Store staff review, approve, and issue quantities.
  4. The status changes (e.g. Draft → Submitted → Approved → Issued/Printed).

### 4.3 Stock Ledger Screen

This screen presents the stock ledger – a running record of stock movements.

- **Who uses this**
  - Storekeepers and auditors.

- **Typical fields for each ledger entry**
  - **Transaction date**
  - **Reference type**
    - Example: GRN, Issue, Adjustment.
  - **Reference number**
    - Links to GRN number, Form 76A serial number, etc.
  - **Item description**
  - **Item code**
  - **Unit of issue**
  - **Quantity received**
  - **Quantity issued**
  - **Balance on hand**
  - **Unit cost**
  - **Total value**
  - **Department**
  - **Remarks**
  - **Created by**
  - **Manual entry flag**
    - Indicates if the entry was manually added or system‑generated.

- **How it is used**
  - To review the movement of items over time.
  - To check current balances and investigate discrepancies.

---

## 5. Fleet & Garage Module

This module handles vehicles, garage operations, service requests, job cards, and spare parts.

### 5.1 “Add Vehicle” Form

- **Who uses this**
  - Fleet managers and garage administrators.

- **Vehicle identification fields**
  - **Old number plate**
  - **New number plate**
  - **Type**
    - For example: Pick‑up, Ambulance, Saloon, etc.
  - **Make**
    - E.g. Toyota, Nissan, Mitsubishi.
  - **Model**
    - Specific model like “Hilux”, “Prado”, etc.
  - **Chassis number**
  - **Engine number**
  - **Fuel type**
    - Petrol, Diesel, etc.
  - **Horse power / Power**
  - **Year of manufacture**
  - **Purchase cost**
  - **Colour**
  - **Country of origin**

- **Assignment fields**
  - **User department**
    - Department primarily using the vehicle.
  - **Driver**
  - **Responsible officer**
  - **Contact details**
  - **Age**
    - Sometimes captured as a derived or descriptive field.

### 5.2 Service Request Screen (Garage)

- **Purpose**
  - To record when a vehicle needs repair or routine servicing.

- **Typical fields**
  - **Vehicle** (selected from vehicle list)
  - **Requesting department / driver**
  - **Complaint / problem description**
  - **Odometer reading**
  - **Date of request**
  - **Priority / urgency**

- **How it is used**
  - Drivers or departments raise requests.
  - Garage team reviews and decides whether to open a job card.

### 5.3 Job Card Screen

- **Purpose**
  - Official record describing the work done on a vehicle in the garage.

- **Typical job card fields**
  - **Job card number**
  - **Vehicle details**
    - Plate, make, model, department.
  - **Driver name**
  - **Odometer reading**
  - **Complaints / reported problems**
  - **Findings / diagnosis**
  - **Work to be carried out**
  - **Start and completion dates**
  - **Mechanic(s) assigned**
  - **Parts used** (linked table)

- **Parts used (within job card) – line‑item fields**
  - **Part name / description**
  - **Part number (if available)**
  - **Quantity used**
  - **Unit cost**
  - **Total cost**

### 5.4 Spare Parts & Garage Stock Screens

- **Spare parts catalog**
  - Fields include:
    - Part name, category, unit, minimum stock, maximum stock.
  - Used to define all parts that can be used in the garage.

- **Spare parts stock**
  - Tracks:
    - Quantity received, quantity issued to jobs, balance in garage store.

---

## 6. Finance & Activities Module

This module tracks activities such as trainings and workshops, along with their reports.

### 6.1 Activity Creation / Edit Screen

- **Who uses this**
  - Finance officers and programme staff.

- **Typical activity fields**
  - **Activity title / name**
  - **Activity type**
    - Training, Workshop, Meeting, Supervision, etc.
  - **Start date**
  - **End date**
  - **Location / venue**
  - **Funding source**
  - **Budget amount**
  - **Responsible officer**
  - **Status**
    - Planned, In progress, Completed, Closed.

- **Participants (details per person)**
  - **Name**
  - **Designation**
  - **Organisation / facility**
  - **Role in activity**

### 6.2 Activity Report Upload Screen

- **Purpose**
  - To attach the final report document to a completed activity.

- **Key fields**
  - **Activity**
    - Selected from existing activities.
  - **Report file**
    - PDF or Word document (as required by policy).

- **Outcome**
  - The activity’s status moves to something like “Activity closed”.
  - The report is available for download and review in finance reports.

### 6.3 Finance Reports Screens

- **Examples of report views**
  - Activities by funding source.
  - Activities by date range.
  - Activities per participant.
  - Pending accountability.
  - Amounts per user.

- **Typical filter fields**
  - **Date range**
  - **Funding source**
  - **Officer / user**
  - **Status**

---

## 7. Helpdesk / Ticketing Module

This module provides a structured way for staff to raise ICT or operational issues and track their resolution.

### 7.1 New Ticket Screen

- **Who uses this**
  - All system users who need support.

- **Typical fields**
  - **Subject / title**
  - **Issue category**
    - E.g. Login issue, Asset problem, Network outage.
  - **Priority**
    - Low, Normal, High, Critical.
  - **Detailed description**
  - **Attachments**
    - Optional screenshots or documents.

### 7.2 Ticket Details & Comments Screen

- **What is shown**
  - All information from the ticket.
  - **Assigned agent / team**.
  - **Status**
    - Open, In progress, Resolved, Closed.
  - **Comment thread**
    - Messages between the requester and the assigned agent.

- **What users can do**
  - Add comments.
  - Upload additional information.
  - For agents: change status, assign or reassign tickets.

---

## 8. Dashboards & Overview Screens

Across the system there are **dashboard pages** that bring information together for quick viewing.

### 8.1 Admin Dashboard

- **Key elements**
  - Total number of assets, vehicles, GRNs, requisitions, activities, tickets, etc.
  - Breakdown by status (e.g. open vs closed tickets, pending vs completed activities).
  - Charts and tables to quickly see which areas need attention.

### 8.2 Module‑Specific Dashboards

- **ICT / Assets Dashboard**
  - Shows breakdown of ICT assets by category, department, and status.
- **Stores Dashboard**
  - Shows GRNs, issues, stock balances, and alerts (e.g. low stock).
- **Fleet Dashboard**
  - Shows number of vehicles, active service requests, open job cards, and downtime.
- **Finance Dashboard**
  - Shows ongoing and completed activities, budgets, and pending reports.

---

## 9. How to Use This Document

- **For new staff**
  - Use this as a high‑level guide to understand which screen to use for each business process and what information is required.
- **For managers**
  - Use the module descriptions to understand how data flows from procurement to assets, stores, fleet, finance, and support.
- **For training and SOPs**
  - This document can be a base to build detailed step‑by‑step Standard Operating Procedures (SOPs) with screenshots for each form.

