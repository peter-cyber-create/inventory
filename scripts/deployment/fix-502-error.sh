#!/bin/bash

# Fix 502 Bad Gateway Error
# This script diagnoses and fixes common issues causing 502 errors

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

# Configuration
BACKEND_PORT="${BACKEND_PORT:-5000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
APP_DIR="${APP_DIR:-/var/www/inventory}"

echo "🔍 Diagnosing 502 Bad Gateway Error..."
echo ""

# Step 1: Check if backend is running with PM2
log "Step 1: Checking PM2 status..."
if command -v pm2 &> /dev/null; then
    pm2_status=$(pm2 list | grep -i "moh-ims-backend" || echo "")
    if [ -z "$pm2_status" ]; then
        error "Backend is NOT running in PM2"
        log "Attempting to start backend..."
        cd "$APP_DIR" || cd "/opt/inventory" || cd "$(pwd)"
        if [ -f "ecosystem.config.js" ]; then
            pm2 start ecosystem.config.js --only moh-ims-backend
            pm2 save
        else
            cd backend
            pm2 start index.js --name moh-ims-backend --env production
            pm2 save
        fi
        sleep 3
    else
        log "Backend is running in PM2 ✅"
        # Check if it's online
        if echo "$pm2_status" | grep -q "online"; then
            log "Backend status: online ✅"
        else
            warning "Backend status: $(echo "$pm2_status" | awk '{print $10}')"
            log "Restarting backend..."
            pm2 restart moh-ims-backend
            sleep 3
        fi
    fi
else
    error "PM2 is not installed"
    exit 1
fi

# Step 2: Check if backend is listening on the correct port
log "Step 2: Checking if backend is listening on port $BACKEND_PORT..."
if netstat -tuln 2>/dev/null | grep -q ":$BACKEND_PORT " || ss -tuln 2>/dev/null | grep -q ":$BACKEND_PORT "; then
    log "Backend is listening on port $BACKEND_PORT ✅"
else
    error "Backend is NOT listening on port $BACKEND_PORT"
    warning "Checking backend logs..."
    pm2 logs moh-ims-backend --lines 20 --nostream
    exit 1
fi

# Step 3: Test backend directly
log "Step 3: Testing backend directly..."
if curl -f http://localhost:$BACKEND_PORT/api/system/health > /dev/null 2>&1; then
    log "Backend health check passed ✅"
else
    error "Backend health check failed"
    warning "Backend might not be fully started. Checking logs..."
    pm2 logs moh-ims-backend --lines 30 --nostream
    warning "Waiting 5 seconds and retrying..."
    sleep 5
    if curl -f http://localhost:$BACKEND_PORT/api/system/health > /dev/null 2>&1; then
        log "Backend health check passed on retry ✅"
    else
        error "Backend is still not responding"
        exit 1
    fi
fi

# Step 4: Check Nginx configuration
log "Step 4: Checking Nginx configuration..."
if command -v nginx &> /dev/null; then
    if [ -f "/etc/nginx/sites-available/inventory" ]; then
        log "Nginx configuration file exists ✅"
        
        # Check if backend proxy_pass is correct
        if grep -q "proxy_pass http://localhost:$BACKEND_PORT" /etc/nginx/sites-available/inventory; then
            log "Nginx proxy_pass configuration is correct ✅"
        else
            error "Nginx proxy_pass configuration is incorrect"
            warning "Updating Nginx configuration..."
            
            # Backup existing config
            sudo cp /etc/nginx/sites-available/inventory /etc/nginx/sites-available/inventory.backup.$(date +%Y%m%d_%H%M%S)
            
            # Update proxy_pass
            sudo sed -i "s|proxy_pass http://localhost:[0-9]*;|proxy_pass http://localhost:$BACKEND_PORT;|g" /etc/nginx/sites-available/inventory
            
            log "Nginx configuration updated ✅"
        fi
        
        # Test Nginx configuration
        if sudo nginx -t; then
            log "Nginx configuration test passed ✅"
            log "Reloading Nginx..."
            sudo systemctl reload nginx
        else
            error "Nginx configuration test failed"
            sudo nginx -t
            exit 1
        fi
    else
        warning "Nginx configuration file not found"
        log "Creating Nginx configuration..."
        
        SERVER_IP="${SERVER_IP:-172.27.0.10}"
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
        
        sudo ln -sf /etc/nginx/sites-available/inventory /etc/nginx/sites-enabled/
        sudo nginx -t && sudo systemctl reload nginx
        log "Nginx configuration created and reloaded ✅"
    fi
else
    warning "Nginx is not installed"
fi

# Step 5: Check Nginx error logs
log "Step 5: Checking Nginx error logs..."
if [ -f "/var/log/nginx/error.log" ]; then
    recent_errors=$(sudo tail -n 20 /var/log/nginx/error.log | grep -i "502\|bad gateway\|upstream" || echo "")
    if [ -n "$recent_errors" ]; then
        warning "Recent Nginx errors found:"
        echo "$recent_errors"
    else
        log "No recent 502 errors in Nginx logs ✅"
    fi
fi

# Step 6: Final test
log "Step 6: Final connectivity test..."
sleep 2

# Test through Nginx
if curl -f http://localhost/api/system/health > /dev/null 2>&1 || curl -f http://172.27.0.10/api/system/health > /dev/null 2>&1; then
    log "✅ SUCCESS: Backend is accessible through Nginx!"
else
    warning "Backend still not accessible through Nginx"
    log "Testing direct backend connection..."
    if curl -f http://localhost:$BACKEND_PORT/api/system/health > /dev/null 2>&1; then
        log "Backend works directly but not through Nginx"
        warning "Nginx might need additional configuration or restart"
        sudo systemctl restart nginx
        sleep 2
    fi
fi

# Summary
echo ""
log "Diagnosis complete! Summary:"
echo ""
pm2 list | grep -E "moh-ims|NAME"
echo ""
log "Backend URL: http://localhost:$BACKEND_PORT/api/system/health"
log "Nginx URL: http://172.27.0.10/api/system/health"
echo ""
log "If issues persist, check:"
echo "  1. pm2 logs moh-ims-backend"
echo "  2. sudo tail -f /var/log/nginx/error.log"
echo "  3. sudo systemctl status nginx"
echo "  4. netstat -tuln | grep $BACKEND_PORT"

