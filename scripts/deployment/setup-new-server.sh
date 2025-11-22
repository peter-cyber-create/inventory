#!/bin/bash

# Setup Script for New Server Deployment
# This script automates the setup process for deploying to a new server

set -e

echo "🚀 Starting New Server Setup for MoH Uganda IMS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
# Note: Single-server deployment (database and application on same server)
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-inventory_db}"
DB_USER="${DB_USER:-inventory_user}"
APP_DIR="${APP_DIR:-/opt/inventory}"

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root for security reasons"
fi

# Step 1: Check prerequisites
log "Checking prerequisites..."

if ! command -v node &> /dev/null; then
    warning "Node.js not found. Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    log "Node.js installed. Version: $(node --version)"
fi

if ! command -v npm &> /dev/null; then
    error "npm is not installed"
fi

if ! command -v git &> /dev/null; then
    error "Git is not installed. Please install: sudo apt install git"
fi

log "Prerequisites check completed ✅"

# Step 2: Install Nginx (optional but recommended)
if ! command -v nginx &> /dev/null; then
    log "Nginx not found. Installing..."
    sudo apt update
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    log "Nginx installed and started ✅"
else
    log "Nginx already installed ✅"
fi

# Step 3: Install PostgreSQL (if not installed)
log "Checking PostgreSQL installation..."
if ! command -v psql &> /dev/null; then
    log "PostgreSQL not found. Installing..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    log "PostgreSQL installed and started ✅"
else
    log "PostgreSQL already installed ✅"
fi

# Verify PostgreSQL is running
if sudo systemctl is-active --quiet postgresql; then
    log "PostgreSQL service is running ✅"
else
    warning "PostgreSQL service is not running. Starting..."
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

# Step 4: Install PM2
if ! command -v pm2 &> /dev/null; then
    log "Installing PM2..."
    sudo npm install -g pm2 serve
fi

# Step 5: Setup database
log "Setting up database..."
if sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    warning "Database $DB_NAME already exists, skipping creation..."
else
    log "Creating database $DB_NAME..."
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
fi

if sudo -u postgres psql -c '\du' | grep -qw "$DB_USER"; then
    warning "User $DB_USER already exists, skipping creation..."
else
    log "Creating database user $DB_USER..."
    read -sp "Enter password for database user $DB_USER: " DB_PASS
    echo
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
    sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"
fi

sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
log "Database setup completed ✅"

# Step 6: Create application directory
log "Setting up application directory..."
sudo mkdir -p "$APP_DIR"
sudo chown -R $USER:$USER "$APP_DIR"

# Step 7: Clone repository (if not already cloned)
if [ ! -d "$APP_DIR/.git" ]; then
    read -p "Enter repository URL: " REPO_URL
    if [ -z "$REPO_URL" ]; then
        error "Repository URL is required"
    fi
    log "Cloning repository..."
    git clone "$REPO_URL" "$APP_DIR"
else
    log "Repository already exists, skipping clone..."
fi

cd "$APP_DIR"

# Step 8: Install dependencies
log "Installing dependencies..."

log "Installing root dependencies..."
npm install

log "Installing backend dependencies..."
cd backend
npm install
cd ..

log "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Step 9: Setup environment variables
log "Setting up environment variables..."

if [ ! -f "config/environments/backend.env" ]; then
    log "Creating backend.env from example..."
    cp config/environments/backend.env.example config/environments/backend.env
    
    # Get database password (already set during database setup, but prompt if needed)
    if [ -z "$DB_PASS" ]; then
        read -sp "Enter database password for $DB_USER: " DB_PASS
        echo
    fi
    
    # Update backend.env with database host
    sed -i "s|DB_HOST=.*|DB_HOST=$DB_HOST|g" config/environments/backend.env
    sed -i "s|DB_PORT=.*|DB_PORT=$DB_PORT|g" config/environments/backend.env
    sed -i "s|DB_NAME=.*|DB_NAME=$DB_NAME|g" config/environments/backend.env
    sed -i "s|DB_USER=.*|DB_USER=$DB_USER|g" config/environments/backend.env
    sed -i "s|DB_PASS=.*|DB_PASS=$DB_PASS|g" config/environments/backend.env
    sed -i "s|NODE_ENV=.*|NODE_ENV=production|g" config/environments/backend.env
    
    warning "Please update JWT_SECRET and other sensitive values in config/environments/backend.env"
else
    warning "backend.env already exists, skipping..."
fi

if [ ! -f "frontend/.env.production" ]; then
    log "Creating frontend .env.production..."
    read -p "Enter frontend URL (e.g., http://your-server-ip:3001): " FRONTEND_URL
    read -p "Enter backend API URL (e.g., http://your-server-ip:5000): " BACKEND_URL
    
    cat > frontend/.env.production << EOF
REACT_APP_API_BASE_URL_PROD=$BACKEND_URL
REACT_APP_API_BASE_URL_DEV=http://localhost:5000
REACT_APP_MOCK_API=false
EOF
else
    warning "frontend/.env.production already exists, skipping..."
fi

# Step 10: Build frontend
log "Building frontend for production..."
cd frontend
npm run build
cd ..

# Step 11: Test database connection
log "Testing database connection..."
cd backend
if node -e "require('dotenv').config({path: '../config/environments/backend.env'}); require('./config/db').connectDB().then(() => {console.log('✅ Database connection successful'); process.exit(0)}).catch(e => {console.error('❌ Database connection failed:', e.message); process.exit(1)})"; then
    log "Database connection test passed ✅"
else
    error "Database connection test failed. Please check your database configuration."
fi
cd ..

# Step 12: Run migrations
log "Running database migrations..."
cd backend
if command -v npx &> /dev/null && npx sequelize-cli db:migrate 2>/dev/null; then
    log "Migrations completed ✅"
else
    warning "Sequelize CLI not found or migrations failed. Please run migrations manually."
fi
cd ..

# Step 13: Setup PM2 ecosystem
log "Setting up PM2 configuration..."
if [ ! -f "ecosystem.config.js" ]; then
    cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'moh-ims-backend',
      script: './backend/index.js',
      cwd: '$APP_DIR',
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
      cwd: '$APP_DIR/frontend',
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
    log "PM2 ecosystem file created ✅"
fi

# Step 14: Create logs directory
log "Creating logs directory..."
sudo mkdir -p /var/log
sudo touch /var/log/moh-ims-backend.log
sudo touch /var/log/moh-ims-frontend.log
sudo chown -R $USER:$USER /var/log/moh-ims*.log

# Step 15: Start application
log "Starting application with PM2..."
pm2 start ecosystem.config.js
pm2 save

# Step 16: Setup Nginx (optional)
log "Setting up Nginx reverse proxy..."
if command -v nginx &> /dev/null; then
    if [ ! -f "/etc/nginx/sites-available/inventory" ]; then
        sudo cat > /etc/nginx/sites-available/inventory << 'NGINX_EOF'
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
NGINX_EOF
        
        # Enable site
        sudo ln -sf /etc/nginx/sites-available/inventory /etc/nginx/sites-enabled/
        
        # Test and reload Nginx
        if sudo nginx -t; then
            sudo systemctl reload nginx
            log "Nginx configured successfully ✅"
        else
            warning "Nginx configuration test failed. Please check manually."
        fi
    else
        log "Nginx configuration already exists ✅"
    fi
else
    warning "Nginx not installed. Skipping reverse proxy setup."
fi

# Step 17: Setup firewall
# Skipped - firewall configuration should be done manually by system administrator
log "Skipping firewall configuration (manual setup required)"

# Step 18: Health check
log "Performing health check..."
sleep 5

if curl -f http://localhost:5000/api/system/health > /dev/null 2>&1; then
    log "Backend health check passed ✅"
else
    warning "Backend health check failed. Check logs: pm2 logs moh-ims-backend"
fi

if curl -f http://localhost:3001 > /dev/null 2>&1; then
    log "Frontend health check passed ✅"
else
    warning "Frontend health check failed. Check logs: pm2 logs moh-ims-frontend"
fi

# Summary
echo ""
log "Setup completed! 🎉"
echo ""
echo "Application Status:"
pm2 status
echo ""
echo "Useful commands:"
echo "  pm2 status          - Check application status"
echo "  pm2 logs            - View logs"
echo "  pm2 restart all     - Restart all applications"
echo "  pm2 stop all        - Stop all applications"
echo ""
echo "Access URLs:"
echo "  Frontend: http://localhost:3001"
echo "  Backend API: http://localhost:5000"
echo ""
warning "⚠️  Remember to:"
echo "  1. Change default passwords"
echo "  2. Update JWT_SECRET in backend.env"
echo "  3. Configure SSL/HTTPS for production"
echo "  4. Set up regular backups"

