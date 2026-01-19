#!/bin/bash

# Production Deployment Script for MoH Uganda IMS
# This script deploys the application to a production server

set -e  # Exit on any error

echo "🚀 Starting Production Deployment for MoH Uganda IMS..."

# Configuration
APP_NAME="moh-uganda-ims"
APP_DIR="/opt/$APP_NAME"
BACKUP_DIR="/opt/backups/$APP_NAME"
LOG_FILE="/var/log/$APP_NAME-deployment.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root for security reasons"
fi

# Check prerequisites
log "Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    error "Node.js is not installed. Please install Node.js 18+ first."
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    error "npm is not installed. Please install npm first."
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    error "PostgreSQL is not installed. Please install PostgreSQL first."
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    log "Installing PM2..."
    npm install -g pm2
fi

log "Prerequisites check completed ✅"

# Create application directory
log "Setting up application directory..."
sudo mkdir -p "$APP_DIR"
sudo mkdir -p "$BACKUP_DIR"
sudo mkdir -p "/var/log"
sudo chown -R $USER:$USER "$APP_DIR"
sudo chown -R $USER:$USER "$BACKUP_DIR"

# Backup existing deployment if it exists
if [ -d "$APP_DIR" ] && [ "$(ls -A $APP_DIR)" ]; then
    log "Creating backup of existing deployment..."
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
    cp -r "$APP_DIR" "$BACKUP_DIR/$BACKUP_NAME"
    log "Backup created: $BACKUP_DIR/$BACKUP_NAME"
fi

# Clone or update repository
log "Cloning/updating repository..."
if [ -d "$APP_DIR/.git" ]; then
    cd "$APP_DIR"
    git pull origin main
else
    git clone https://github.com/your-repo/inventory.git "$APP_DIR"
    cd "$APP_DIR"
fi

# Install dependencies
log "Installing dependencies..."

# Backend dependencies
cd "$APP_DIR/backend"
npm ci --production

# Frontend dependencies
cd "$APP_DIR/frontend"
npm ci --production

# Build frontend
log "Building frontend for production..."
npm run build

# Set up environment variables
log "Setting up environment variables..."
if [ ! -f "$APP_DIR/production.env" ]; then
    error "production.env file not found. Please create it first."
fi

cp "$APP_DIR/production.env" "$APP_DIR/backend/.env"

# Set up database
log "Setting up database..."
cd "$APP_DIR/backend"

# Check if database exists
if ! psql -U inventory_user -d inventory_db -c '\q' 2>/dev/null; then
    log "Creating database..."
    sudo -u postgres createdb inventory_db
    sudo -u postgres createuser inventory_user
    
    # Security: Prompt for database password instead of using default
    if [ -z "$DB_PASSWORD" ]; then
        warning "Database password not set in environment. Prompting for secure password..."
        read -sp "Enter secure password for database user 'inventory_user': " DB_PASSWORD
        echo ""
        if [ -z "$DB_PASSWORD" ]; then
            error "Database password is required. Set DB_PASSWORD environment variable or enter it when prompted."
        fi
    fi
    
    sudo -u postgres psql -c "ALTER USER inventory_user WITH PASSWORD '$DB_PASSWORD';"
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;"
    log "Database created with secure password ✅"
else
    log "Database already exists, skipping creation"
fi

# Run database migrations
log "Running database migrations..."
npm run migrate

# Set up PM2 ecosystem file
log "Setting up PM2 configuration..."
cat > "$APP_DIR/ecosystem.config.js" << EOF
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
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024'
    },
    {
      name: 'moh-ims-frontend',
      script: 'serve',
      args: '-s build -l 3000',
      cwd: '$APP_DIR/frontend',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/moh-ims-frontend-error.log',
      out_file: '/var/log/moh-ims-frontend-out.log',
      log_file: '/var/log/moh-ims-frontend.log',
      time: true
    }
  ]
};
EOF

# Install serve globally for frontend
npm install -g serve

# Stop existing PM2 processes
log "Stopping existing processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Start application with PM2
log "Starting application..."
cd "$APP_DIR"
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup

# Set up log rotation
log "Setting up log rotation..."
sudo tee /etc/logrotate.d/moh-ims > /dev/null << EOF
/var/log/moh-ims*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Set up firewall rules
log "Setting up firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 3000/tcp
    sudo ufw allow 5000/tcp
    sudo ufw allow 22/tcp
fi

# Health check
log "Performing health check..."
sleep 10

# Check if backend is running
if curl -f http://localhost:5000/api/system/health > /dev/null 2>&1; then
    log "Backend health check passed ✅"
else
    error "Backend health check failed ❌"
fi

# Check if frontend is running
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log "Frontend health check passed ✅"
else
    error "Frontend health check failed ❌"
fi

# Display status
log "Deployment completed successfully! 🎉"
log "Application Status:"
pm2 status

log "Access URLs:"
log "Frontend: http://localhost:3000"
log "Backend API: http://localhost:5000"
log "Health Check: http://localhost:5000/api/system/health"

log "Useful commands:"
log "  pm2 status          - Check application status"
log "  pm2 logs            - View logs"
log "  pm2 restart all     - Restart all applications"
log "  pm2 stop all        - Stop all applications"

log "Deployment completed at $(date)"