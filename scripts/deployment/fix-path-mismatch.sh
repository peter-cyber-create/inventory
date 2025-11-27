#!/bin/bash

# Fix Path Mismatch - PM2 running from wrong directory
# This script fixes the issue where PM2 is configured for /var/www/inventory
# but the code is in /opt/inventory

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Detect where the code actually is
if [ -d "/opt/inventory" ] && [ -f "/opt/inventory/backend/index.js" ]; then
    ACTUAL_DIR="/opt/inventory"
    log "Found code in: $ACTUAL_DIR"
elif [ -d "/var/www/inventory" ] && [ -f "/var/www/inventory/backend/index.js" ]; then
    ACTUAL_DIR="/var/www/inventory"
    log "Found code in: $ACTUAL_DIR"
else
    error "Cannot find inventory code. Please navigate to the correct directory."
    exit 1
fi

cd "$ACTUAL_DIR"

# Stop PM2 processes
log "Stopping PM2 processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Check if ecosystem.config.js exists and update it
if [ -f "ecosystem.config.js" ]; then
    log "Updating ecosystem.config.js with correct paths..."
    
    # Backup
    cp ecosystem.config.js ecosystem.config.js.backup
    
    # Update paths in ecosystem.config.js
    sed -i "s|/var/www/inventory|$ACTUAL_DIR|g" ecosystem.config.js
    sed -i "s|/opt/inventory|$ACTUAL_DIR|g" ecosystem.config.js
    
    log "ecosystem.config.js updated ✅"
else
    log "Creating ecosystem.config.js..."
    
    BACKEND_PORT="${BACKEND_PORT:-5000}"
    FRONTEND_PORT="${FRONTEND_PORT:-3000}"
    
    cat > ecosystem.config.js <<EOF
module.exports = {
  apps: [
    {
      name: 'moh-ims-backend',
      script: 'index.js',
      cwd: '${ACTUAL_DIR}/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: ${BACKEND_PORT}
      },
      error_file: '${ACTUAL_DIR}/logs/backend-error.log',
      out_file: '${ACTUAL_DIR}/logs/backend-out.log',
      log_file: '${ACTUAL_DIR}/logs/backend.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    },
    {
      name: 'moh-ims-frontend',
      script: 'npx',
      args: 'serve -s build -l ${FRONTEND_PORT} --single',
      cwd: '${ACTUAL_DIR}/frontend',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: ${FRONTEND_PORT}
      },
      error_file: '${ACTUAL_DIR}/logs/frontend-error.log',
      out_file: '${ACTUAL_DIR}/logs/frontend-out.log',
      log_file: '${ACTUAL_DIR}/logs/frontend.log',
      time: true
    }
  ]
};
EOF
    log "ecosystem.config.js created ✅"
fi

# Create logs directory
mkdir -p "$ACTUAL_DIR/logs"
chmod 755 "$ACTUAL_DIR/logs"

# Verify backend file exists
if [ ! -f "$ACTUAL_DIR/backend/index.js" ]; then
    error "Backend index.js not found at $ACTUAL_DIR/backend/index.js"
    exit 1
fi

# Verify uploads route exists
if [ ! -f "$ACTUAL_DIR/backend/routes/uploads/index.js" ]; then
    error "Uploads route not found at $ACTUAL_DIR/backend/routes/uploads/index.js"
    exit 1
fi

log "All required files found ✅"

# Install dependencies if needed
if [ ! -d "$ACTUAL_DIR/backend/node_modules" ]; then
    log "Installing backend dependencies..."
    cd "$ACTUAL_DIR/backend"
    npm install
    cd "$ACTUAL_DIR"
fi

# Start with PM2
log "Starting applications with PM2..."
pm2 start ecosystem.config.js
pm2 save

# Wait a bit for startup
sleep 5

# Check status
log "Checking PM2 status..."
pm2 status

# Test backend
log "Testing backend..."
if curl -f http://localhost:5000/api/system/health > /dev/null 2>&1; then
    log "✅ Backend is running and responding!"
else
    warning "Backend not responding yet. Checking logs..."
    pm2 logs moh-ims-backend --lines 30 --nostream
    warning "If there are errors, please check the logs above"
fi

echo ""
log "Path mismatch fixed! ✅"
log "Backend should now be running from: $ACTUAL_DIR"



