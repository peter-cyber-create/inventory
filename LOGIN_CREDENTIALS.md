# 🔐 Login Credentials - All Modules

## Default Admin Credentials

**Main Administrator:**
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: `admin`
- **Access**: Full system access to all modules

## Module-Specific Credentials

### IT/ICT Module
- **Username**: `it_manager`
- **Password**: `admin123`
- **Role**: `it`
- **Access**: IT Assets management, inventory tracking

### Stores Module
- **Username**: `store_manager`
- **Password**: `admin123`
- **Role**: `store`
- **Access**: Stores management, requisitions, GRN

### Fleet Module
- **Username**: `fleet_manager`
- **Password**: `admin123`
- **Role**: `garage`
- **Access**: Vehicle management, maintenance, job cards

### Finance Module
- **Username**: `finance_manager`
- **Password**: `admin123`
- **Role**: `finance`
- **Access**: Financial activities, reporting

## Quick Reference

| Module | Username | Password | Role |
|--------|----------|----------|------|
| Admin | `admin` | `admin123` | `admin` |
| IT | `it_manager` | `admin123` | `it` |
| Stores | `store_manager` | `admin123` | `store` |
| Fleet | `fleet_manager` | `admin123` | `garage` |
| Finance | `finance_manager` | `admin123` | `finance` |

## ⚠️ Security Note

**IMPORTANT**: These are default credentials. Change all passwords immediately after first login for security.

## Access URLs

- **Frontend**: http://172.27.0.10:3000
- **Backend API**: http://172.27.0.10:5000

## Troubleshooting Slow Authentication

If authentication is slow, check:
1. Database connection - ensure PostgreSQL is running
2. Network latency - test from server: `curl http://localhost:5000/api/users/login`
3. Backend logs: `pm2 logs moh-ims-backend`
4. Database query performance

