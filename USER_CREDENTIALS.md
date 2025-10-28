# Ministry of Health Uganda - Inventory Management System
# User Credentials Reference

## 🔐 Default Login Credentials

### Admin Access
- **Username**: `admin`
- **Password**: `admin123`
- **Role**: Admin (Full system access)
- **Access**: All modules and administrative functions

### Module Managers
- **IT Manager**
  - Username: `it_manager`
  - Password: `admin123`
  - Access: IT Assets module

- **Store Manager**
  - Username: `store_manager`
  - Password: `admin123`
  - Access: Stores module

- **Fleet Manager**
  - Username: `fleet_manager`
  - Password: `admin123`
  - Access: Fleet management module

- **Finance Manager**
  - Username: `finance_manager`
  - Password: `admin123`
  - Access: Finance/Activities module

## 🚀 System Access

### Frontend Application
- **URL**: http://localhost:3001
- **Login Page**: Enhanced with gradient styling
- **Features**: GRN-style design, search filters, password management

### Backend API
- **URL**: http://localhost:5000
- **Status**: Fully operational
- **Database**: PostgreSQL connected

## 🛠️ Password Reset

If you need to reset any password, use the reset script:
```bash
./reset-admin-password.sh
```

## 📋 System Features

### ✅ Working Modules
- User Management (Create, Edit, Delete, Password Change)
- IT Assets Management (Types, Brands, Categories, Models, Assets)
- Stores Management (Requisitions, GRN)
- Fleet Management (Vehicles)
- Finance/Activities Management
- Admin Dashboard
- Search and Filtering
- Cross-module Integration

### 🎨 Design Features
- GRN-style standardized tables and forms
- Professional gradient text styling
- Responsive design
- Modern UI components

## 🔧 Troubleshooting

### Login Issues
1. Ensure the application is running (`npm run dev`)
2. Check database connection
3. Use the password reset script if needed
4. Verify user exists in the system

### System Status
- Frontend: ✅ Running on port 3001
- Backend: ✅ Running on port 5000
- Database: ✅ PostgreSQL connected
- All APIs: ✅ Responding correctly
