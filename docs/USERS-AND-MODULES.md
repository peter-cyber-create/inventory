# Users and the five modules

The system has **five module categories**. When creating user accounts, you assign each user to a **Role** and optionally a **Module** so they represent different categories of people (e.g. ICT staff, Fleet staff, Store officers, Finance, Administrators).

## Module categories

| Module   | Area                 | Typical roles / accounts      |
|----------|----------------------|-------------------------------|
| **ICT**  | ICT Assets           | ICT Officer, Asset Manager    |
| **Fleet**| Fleet Management     | Fleet Officer, Transport      |
| **Stores** | Stores Management | Store Officer, Inventory      |
| **Finance** | Finance            | Finance Officer               |
| **Admin** | Administration      | System Admin, HR, Reports     |

## Creating accounts

1. **Administration → User Management** → Create user.
2. Set **Module (category)** to one of: ICT Assets, Fleet Management, Stores Management, Finance, Administration (or “All modules” for cross-cutting roles).
3. Set **Role** (create roles under Administration → Roles & Permissions if needed, e.g. “ICT Officer”, “Fleet Officer”, “Store Officer”, “Finance Officer”, “Admin”).
4. Set **Department** if your organisation uses departments.

Same login works for everyone; **Role** and **Module** identify the category. Restricting which pages a role can see (e.g. Fleet users only see Fleet) can be added later via role-based access control (RBAC) in the backend and frontend.
