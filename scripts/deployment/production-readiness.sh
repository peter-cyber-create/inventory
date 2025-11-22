#!/bin/bash

# Production Readiness Check and Fix Script
# This script ensures the application is fully ready for production

set -e

APP_DIR="/var/www/inventory"
cd "$APP_DIR" || exit 1

echo "🔍 Checking Production Readiness..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

check_item() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1"
        ERRORS=$((ERRORS + 1))
    fi
}

warn_item() {
    echo -e "${YELLOW}⚠${NC} $1"
    WARNINGS=$((WARNINGS + 1))
}

# 1. Check if backend .env exists
echo "1. Checking Backend Configuration..."
if [ -f "$APP_DIR/config/environments/backend.env" ]; then
    check_item "Backend .env file exists"
    
    # Check critical variables
    source "$APP_DIR/config/environments/backend.env"
    [ -n "$DB_HOST" ] && check_item "DB_HOST is set" || warn_item "DB_HOST is missing"
    [ -n "$DB_NAME" ] && check_item "DB_NAME is set" || warn_item "DB_NAME is missing"
    [ -n "$SECRETKEY" ] && check_item "SECRETKEY is set" || warn_item "SECRETKEY is missing"
    
    if [ "$SECRETKEY" = "your_super_secure_jwt_secret_key_here_change_in_production" ] || [ -z "$SECRETKEY" ]; then
        warn_item "SECRETKEY is still using default value - CHANGE THIS!"
    fi
else
    warn_item "Backend .env file missing - creating from example..."
    cp "$APP_DIR/config/environments/backend.env.example" "$APP_DIR/config/environments/backend.env"
    echo "⚠ Please edit $APP_DIR/config/environments/backend.env with production values"
fi

# 2. Check if frontend .env.production exists
echo ""
echo "2. Checking Frontend Configuration..."
if [ -f "$APP_DIR/frontend/.env.production" ]; then
    check_item "Frontend .env.production exists"
else
    warn_item "Frontend .env.production missing - creating..."
    cat > "$APP_DIR/frontend/.env.production" << 'EOF'
REACT_APP_API_BASE_URL_PROD=http://172.27.0.10/api
REACT_APP_API_BASE_URL_DEV=http://localhost:5000
REACT_APP_MOCK_API=false
REACT_APP_UPLOAD_URL=http://172.27.0.10
GENERATE_SOURCEMAP=false
EOF
    check_item "Created frontend/.env.production"
fi

# 3. Check database connection
echo ""
echo "3. Checking Database Connection..."
if command -v psql &> /dev/null; then
    if PGPASSWORD="${DB_PASS:-toor}" psql -h "${DB_HOST:-localhost}" -U "${DB_USER:-inventory_user}" -d "${DB_NAME:-inventory_db}" -c "SELECT 1;" &> /dev/null; then
        check_item "Database connection successful"
    else
        warn_item "Database connection failed - check credentials"
    fi
else
    warn_item "PostgreSQL client not found - cannot test connection"
fi

# 4. Check if frontend is built
echo ""
echo "4. Checking Frontend Build..."
if [ -d "$APP_DIR/frontend/build" ] && [ -f "$APP_DIR/frontend/build/index.html" ]; then
    check_item "Frontend build exists"
    
    # Check build size
    BUILD_SIZE=$(du -sh "$APP_DIR/frontend/build" | cut -f1)
    echo "   Build size: $BUILD_SIZE"
else
    warn_item "Frontend build missing - run: cd frontend && npm run build"
fi

# 5. Check PM2 processes
echo ""
echo "5. Checking PM2 Processes..."
if command -v pm2 &> /dev/null; then
    BACKEND_RUNNING=$(pm2 list | grep "moh-ims-backend" | grep -c "online" || echo "0")
    FRONTEND_RUNNING=$(pm2 list | grep "moh-ims-frontend" | grep -c "online" || echo "0")
    
    if [ "$BACKEND_RUNNING" -gt 0 ]; then
        check_item "Backend is running"
    else
        warn_item "Backend is not running"
    fi
    
    if [ "$FRONTEND_RUNNING" -gt 0 ]; then
        check_item "Frontend is running"
    else
        warn_item "Frontend is not running"
    fi
else
    warn_item "PM2 not found"
fi

# 6. Check Nginx configuration
echo ""
echo "6. Checking Nginx Configuration..."
if [ -f "/etc/nginx/sites-enabled/inventory" ]; then
    check_item "Nginx configuration exists"
    
    if sudo nginx -t &> /dev/null; then
        check_item "Nginx configuration is valid"
    else
        warn_item "Nginx configuration has errors"
    fi
else
    warn_item "Nginx configuration missing - run: ./scripts/deployment/setup-nginx.sh"
fi

# 7. Check required directories
echo ""
echo "7. Checking Required Directories..."
if [ ! -d "$APP_DIR/backend/uploads" ]; then
    warn_item "Uploads directory missing - creating..."
    mkdir -p "$APP_DIR/backend/uploads" "$APP_DIR/backend/uploads/form5" "$APP_DIR/backend/uploads/grn" "$APP_DIR/backend/uploads/reports"
    chmod -R 755 "$APP_DIR/backend/uploads"
    if [ -d "$APP_DIR/backend/uploads" ]; then
        check_item "Uploads directory created"
    else
        warn_item "Failed to create uploads directory"
    fi
else
    check_item "Uploads directory exists"
fi

if [ ! -d "$APP_DIR/logs" ]; then
    mkdir -p "$APP_DIR/logs"
    chmod 755 "$APP_DIR/logs"
    check_item "Logs directory created"
else
    check_item "Logs directory exists"
fi

# 8. Check file permissions
echo ""
echo "8. Checking File Permissions..."
if [ -w "$APP_DIR" ]; then
    check_item "Application directory is writable"
else
    warn_item "Application directory is not writable"
fi

# 9. Check ports
echo ""
echo "9. Checking Port Availability..."
if command -v ss &> /dev/null; then
    # Use ss (modern replacement for netstat)
    if ss -tuln 2>/dev/null | grep -q ":5000"; then
        check_item "Port 5000 (backend) is in use"
    else
        # Check if PM2 backend is running as alternative check
        if pm2 list 2>/dev/null | grep -q "moh-ims-backend.*online"; then
            check_item "Backend is running (PM2)"
        else
            warn_item "Port 5000 (backend) is not in use"
        fi
    fi
    
    if ss -tuln 2>/dev/null | grep -q ":80"; then
        check_item "Port 80 (Nginx) is in use"
    else
        # Check Nginx service status
        if systemctl is-active --quiet nginx 2>/dev/null; then
            check_item "Nginx service is active"
        else
            warn_item "Port 80 (Nginx) is not in use and service is not active"
        fi
    fi
elif command -v netstat &> /dev/null; then
    if netstat -tuln 2>/dev/null | grep -q ":5000"; then
        check_item "Port 5000 (backend) is in use"
    else
        if pm2 list 2>/dev/null | grep -q "moh-ims-backend.*online"; then
            check_item "Backend is running (PM2)"
        else
            warn_item "Port 5000 (backend) is not in use"
        fi
    fi
    
    if netstat -tuln 2>/dev/null | grep -q ":80"; then
        check_item "Port 80 (Nginx) is in use"
    else
        if systemctl is-active --quiet nginx 2>/dev/null; then
            check_item "Nginx service is active"
        else
            warn_item "Port 80 (Nginx) is not in use and service is not active"
        fi
    fi
else
    # Fallback: check PM2 and systemctl
    if pm2 list 2>/dev/null | grep -q "moh-ims-backend.*online"; then
        check_item "Backend is running (PM2)"
    else
        warn_item "Cannot verify backend port - PM2 backend not running"
    fi
    
    if systemctl is-active --quiet nginx 2>/dev/null; then
        check_item "Nginx service is active"
    else
        warn_item "Cannot verify Nginx port - service not active"
    fi
fi

# Summary
echo ""
echo "=========================================="
echo "Production Readiness Summary"
echo "=========================================="
echo -e "${GREEN}Passed:${NC} $((10 - ERRORS - WARNINGS))"
echo -e "${YELLOW}Warnings:${NC} $WARNINGS"
echo -e "${RED}Errors:${NC} $ERRORS"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Application is production ready!${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Application has warnings but should work${NC}"
    exit 0
else
    echo -e "${RED}❌ Application has critical errors - please fix them${NC}"
    exit 1
fi



