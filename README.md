# 🏗️ Inventory Management System

**Ministry of Health Uganda - Inventory Management System v2.0.0**

A comprehensive, professional inventory management system built with React frontend and Node.js backend, designed for managing ICT assets, fleet vehicles, stores, and financial activities.

## 🚀 Quick Start

```bash
# Install all dependencies
npm run install:all

# Start the application (development)
npm run dev

# Start the application (production)
npm start

# Stop the application
npm stop
```

## 📋 Prerequisites

- **Node.js**: Version 18 or higher
- **PostgreSQL**: Version 12 or higher
- **npm**: Version 8 or higher

## 🏃 Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd inventory
   ```

2. **Install dependencies**:
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**:
   ```bash
   cp config/environments/backend.env.example config/environments/backend.env
   # Edit backend.env with your database credentials
   ```

4. **Set up database**:
   ```bash
   # Create database and user
   sudo -u postgres psql
   CREATE DATABASE inventory_db;
   CREATE USER inventory_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;
   \q
   ```

5. **Run migrations**:
   ```bash
   cd backend
   npm run migrate
   ```

6. **Start the application**:
   ```bash
   npm run dev
   ```

## 🌐 Access URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/system/health

## 🔑 Default Login

⚠️ **Change these immediately after first login!**

- **Admin**: `admin` / `admin123`
- **IT Manager**: `it_manager` / `admin123`
- **Store Manager**: `store_manager` / `admin123`
- **Fleet Manager**: `fleet_manager` / `admin123`
- **Finance Manager**: `finance_manager` / `admin123`

## 📁 Project Structure

```
inventory/
├── backend/          # Node.js/Express backend API
├── frontend/         # React frontend application
├── config/           # Configuration files
├── scripts/          # Automation scripts
├── database/         # Database schemas
└── docs/             # Additional documentation
```

## 🎯 Features

- **ICT Assets Management**: Track and manage IT equipment
- **Fleet Management**: Vehicle tracking and maintenance
- **Stores Management**: Inventory, GRN, requisitions, and stock ledger
- **Finance Activities**: Financial tracking and reporting
- **User Management**: Role-based access control

## 📚 Documentation

For complete project documentation, see **[PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)**

The comprehensive documentation includes:
- Complete architecture overview
- API documentation
- Module details and features
- Database schema
- Security guidelines
- Deployment instructions
- Development guide
- Troubleshooting

## 🛠️ Available Scripts

- `npm run dev` - Start development servers
- `npm start` - Start production servers
- `npm stop` - Stop all services
- `npm run install:all` - Install all dependencies
- `npm run migrate` - Run database migrations
- `npm run health` - Check backend health
- `npm run logs` - View PM2 logs
- `npm run restart` - Restart PM2 processes

## 🔧 Technology Stack

- **Frontend**: React 18, Redux, Ant Design, Tailwind CSS
- **Backend**: Node.js, Express.js, Sequelize ORM
- **Database**: PostgreSQL 12+
- **Process Management**: PM2

## 📄 License

MIT License - see LICENSE file for details.

---

**For detailed documentation, see [PROJECT_DOCUMENTATION.md](./PROJECT_DOCUMENTATION.md)**
