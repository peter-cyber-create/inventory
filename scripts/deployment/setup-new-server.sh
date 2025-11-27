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
APP_DIR="${APP_DIR:-/var/www/inventory}"
SERVER_IP="${SERVER_IP:-172.27.0.10}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
BACKEND_PORT="${BACKEND_PORT:-5000}"

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
    if [ -z "$DB_PASS" ]; then
        read -sp "Enter password for existing database user $DB_USER: " DB_PASS
        echo
    fi
else
    log "Creating database user $DB_USER..."
    read -sp "Enter password for database user $DB_USER: " DB_PASS
    echo
    if [ -z "$DB_PASS" ]; then
        error "Database password cannot be empty"
    fi
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
    sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"
fi

# Always grant privileges (in case they were revoked or user was just created)
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" || warning "Failed to grant privileges (may already be granted)"
log "Database setup completed ✅"

# Step 6: Create application directory
log "Setting up application directory..."
sudo mkdir -p "$APP_DIR"
sudo chown -R $USER:$USER "$APP_DIR"
# Also create www-data group access if needed for web server
sudo chmod 755 "$APP_DIR"

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
    if [ -z "$FRONTEND_URL" ]; then
        read -p "Enter frontend URL (e.g., http://$SERVER_IP:$FRONTEND_PORT) [default: http://$SERVER_IP:$FRONTEND_PORT]: " FRONTEND_URL_INPUT
        FRONTEND_URL="${FRONTEND_URL_INPUT:-http://$SERVER_IP:$FRONTEND_PORT}"
    fi
    if [ -z "$BACKEND_URL" ]; then
        read -p "Enter backend API URL (e.g., http://$SERVER_IP:$BACKEND_PORT) [default: http://$SERVER_IP:$BACKEND_PORT]: " BACKEND_URL_INPUT
        BACKEND_URL="${BACKEND_URL_INPUT:-http://$SERVER_IP:$BACKEND_PORT}"
    fi
    
    cat > frontend/.env.production << EOF
REACT_APP_API_BASE_URL_PROD=$BACKEND_URL
REACT_APP_API_BASE_URL_DEV=http://localhost:$BACKEND_PORT
REACT_APP_MOCK_API=false
EOF
    log "Frontend .env.production created ✅"
else
    warning "frontend/.env.production already exists, skipping..."
fi

# Step 10: Build frontend
log "Building frontend for production..."
cd frontend
if npm run build; then
    log "Frontend build completed ✅"
else
    error "Frontend build failed. Please check the errors above."
fi
cd ..

# Step 11: Test database connection
log "Testing database connection..."
cd backend
# Check if babel-node is needed
if command -v npx &> /dev/null; then
    NODE_CMD="npx babel-node"
else
    NODE_CMD="node"
    warning "babel-node not found via npx, using node directly (may fail if ES6 syntax is used)"
fi

if $NODE_CMD -e "require('dotenv').config({path: '../config/environments/backend.env'}); require('./config/db').connectDB().then(() => {console.log('✅ Database connection successful'); process.exit(0)}).catch(e => {console.error('❌ Database connection failed:', e.message); process.exit(1)})" 2>/dev/null; then
    log "Database connection test passed ✅"
else
    warning "Database connection test failed. This may be due to missing dependencies or configuration issues."
    warning "Please verify your database configuration in config/environments/backend.env"
    warning "You can test the connection manually after installation completes."
fi
cd ..

# Step 12: Run migrations
log "Running database migrations..."
cd backend
if command -v npx &> /dev/null; then
    # Try to run migrations with proper environment
    export NODE_ENV=production
    if [ -f "../config/environments/backend.env" ]; then
        export $(grep -v '^#' ../config/environments/backend.env | xargs)
    fi
    if npx sequelize-cli db:migrate 2>/dev/null; then
        log "Migrations completed ✅"
    else
        warning "Sequelize migrations failed. Attempting alternative method..."
        # Try running migrations directly with node
        if [ -f "migrations/run-all.js" ]; then
            if node migrations/run-all.js 2>/dev/null; then
                log "Migrations completed using alternative method ✅"
            else
                warning "Alternative migration method also failed. Please run migrations manually."
            fi
        else
            warning "Sequelize CLI not found and no alternative migration script. Please run migrations manually."
        fi
    fi
else
    warning "npx not found. Please run migrations manually: cd backend && npx sequelize-cli db:migrate"
fi
cd ..

# Step 13: Setup PM2 ecosystem
log "Setting up PM2 configuration..."
# Ensure we're in the app directory
cd "$APP_DIR"

if [ ! -f "ecosystem.config.js" ]; then
    log "Creating PM2 ecosystem configuration..."
    # Create a wrapper script for backend to handle babel-node
    cat > backend/pm2-start.sh <<'PM2WRAPPER'
#!/bin/bash
cd "$(dirname "$0")"
exec npx babel-node index.js
PM2WRAPPER
    chmod +x backend/pm2-start.sh
    
    cat > ecosystem.config.js <<EOF
const path = require('path');

const resolvePath = (targetPath) => path.resolve(targetPath);
const APP_DIR = resolvePath(process.env.APP_DIR || '${APP_DIR}');
const LOGS_DIR = resolvePath(process.env.LOG_DIR || path.join(APP_DIR, 'logs'));
const BACKEND_PORT = process.env.BACKEND_PORT || process.env.PORT || ${BACKEND_PORT};
const FRONTEND_PORT = process.env.FRONTEND_PORT || ${FRONTEND_PORT};
const NODE_ENV = process.env.NODE_ENV || 'production';
const SERVE_ARGS = ['serve', '-s', 'build', '-l', FRONTEND_PORT, '--single'].join(' ');

module.exports = {
  apps: [
    {
      name: 'moh-ims-backend',
      script: path.join(APP_DIR, 'backend', 'pm2-start.sh'),
      cwd: path.join(APP_DIR, 'backend'),
      instances: process.env.BACKEND_INSTANCES || 1,
      exec_mode: process.env.BACKEND_EXEC_MODE || 'fork',
      env: {
        NODE_ENV,
        PORT: BACKEND_PORT
      },
      error_file: path.join(LOGS_DIR, 'backend-error.log'),
      out_file: path.join(LOGS_DIR, 'backend-out.log'),
      log_file: path.join(LOGS_DIR, 'backend.log'),
      time: true,
      max_memory_restart: process.env.BACKEND_MAX_MEMORY || '1G',
      restart_delay: parseInt(process.env.BACKEND_RESTART_DELAY || '4000', 10),
      max_restarts: parseInt(process.env.BACKEND_MAX_RESTARTS || '10', 10),
      min_uptime: process.env.BACKEND_MIN_UPTIME || '10s'
    },
    {
      name: 'moh-ims-frontend',
      script: 'npx',
      args: SERVE_ARGS,
      cwd: path.join(APP_DIR, 'frontend'),
      instances: parseInt(process.env.FRONTEND_INSTANCES || '1', 10),
      env: {
        NODE_ENV,
        PORT: FRONTEND_PORT
      },
      error_file: path.join(LOGS_DIR, 'frontend-error.log'),
      out_file: path.join(LOGS_DIR, 'frontend-out.log'),
      log_file: path.join(LOGS_DIR, 'frontend.log'),
      time: true,
      restart_delay: parseInt(process.env.FRONTEND_RESTART_DELAY || '4000', 10),
      max_restarts: parseInt(process.env.FRONTEND_MAX_RESTARTS || '10', 10),
      min_uptime: process.env.FRONTEND_MIN_UPTIME || '10s'
    }
  ]
};
EOF
    log "PM2 ecosystem file created ✅"
    log "Backend wrapper script created for babel-node support ✅"
else
    log "PM2 ecosystem file already exists, using existing configuration ✅"
    # Still create wrapper script if it doesn't exist (needed for babel-node support)
    if [ ! -f "backend/pm2-start.sh" ]; then
        log "Creating backend wrapper script for babel-node support..."
        cat > backend/pm2-start.sh <<'PM2WRAPPER'
#!/bin/bash
cd "$(dirname "$0")"
exec npx babel-node index.js
PM2WRAPPER
        chmod +x backend/pm2-start.sh
        log "Backend wrapper script created ✅"
    fi
fi

# Step 14: Create logs directory
log "Creating logs directory..."
mkdir -p "$APP_DIR/logs"
chmod 755 "$APP_DIR/logs"

# Step 15: Stop existing PM2 processes (if any)
log "Checking for existing PM2 processes..."
if pm2 list | grep -q "moh-ims-backend\|moh-ims-frontend"; then
    warning "Existing PM2 processes found. Stopping them..."
    pm2 stop moh-ims-backend moh-ims-frontend 2>/dev/null || true
    pm2 delete moh-ims-backend moh-ims-frontend 2>/dev/null || true
fi

# Step 16: Start application
log "Starting application with PM2..."
cd "$APP_DIR"
pm2 start ecosystem.config.js
pm2 save

# Setup PM2 to start on boot
log "Setting up PM2 to start on boot..."
pm2 startup systemd -u $USER --hp /home/$USER 2>/dev/null || warning "PM2 startup command may need to be run manually. Check output above."

# Step 17: Setup Nginx (optional)
log "Setting up Nginx reverse proxy..."
if command -v nginx &> /dev/null; then
    if [ ! -f "/etc/nginx/sites-available/inventory" ]; then
        log "Creating Nginx configuration..."
        sudo tee /etc/nginx/sites-available/inventory > /dev/null <<EOF
# Backend API
server {
    listen 80;
    server_name ${SERVER_IP};

    # Backend API
    location /api {
        proxy_pass http://localhost:${BACKEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        proxy_send_timeout 300s;
    }

    # Frontend
    location / {
        proxy_pass http://localhost:${FRONTEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
        
        # Enable site
        sudo ln -sf /etc/nginx/sites-available/inventory /etc/nginx/sites-enabled/
        log "Nginx configuration file created ✅"
        
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

# Step 18: Setup firewall
# SKIPPED - Firewall settings are already configured and should not be modified
# Do not touch firewall configuration - existing settings are correct
log "Skipping firewall configuration (existing settings preserved)"

# Step 19: Health check
log "Performing health check..."
sleep 5

if curl -f http://localhost:$BACKEND_PORT/api/system/health > /dev/null 2>&1; then
    log "Backend health check passed ✅"
else
    warning "Backend health check failed. Check logs: pm2 logs moh-ims-backend"
fi

if curl -f http://localhost:$FRONTEND_PORT > /dev/null 2>&1; then
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
echo "  Frontend: http://localhost:$FRONTEND_PORT (or http://$SERVER_IP:$FRONTEND_PORT)"
echo "  Backend API: http://localhost:$BACKEND_PORT (or http://$SERVER_IP:$BACKEND_PORT)"
echo ""
warning "⚠️  Remember to:"
echo "  1. Change default passwords"
echo "  2. Update JWT_SECRET in backend.env"
echo "  3. Configure SSL/HTTPS for production"
echo "  4. Set up regular backups"

