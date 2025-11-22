# 🚀 Deployment Guide - New Server Setup

This guide will help you deploy the Ministry of Health Uganda Inventory Management System to a new server with database on `confdb@172.27.0.10`.

## 📋 Prerequisites

Before starting, ensure you have:
- SSH access to the server (confdb@172.27.0.10)
- **Note**: This is a single-server deployment (application and database on the same server)
- Node.js 20 LTS (will be installed if not present)
- PostgreSQL will be installed on the same server
- npm or yarn package manager
- Git installed
- PM2 for process management (optional but recommended)

## 🔧 Step 1: Server Preparation

### 1.1 Update System Packages
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Node.js (if not installed)
```bash
# Install Node.js 20 LTS (recommended) or Node.js 18 (still works but deprecated)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x or higher
npm --version
```

**Note**: If you've already installed Node.js 18, it will still work, but Node.js 20 LTS is recommended for long-term support and security updates.

### 1.3 Install PostgreSQL Client (on application server)
```bash
sudo apt-get install -y postgresql-client
```

### 1.4 Install PM2 (for process management)
```bash
sudo npm install -g pm2
```

## 🗄️ Step 2: Database Setup (Same Server)

**Note**: Since both application and database are on the same server, we'll install and configure PostgreSQL locally.

### 2.1 Install PostgreSQL
```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
sudo systemctl status postgresql
```

### 2.2 Create Database and User
```bash
# Switch to postgres user and access PostgreSQL
sudo -u postgres psql

# In PostgreSQL prompt, run:
CREATE DATABASE inventory_db;
CREATE USER inventory_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;
ALTER USER inventory_user CREATEDB;  # Allow user to create databases if needed

# Exit PostgreSQL
\q
```

### 2.3 Verify Database Connection
```bash
# Test connection as the new user
psql -U inventory_user -d inventory_db -h localhost

# If prompted for password, enter the password you set
# Type \q to exit
```

### 2.4 Configure PostgreSQL (Optional - for remote access if needed later)
If you need remote access in the future, edit `/etc/postgresql/*/main/postgresql.conf`:
```conf
listen_addresses = 'localhost'  # or '*' for all interfaces
```

Edit `/etc/postgresql/*/main/pg_hba.conf`:
```
# Local connections
local   all             all                                     peer
host    all             all             127.0.0.1/32            md5
host    inventory_db    inventory_user  127.0.0.1/32            md5
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

## 📦 Step 3: Application Deployment

### 3.1 Clone Repository
```bash
cd /opt
sudo git clone <your-repository-url> inventory
sudo chown -R $USER:$USER inventory
cd inventory
```

### 3.2 Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 3.3 Configure Environment Variables

#### Backend Configuration
Create `config/environments/backend.env`:
```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration (PostgreSQL)
# Since database is on same server, use localhost
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=inventory_user
DB_PASS=your_secure_password_here

# JWT Configuration
SECRETKEY=your_super_secure_jwt_secret_key_here_change_in_production
JWT_EXPIRE=30d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# File Upload Configuration
MAX_FILE_SIZE=10000000
UPLOAD_PATH=./uploads

# CORS Configuration
FRONTEND_URL=http://your-server-ip:3001,http://your-domain.com
```

#### Frontend Configuration
Create `frontend/.env.production`:
```bash
REACT_APP_API_BASE_URL_PROD=http://your-server-ip:5000
REACT_APP_API_BASE_URL_DEV=http://localhost:5000
REACT_APP_MOCK_API=false
```

### 3.4 Build Frontend
```bash
cd frontend
npm run build
cd ..
```

### 3.5 Run Database Migrations
```bash
cd backend
# If using Sequelize CLI
npx sequelize-cli db:migrate

# Or run migrations manually
node migrations/run-all.js
cd ..
```

## 🚀 Step 4: Start Application

### Option 1: Using PM2 (Recommended)

Create `ecosystem.config.js` in the root directory:
```javascript
module.exports = {
  apps: [
    {
      name: 'moh-ims-backend',
      script: './backend/index.js',
      cwd: '/opt/inventory',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/var/log/moh-ims-backend-error.log',
      out_file: '/var/log/moh-ims-backend-out.log',
      log_file: '/var/log/moh-ims-backend.log',
      time: true,
      max_memory_restart: '1G'
    },
    {
      name: 'moh-ims-frontend',
      script: 'serve',
      args: '-s build -l 3001',
      cwd: '/opt/inventory/frontend',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: '/var/log/moh-ims-frontend-error.log',
      out_file: '/var/log/moh-ims-frontend-out.log',
      log_file: '/var/log/moh-ims-frontend.log',
      time: true
    }
  ]
};
```

Install serve globally:
```bash
sudo npm install -g serve
```

Start applications:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Option 2: Using systemd

Create `/etc/systemd/system/moh-ims-backend.service`:
```ini
[Unit]
Description=MoH IMS Backend
After=network.target

[Service]
Type=simple
User=your-user
WorkingDirectory=/opt/inventory/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable moh-ims-backend
sudo systemctl start moh-ims-backend
```

## 🔒 Step 5: Security Configuration

### 5.1 Firewall Setup
```bash
sudo ufw allow 22/tcp
sudo ufw allow 5000/tcp
sudo ufw allow 3001/tcp
sudo ufw enable
```

### 5.2 SSL/HTTPS Setup (Recommended)
Use nginx as reverse proxy with Let's Encrypt SSL:
```bash
sudo apt install nginx certbot python3-certbot-nginx
```

## 📝 Step 6: Verify Deployment

### 6.1 Check Backend
```bash
curl http://localhost:5000/api/system/health
```

### 6.2 Check Frontend
```bash
curl http://localhost:3001
```

### 6.3 Test Database Connection
```bash
cd backend
node -e "require('./config/db').connectDB().then(() => console.log('Connected')).catch(e => console.error(e))"
```

## 🔄 Step 7: Update Deployment

When pulling updates:
```bash
cd /opt/inventory
git pull origin main
cd backend && npm install && cd ..
cd frontend && npm install && npm run build && cd ..
pm2 restart all
```

## 📊 Monitoring

### PM2 Commands
```bash
pm2 status          # Check status
pm2 logs             # View logs
pm2 monit            # Monitor resources
pm2 restart all      # Restart all
pm2 stop all         # Stop all
```

## 🐛 Troubleshooting

### Database Connection Issues
1. Verify PostgreSQL is running: `sudo systemctl status postgresql`
2. Check firewall rules
3. Verify credentials in `backend.env`
4. Test connection: `psql -h 172.27.0.10 -U inventory_user -d inventory_db`

### Application Not Starting
1. Check logs: `pm2 logs` or `journalctl -u moh-ims-backend`
2. Verify environment variables
3. Check port availability: `netstat -tulpn | grep :5000`

### Frontend Build Issues
1. Clear cache: `cd frontend && rm -rf node_modules build && npm install && npm run build`
2. Check Node.js version: `node --version` (should be 18+)

## 📞 Support

For issues or questions, refer to:
- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [API Documentation](docs/api/)

## ✅ Post-Deployment Checklist

- [ ] Database connection successful
- [ ] Backend API responding
- [ ] Frontend accessible
- [ ] User authentication working
- [ ] All modules functional
- [ ] Logs configured
- [ ] Backup strategy in place
- [ ] Monitoring set up
- [ ] SSL certificate installed (if using HTTPS)
- [ ] Firewall configured
- [ ] Default passwords changed

---

**Note**: Remember to change all default passwords and secrets in production!

