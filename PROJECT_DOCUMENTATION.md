# 🏗️ Inventory Management System - Complete Project Documentation

**Ministry of Health Uganda - Inventory Management System v2.0.0**

A comprehensive, professional inventory management system built with React frontend and Node.js backend, designed for managing ICT assets, fleet vehicles, stores, and financial activities.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Configuration](#configuration)
7. [API Documentation](#api-documentation)
8. [Modules & Features](#modules--features)
9. [Database Schema](#database-schema)
10. [Security](#security)
11. [Deployment](#deployment)
12. [Development Guide](#development-guide)
13. [Troubleshooting](#troubleshooting)

---

## 📖 Project Overview

The Inventory Management System is a full-stack web application designed for the Ministry of Health Uganda to manage:

- **ICT Assets**: IT equipment tracking and management
- **Fleet Management**: Vehicle tracking, maintenance, and job cards
- **Stores Management**: Inventory, GRN (Goods Received Notes), requisitions, and stock ledger
- **Finance Activities**: Financial activity tracking and reporting
- **User Management**: Role-based access control with multiple modules

### Key Features

- Multi-module architecture with role-based access
- Real-time stock ledger with color-coded entries
- Digital signature capture for approvals
- File upload and document management
- Comprehensive reporting and analytics
- Responsive design with Uganda flag branding
- RESTful API architecture
- PostgreSQL database with Sequelize ORM

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐
│   React Frontend │  (Port 3000)
│   (Port 3000)    │
└────────┬─────────┘
         │ HTTP/REST API
         │
┌────────▼─────────┐
│  Express Backend  │  (Port 5000)
│   (Node.js)       │
└────────┬─────────┘
         │
┌────────▼─────────┐
│   PostgreSQL      │  (Port 5432)
│   Database        │
└──────────────────┘
```

### Frontend Architecture

- **React 18** with functional components and hooks
- **Redux** for state management
- **React Router** for navigation
- **Ant Design** and **Tailwind CSS** for UI components
- **Axios** for API communication
- **Canvas API** for digital signatures

### Backend Architecture

- **Express.js** RESTful API
- **Sequelize ORM** for database operations
- **JWT** authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Helmet** and **CORS** for security
- **PM2** for process management

---

## 🛠️ Technology Stack

### Frontend
- React 18.2.0
- Redux 4.1.2
- React Router DOM 5.2.0
- Ant Design 5.27.1
- Tailwind CSS
- Axios 0.26.1
- ApexCharts / Recharts for data visualization
- React Data Table Component
- Moment.js for date handling

### Backend
- Node.js 18+
- Express.js 4.18.2
- Sequelize 6.35.0
- PostgreSQL 12+ (via pg 8.16.3)
- JWT (jsonwebtoken 9.0.2)
- Bcrypt 5.1.1
- Multer 1.4.5
- Helmet 7.2.0
- Express Rate Limit 8.1.0
- Morgan for logging
- PDFKit / ExcelJS for document generation

### Database
- PostgreSQL 12+
- Sequelize migrations for schema management

### DevOps
- PM2 for process management
- Nginx (optional) for reverse proxy
- Git for version control

---

## 📁 Project Structure

```
inventory/
├── backend/                    # Node.js/Express backend
│   ├── config/                # Configuration files
│   │   ├── db.js             # Database connection
│   │   ├── config.json       # Sequelize config
│   │   ├── email.js          # Email configuration
│   │   └── environments/     # Environment configs
│   ├── middleware/           # Express middleware
│   │   ├── auth.js          # JWT authentication
│   │   └── security.js      # Security middleware
│   ├── models/              # Sequelize models
│   │   ├── assets/         # ICT asset models
│   │   ├── users/          # User models
│   │   ├── stores/         # Store models
│   │   ├── fleet/          # Fleet models
│   │   └── finance/        # Finance models
│   ├── routes/              # API routes
│   │   ├── users/          # User routes
│   │   ├── assets/         # Asset routes
│   │   ├── vehicles/       # Vehicle routes
│   │   ├── stores/         # Store routes
│   │   ├── activity/       # Finance routes
│   │   └── system/         # System routes
│   ├── migrations/          # Database migrations
│   ├── services/           # Business logic services
│   ├── uploads/            # File uploads directory
│   └── index.js            # Main server file
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── common/    # Common components
│   │   │   ├── layout/    # Layout components
│   │   │   └── StoresModule/ # Stores module components
│   │   ├── pages/         # Page components
│   │   │   ├── auth/     # Authentication pages
│   │   │   ├── Dashboard/ # Dashboard pages
│   │   │   ├── ICT/      # ICT asset pages
│   │   │   ├── Fleet/    # Fleet pages
│   │   │   ├── Stores/   # Store pages
│   │   │   └── Finance/  # Finance pages
│   │   ├── services/     # API services
│   │   ├── store/        # Redux store
│   │   ├── utils/        # Utility functions
│   │   └── assets/       # Static assets
│   ├── public/           # Public static files
│   └── build/            # Production build
│
├── config/                  # Global configuration
│   ├── environments/      # Environment files
│   └── secrets/           # Secret files (gitignored)
│
├── scripts/                 # Automation scripts
│   ├── deployment/        # Deployment scripts
│   ├── setup/            # Setup scripts
│   └── maintenance/      # Maintenance scripts
│
├── database/                # Database schemas
│   └── schemas/          # SQL schemas
│
├── docs/                    # Additional documentation
│
├── package.json            # Root package.json
├── ecosystem.config.js     # PM2 configuration
└── README.md              # Main README
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **PostgreSQL**: Version 12 or higher
- **npm**: Version 8 or higher (or yarn)
- **Git**: Latest version

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd inventory
   ```

2. **Install all dependencies**:
   ```bash
   npm run install:all
   # This installs dependencies for root, backend, and frontend
   ```

3. **Set up environment variables**:
   ```bash
   # Backend environment
   cp config/environments/backend.env.example config/environments/backend.env
   # Edit backend.env with your database credentials
   
   # Production environment (if deploying)
   cp production.env.example production.env
   # Edit production.env with production settings
   ```

4. **Set up PostgreSQL database**:
   ```bash
   # Create database and user
   sudo -u postgres psql
   CREATE DATABASE inventory_db;
   CREATE USER inventory_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;
   \q
   ```

5. **Run database migrations**:
   ```bash
   cd backend
   npm run migrate
   # Or use the migration script
   ./run-migrations.sh
   ```

6. **Start the application**:
   ```bash
   # Development mode (from root)
   npm run dev
   
   # Or start separately
   npm run backend:dev    # Backend on port 5000
   npm run frontend:dev   # Frontend on port 3000
   ```

### Default Login Credentials

⚠️ **Change these immediately after first login!**

- **Admin**: `admin` / `admin123`
- **IT Manager**: `it_manager` / `admin123`
- **Store Manager**: `store_manager` / `admin123`
- **Fleet Manager**: `fleet_manager` / `admin123`
- **Finance Manager**: `finance_manager` / `admin123`

### Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/system/health

---

## ⚙️ Configuration

### Backend Environment Variables

Create `config/environments/backend.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=inventory_user
DB_PASS=your_secure_password

# Server Configuration
PORT=5000
NODE_ENV=development

# Security
SECRETKEY=your_jwt_secret_key_minimum_64_characters
CORS_ORIGIN=http://localhost:3000

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### Frontend Configuration

Frontend uses environment variables for API URLs. Create `.env` in frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_VERSION=v1
```

### Database Configuration

The database connection is configured in `backend/config/db.js` and uses environment variables from `backend.env`.

---

## 📡 API Documentation

### Base URL
- Development: `http://localhost:5000`
- Production: `http://your-domain.com:5000`

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

#### Authentication Endpoints

- `POST /api/users/login` - User login
  ```json
  {
    "username": "admin",
    "password": "admin123"
  }
  ```
  Returns: `{ token, user }`

- `POST /api/users/register` - User registration (admin only)
- `GET /api/users/profile` - Get current user profile
- `POST /api/users/logout` - User logout

### ICT Assets Management

- `GET /api/assets` - Get all assets
- `POST /api/assets` - Create new asset
- `GET /api/assets/:id` - Get asset by ID
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset
- `GET /api/category` - Get asset categories
- `GET /api/brand` - Get brands
- `GET /api/model` - Get models
- `GET /api/type` - Get asset types
- `POST /api/dispatch` - Dispatch asset
- `POST /api/transfers` - Transfer asset
- `POST /api/maintenance` - Create maintenance record
- `POST /api/disposal` - Dispose asset

### Fleet Management

- `GET /api/v/vehicle` - Get all vehicles
- `POST /api/v/vehicle` - Create new vehicle
- `GET /api/v/vehicle/:id` - Get vehicle by ID
- `PUT /api/v/vehicle/:id` - Update vehicle
- `DELETE /api/v/vehicle/:id` - Delete vehicle
- `GET /api/v/type` - Get vehicle types
- `GET /api/v/make` - Get vehicle makes
- `GET /api/v/garage` - Get garages
- `GET /api/v/driver` - Get drivers
- `POST /api/v/jobcard` - Create job card
- `GET /api/v/jobcard` - Get job cards
- `GET /api/v/sparepart` - Get spare parts
- `POST /api/v/service` - Create service request

### Stores Management

#### GRN (Goods Received Note)
- `POST /api/stores/grn` - Create new GRN
- `GET /api/stores/grn` - Get all GRNs
- `GET /api/stores/grn/:id` - Get GRN by ID
- `PUT /api/stores/grn/:id` - Update GRN
- `PATCH /api/stores/grn/:id/approve` - Approve GRN

#### Requisitions/Issuance (Form 76A)
- `POST /api/stores/form76a` - Create requisition
- `GET /api/stores/form76a` - Get all requisitions
- `GET /api/stores/form76a/:id` - Get requisition by ID
- `PATCH /api/stores/form76a/:id/approve` - Approve requisition
- `POST /api/stores/form76a/:id/issue` - Issue items

#### Stock Ledger
- `GET /api/stores/ledger` - Get ledger entries
- `GET /api/stores/ledger/:itemId` - Get item ledger
- `POST /api/stores/ledger/recalculate/:itemId` - Recalculate balances

#### Items
- `GET /api/stores/items` - Get all store items
- `POST /api/stores/items` - Create store item
- `PUT /api/stores/items/:id` - Update item
- `GET /api/stores/items/:id` - Get item by ID

#### Suppliers
- `GET /api/stores/suppliers` - Get all suppliers
- `POST /api/stores/suppliers` - Create supplier

#### Locations
- `GET /api/stores/locations` - Get all locations
- `POST /api/stores/locations` - Create location

### Finance Activities

- `GET /api/activity` - Get all activities
- `POST /api/activity` - Create new activity
- `GET /api/activity/:id` - Get activity by ID
- `PUT /api/activity/:id` - Update activity
- `GET /api/reports` - Get financial reports

### System Endpoints

- `GET /api/system/health` - Health check
- `GET /api/system/stats` - System statistics

### File Uploads

- `POST /api/uploads` - Upload file (max 10MB)
- `GET /api/downloads/:filename` - Download file

---

## 🎯 Modules & Features

### 1. ICT Assets Management

**Features:**
- Asset registration and tracking
- Category, brand, and model management
- Asset dispatch and transfers
- Maintenance records
- Asset disposal
- Department and facility management
- Asset requisitions

**Key Components:**
- Asset list with filtering and search
- Asset details view
- Asset creation/editing forms
- Dispatch management
- Maintenance tracking
- Disposal workflow

### 2. Fleet Management

**Features:**
- Vehicle registration and tracking
- Vehicle types, makes, and models
- Garage and driver management
- Job card creation and tracking
- Spare parts inventory
- Service requests
- Vehicle maintenance history

**Key Components:**
- Vehicle list and details
- Job card management
- Spare parts management
- Service request forms
- Maintenance history

### 3. Stores Management

**Features:**
- **GRN (Goods Received Note)**: Receive and record goods
- **Form 76A (Requisition/Issuance)**: Government format requisitions
- **Stock Ledger**: Real-time stock tracking with color-coded entries
- Item management
- Supplier management
- Location management
- Stock balance tracking

**Key Components:**
- GRN form with digital signatures
- Form 76A requisition form
- Stock ledger with color coding:
  - Red: Opening stock
  - Green: Received items (from GRN)
  - Black: Issued items (from Issuance)
  - Blue: Closing balance
- Item management interface
- Supplier and location management

**Design System:**
- Uganda flag colors (Black, Yellow, Red) top stripe
- Ministry of Health branding
- WCAG AA compliant accessibility
- Responsive design

### 4. Finance Activities

**Features:**
- Financial activity tracking
- Activity reporting
- Department-wise financial tracking
- User activity management

**Key Components:**
- Activity list and details
- Activity creation/editing
- Financial reports
- Dashboard with analytics

### 5. User Management

**Features:**
- User registration and authentication
- Role-based access control
- Module-based permissions
- Department assignments
- User profile management
- Password management

**Roles:**
- Admin
- IT Manager
- Store Manager
- Fleet Manager
- Finance Manager
- Staff

---

## 🗄️ Database Schema

### Core Tables

#### Users
- `id`, `username`, `email`, `password` (hashed)
- `firstname`, `lastname`, `phone`, `designation`
- `role`, `module`, `depart`, `department_id`
- `is_active`, `createdat`, `updatedat`

#### Assets (ICT)
- Asset details, categories, brands, models
- Dispatch records, transfers, maintenance
- Disposal records

#### Vehicles (Fleet)
- Vehicle details, types, makes
- Job cards, spare parts, service requests
- Maintenance history

#### Stores
- **GRN**: Contract No., LPO No., Delivery Note, Tax Invoice, GRN No.
- **Form 76A**: Requisition details, serial numbers, signatures
- **Stock Ledger**: Item movements, opening/closing balances
- **Items**: Item details, units, categories
- **Suppliers**: Supplier information
- **Locations**: Storage locations

#### Activities (Finance)
- Activity details, amounts, departments
- User assignments, dates, status

### Relationships

- Users can have multiple assets assigned
- Vehicles can have multiple job cards and maintenance records
- Stores items link to GRNs and requisitions
- Activities are linked to users and departments
- All modules support audit logging

---

## 🔒 Security

### Authentication & Authorization

- **JWT-based authentication** with token expiration
- **Bcrypt password hashing** (10 rounds)
- **Role-based access control** (RBAC)
- **Module-based permissions**
- **Rate limiting** on authentication endpoints

### Security Middleware

- **Helmet.js** for security headers
- **CORS** configuration
- **Input validation** and sanitization
- **Request logging** for audit trails
- **Error handling** that doesn't leak sensitive info

### Security Best Practices

1. **Environment Variables**: All sensitive data in environment variables
2. **No Hardcoded Secrets**: No passwords or secrets in code
3. **File Permissions**: Environment files set to 600
4. **HTTPS**: Use SSL/TLS in production
5. **Firewall**: Configure firewall rules
6. **Regular Updates**: Keep dependencies updated
7. **Audit Logging**: All actions logged for audit

### Generating Secure Secrets

```bash
# Generate secure secrets
./scripts/security/generate-secrets.sh
```

This generates:
- JWT Secret (128 hex characters)
- Session Secret (64 hex characters)
- Database Password (base64 encoded)

### Security Checklist

- [ ] All secrets generated using secure generator
- [ ] Environment files updated with secure values
- [ ] Default passwords changed
- [ ] Database password is strong
- [ ] JWT secret is strong (64+ characters)
- [ ] Environment files NOT in git
- [ ] SSL/TLS configured
- [ ] Firewall rules configured
- [ ] CORS origin set correctly
- [ ] File permissions set (600 for env files)

---

## 🚀 Deployment

### Production Deployment

#### Option 1: Automated Deployment (Recommended)

```bash
chmod +x deploy-production.sh
./deploy-production.sh
```

#### Option 2: Manual Deployment

1. **Server Setup**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs postgresql git
   ```

2. **Database Setup**:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE inventory_db;
   CREATE USER inventory_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;
   \q
   ```

3. **Application Setup**:
   ```bash
   cd /opt
   sudo git clone <repo-url> moh-uganda-ims
   sudo chown -R $USER:$USER moh-uganda-ims
   cd moh-uganda-ims
   npm run install:all
   ```

4. **Configure Environment**:
   ```bash
   cp production.env.example production.env
   nano production.env  # Edit with production values
   cp config/environments/backend.env.example config/environments/backend.env
   nano config/environments/backend.env  # Edit with production values
   ```

5. **Run Migrations**:
   ```bash
   cd backend
   npm run migrate
   ```

6. **Build Frontend**:
   ```bash
   cd ../frontend
   npm run build
   ```

7. **Start with PM2**:
   ```bash
   npm install -g pm2
   cd /opt/moh-uganda-ims
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### PM2 Configuration

The `ecosystem.config.js` file configures:
- Backend process on port 5000
- Frontend serving on port 3000
- Log management
- Auto-restart on failure
- Cluster mode (optional)

### Nginx Configuration (Optional)

For production, configure Nginx as reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Monitoring & Maintenance

- **Health Check**: `GET /api/system/health`
- **PM2 Logs**: `pm2 logs`
- **PM2 Status**: `pm2 status`
- **Restart**: `pm2 restart all`

### Backup Strategy

1. **Database Backup**:
   ```bash
   pg_dump -U inventory_user inventory_db > backup_$(date +%Y%m%d).sql
   ```

2. **Application Backup**:
   ```bash
   tar -czf app_backup_$(date +%Y%m%d).tar.gz /opt/moh-uganda-ims
   ```

### Updates

```bash
# Stop services
pm2 stop all

# Backup current version
cp -r /opt/moh-uganda-ims /opt/backups/backup_$(date +%Y%m%d)

# Pull updates
cd /opt/moh-uganda-ims
git pull origin main

# Update dependencies
npm run install:all

# Run migrations
cd backend && npm run migrate

# Restart services
pm2 restart all
```

---

## 💻 Development Guide

### Development Workflow

1. **Start Development Servers**:
   ```bash
   npm run dev
   # Starts both backend and frontend in development mode
   ```

2. **Backend Development**:
   ```bash
   cd backend
   npm run dev  # Uses nodemon for auto-reload
   ```

3. **Frontend Development**:
   ```bash
   cd frontend
   npm start  # React development server with hot reload
   ```

### Code Structure

#### Backend

- **Models**: Sequelize models in `models/` directory
- **Routes**: Express routes in `routes/` directory
- **Middleware**: Custom middleware in `middleware/` directory
- **Services**: Business logic in `services/` directory
- **Migrations**: Database migrations in `migrations/` directory

#### Frontend

- **Components**: Reusable components in `components/`
- **Pages**: Page components in `pages/`
- **Services**: API services in `services/`
- **Store**: Redux store configuration in `store/`
- **Utils**: Utility functions in `utils/`

### Database Migrations

```bash
# Create new migration
cd backend
npx sequelize-cli migration:generate --name migration-name

# Run migrations
npm run migrate

# Rollback last migration
npx sequelize-cli db:migrate:undo
```

### API Development

1. Create model in `models/`
2. Create routes in `routes/`
3. Add route to `index.js`
4. Test with Postman or curl
5. Update frontend services

### Frontend Development

1. Create component in `components/` or `pages/`
2. Add Redux actions/reducers if needed
3. Create API service in `services/`
4. Add route in App.js
5. Test in browser

### Code Standards

- **ESLint**: Configured for both backend and frontend
- **Prettier**: Code formatting (if configured)
- **Git Hooks**: Pre-commit hooks for code quality
- **Naming**: Consistent naming conventions
  - Components: PascalCase
  - Functions: camelCase
  - Constants: UPPER_SNAKE_CASE

---

## 🐛 Troubleshooting

### Common Issues

#### Backend Won't Start

1. **Check port availability**:
   ```bash
   lsof -i :5000
   ```

2. **Check database connection**:
   ```bash
   psql -U inventory_user -d inventory_db -h localhost
   ```

3. **Check environment variables**:
   ```bash
   cd backend
   node -e "require('dotenv').config({path: '../config/environments/backend.env'}); console.log(process.env.DB_NAME)"
   ```

4. **Check logs**:
   ```bash
   pm2 logs
   ```

#### Frontend Won't Start

1. **Check port availability**:
   ```bash
   lsof -i :3000
   ```

2. **Clear cache and reinstall**:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Check API connection**:
   - Verify `REACT_APP_API_URL` in `.env`
   - Check backend is running

#### Database Connection Failed

1. **Check PostgreSQL service**:
   ```bash
   sudo systemctl status postgresql
   ```

2. **Verify credentials** in `backend.env`

3. **Check firewall**:
   ```bash
   sudo ufw status
   ```

4. **Test connection**:
   ```bash
   psql -U inventory_user -d inventory_db -h localhost
   ```

#### Migration Errors

1. **Check migration status**:
   ```bash
   cd backend
   npx sequelize-cli db:migrate:status
   ```

2. **Rollback and re-run**:
   ```bash
   npx sequelize-cli db:migrate:undo
   npx sequelize-cli db:migrate
   ```

#### PM2 Issues

1. **Check PM2 status**:
   ```bash
   pm2 status
   pm2 logs
   ```

2. **Restart processes**:
   ```bash
   pm2 restart all
   ```

3. **Delete and restart**:
   ```bash
   pm2 delete all
   pm2 start ecosystem.config.js
   ```

### Log Locations

- **PM2 Logs**: `~/.pm2/logs/`
- **Application Logs**: `/var/log/moh-ims*.log` (if configured)
- **Backend Logs**: Console output or PM2 logs
- **Frontend Logs**: Browser console

### Performance Issues

1. **Database Optimization**:
   - Add indexes on frequently queried columns
   - Use connection pooling
   - Optimize queries

2. **Frontend Optimization**:
   - Code splitting with React.lazy()
   - Image optimization
   - Bundle size optimization

3. **Caching**:
   - Implement Redis for session storage (optional)
   - Use CDN for static assets (optional)

---

## 📞 Support & Resources

### Documentation Files

- This file: Complete project documentation
- `README.md`: Quick start guide
- `ecosystem.config.js`: PM2 configuration
- `package.json`: Dependencies and scripts

### Useful Commands

```bash
# Install all dependencies
npm run install:all

# Start development
npm run dev

# Start production
npm start

# Stop application
npm stop

# Run migrations
npm run migrate

# Health check
npm run health

# View logs
npm run logs

# Restart
npm run restart
```

### Contact

For technical support or issues, contact the development team.

---

## 📝 Version History

- **v2.0.0**: Current version
  - Multi-module architecture
  - Stores module with GRN and Form 76A
  - Enhanced security
  - PostgreSQL support
  - PM2 process management

---

**Last Updated**: 2025-01-20  
**Maintained by**: MoH Uganda IT Team  
**License**: MIT

