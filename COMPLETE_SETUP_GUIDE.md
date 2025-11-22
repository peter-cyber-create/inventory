# 🚀 Complete Setup Guide - From Scratch

This guide will help you set up everything from scratch on `confdb@172.27.0.10`.

## 📋 Prerequisites Check

First, let's check what's already installed:

```bash
# Check Node.js
node --version
npm --version

# Check PostgreSQL
psql --version
sudo systemctl status postgresql

# Check Git
git --version

# Check PM2
pm2 --version

# Check Nginx
nginx -v
```

## Step 1: Install Missing Prerequisites

### 1.1 Install Node.js (if not installed)

```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version  # Should show v20.x.x
npm --version
```

### 1.2 Install PostgreSQL (if not installed)

```bash
# Install PostgreSQL
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify
sudo systemctl status postgresql
```

### 1.3 Install PM2 (if not installed)

```bash
sudo npm install -g pm2 serve

# Verify
pm2 --version
```

### 1.4 Install Nginx (Optional but Recommended)

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify
sudo systemctl status nginx
nginx -v
```

### 1.5 Install Git (if not installed)

```bash
sudo apt install -y git
```

## Step 2: Database Setup

```bash
# Create database and user (if not already done)
sudo -u postgres psql << EOF
CREATE DATABASE inventory_db;
CREATE USER inventory_user WITH PASSWORD 'toor';
GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;
ALTER USER inventory_user CREATEDB;
\q
EOF

# Verify database
sudo -u postgres psql -c "\l" | grep inventory_db
sudo -u postgres psql -c "\du" | grep inventory_user
```

## Step 3: Clone and Setup Application

### 3.1 Clone Repository

```bash
# Create application directory
sudo mkdir -p /opt/inventory
sudo chown -R $USER:$USER /opt/inventory

# Clone repository
cd /opt
git clone <your-repository-url> inventory
# OR if you have the code locally, copy it:
# scp -r /path/to/inventory confdb@172.27.0.10:/opt/

cd /opt/inventory
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

**Backend Configuration:**

```bash
# Create backend.env
cat > config/environments/backend.env << 'EOF'
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration (same server - use localhost)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=inventory_user
DB_PASS=toor

# JWT Configuration
SECRETKEY=your_super_secure_jwt_secret_key_change_this
JWT_EXPIRE=30d

# CORS Configuration
FRONTEND_URL=http://172.27.0.10:3001,http://localhost:3001

# File Upload Configuration
MAX_FILE_SIZE=10000000
UPLOAD_PATH=./uploads
EOF
```

**Frontend Configuration:**

```bash
# Create frontend .env.production
cat > frontend/.env.production << 'EOF'
REACT_APP_API_BASE_URL_PROD=http://172.27.0.10:5000
REACT_APP_API_BASE_URL_DEV=http://localhost:5000
REACT_APP_MOCK_API=false
EOF
```

### 3.4 Build Frontend

```bash
cd frontend
npm run build
cd ..

# Verify build
ls -la frontend/build/
```

### 3.5 Create Uploads Directory

```bash
mkdir -p backend/uploads
chmod 755 backend/uploads
```

## Step 4: Start Application

### 4.1 Create PM2 Ecosystem File

```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'moh-ims-backend',
      script: './backend/index.js',
      cwd: '/opt/inventory',
      instances: 1,
      exec_mode: 'fork',
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
EOF
```

### 4.2 Start with PM2

```bash
# Start applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions it prints (usually run a sudo command)

# Check status
pm2 status
pm2 logs
```

### 4.3 Verify Application is Running

```bash
# Check if ports are listening
sudo netstat -tulpn | grep -E ':(5000|3001)'

# Test backend
curl http://localhost:5000/api/system/health

# Test frontend
curl http://localhost:3001
```

## Step 5: Configure Firewall

```bash
# Check firewall status
sudo ufw status

# Allow necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 5000/tcp  # Backend API
sudo ufw allow 3001/tcp  # Frontend
sudo ufw allow 80/tcp    # HTTP (for Nginx)
sudo ufw allow 443/tcp   # HTTPS (for Nginx)

# Enable firewall (if not already enabled)
sudo ufw enable

# Verify
sudo ufw status
```

## Step 6: Configure Nginx (Optional but Recommended)

### 6.1 Create Nginx Configuration

```bash
sudo cat > /etc/nginx/sites-available/inventory << 'EOF'
# Backend API
server {
    listen 80;
    server_name 172.27.0.10;

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
```

### 6.2 Enable Nginx Site

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/inventory /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 6.3 Verify Nginx

```bash
# Check Nginx status
sudo systemctl status nginx

# Test from browser
# http://172.27.0.10
```

## Step 7: Run Database Migrations

```bash
cd /opt/inventory/backend

# If using Sequelize CLI
npx sequelize-cli db:migrate

# Or run migrations manually if you have migration scripts
# Check backend/migrations/ directory
```

## Step 8: Final Verification

```bash
# 1. Check PM2 status
pm2 status

# 2. Check services
sudo systemctl status postgresql
sudo systemctl status nginx

# 3. Test endpoints
curl http://localhost:5000/api/system/health
curl http://localhost:3001
curl http://172.27.0.10/api/system/health

# 4. Check logs
pm2 logs --lines 20
```

## Step 9: Access Application

### Without Nginx:
- **Frontend**: http://172.27.0.10:3001
- **Backend API**: http://172.27.0.10:5000/api/system/health

### With Nginx:
- **Frontend**: http://172.27.0.10
- **Backend API**: http://172.27.0.10/api/system/health

## Troubleshooting

### Application not starting:
```bash
# Check logs
pm2 logs moh-ims-backend
pm2 logs moh-ims-frontend

# Check environment
cat config/environments/backend.env

# Test database connection
psql -U inventory_user -d inventory_db -h localhost
```

### Ports not accessible:
```bash
# Check firewall
sudo ufw status

# Check if ports are listening
sudo netstat -tulpn | grep -E ':(5000|3001)'

# Check application is running
pm2 list
```

### Nginx not working:
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Quick Commands Reference

```bash
# Start application
pm2 start ecosystem.config.js

# Stop application
pm2 stop all

# Restart application
pm2 restart all

# View logs
pm2 logs

# Check status
pm2 status

# Restart Nginx
sudo systemctl restart nginx

# Restart PostgreSQL
sudo systemctl restart postgresql
```

## Security Notes

⚠️ **Important**: After setup, change:
1. Database password from `toor` to a secure password
2. JWT_SECRET in backend.env
3. Default admin user password

---

**You're all set!** The application should now be accessible at http://172.27.0.10:3001 (or http://172.27.0.10 if using Nginx).

