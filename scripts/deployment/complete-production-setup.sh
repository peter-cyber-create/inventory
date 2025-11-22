#!/bin/bash

# Complete Production Setup Script
# This script ensures everything is configured end-to-end for production

set -e

APP_DIR="/var/www/inventory"
cd "$APP_DIR" || exit 1

echo "🚀 Complete Production Setup"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. Create required directories
echo "1. Creating required directories..."
mkdir -p "$APP_DIR/backend/uploads/form5"
mkdir -p "$APP_DIR/backend/uploads/grn"
mkdir -p "$APP_DIR/backend/uploads/reports"
mkdir -p "$APP_DIR/logs"
chmod -R 755 "$APP_DIR/backend/uploads"
chmod 755 "$APP_DIR/logs"
echo -e "${GREEN}✓${NC} Directories created"

# 2. Ensure frontend .env.production exists
echo ""
echo "2. Configuring frontend environment..."
if [ ! -f "$APP_DIR/frontend/.env.production" ]; then
    cat > "$APP_DIR/frontend/.env.production" << 'EOF'
REACT_APP_API_BASE_URL_PROD=http://172.27.0.10/api
REACT_APP_API_BASE_URL_DEV=http://localhost:5000
REACT_APP_MOCK_API=false
REACT_APP_UPLOAD_URL=http://172.27.0.10
GENERATE_SOURCEMAP=false
EOF
    echo -e "${GREEN}✓${NC} Created frontend/.env.production"
else
    echo -e "${GREEN}✓${NC} frontend/.env.production exists"
fi

# 3. Ensure backend .env exists
echo ""
echo "3. Configuring backend environment..."
if [ ! -f "$APP_DIR/config/environments/backend.env" ]; then
    if [ -f "$APP_DIR/config/environments/backend.env.example" ]; then
        cp "$APP_DIR/config/environments/backend.env.example" "$APP_DIR/config/environments/backend.env"
        echo -e "${YELLOW}⚠${NC} Created backend.env from example - please update with production values"
    else
        echo -e "${RED}✗${NC} backend.env.example not found"
    fi
else
    echo -e "${GREEN}✓${NC} backend.env exists"
fi

# 4. Rebuild frontend without source maps
echo ""
echo "4. Rebuilding frontend..."
cd "$APP_DIR/frontend"
npm run build
cd "$APP_DIR"
echo -e "${GREEN}✓${NC} Frontend rebuilt"

# 5. Fix ESLint warnings
echo ""
echo "5. Configuring ESLint..."
if [ -f "$APP_DIR/scripts/deployment/fix-all-eslint-warnings.sh" ]; then
    "$APP_DIR/scripts/deployment/fix-all-eslint-warnings.sh" || true
    echo -e "${GREEN}✓${NC} ESLint configured"
else
    echo -e "${YELLOW}⚠${NC} ESLint fix script not found"
fi

# 6. Ensure PM2 is running
echo ""
echo "6. Checking PM2 processes..."
if command -v pm2 &> /dev/null; then
    # Check if processes exist
    if ! pm2 list | grep -q "moh-ims-backend"; then
        echo -e "${YELLOW}⚠${NC} Backend not in PM2 - starting..."
        cd "$APP_DIR"
        if [ -f "ecosystem.config.js" ]; then
            pm2 start ecosystem.config.js
        else
            echo -e "${RED}✗${NC} ecosystem.config.js not found"
        fi
    else
        pm2 restart all
        echo -e "${GREEN}✓${NC} PM2 processes restarted"
    fi
    pm2 save
else
    echo -e "${RED}✗${NC} PM2 not found"
fi

# 7. Ensure Nginx is configured and running
echo ""
echo "7. Checking Nginx..."
if command -v nginx &> /dev/null; then
    if [ ! -f "/etc/nginx/sites-enabled/inventory" ]; then
        echo -e "${YELLOW}⚠${NC} Nginx config missing - running setup script..."
        if [ -f "$APP_DIR/scripts/deployment/setup-nginx.sh" ]; then
            sudo "$APP_DIR/scripts/deployment/setup-nginx.sh"
        fi
    else
        echo -e "${GREEN}✓${NC} Nginx config exists"
    fi
    
    # Test and reload Nginx
    if sudo nginx -t 2>/dev/null; then
        if systemctl is-active --quiet nginx 2>/dev/null; then
            sudo systemctl reload nginx
            echo -e "${GREEN}✓${NC} Nginx reloaded"
        else
            sudo systemctl start nginx
            sudo systemctl enable nginx
            echo -e "${GREEN}✓${NC} Nginx started and enabled"
        fi
    else
        echo -e "${RED}✗${NC} Nginx configuration has errors"
    fi
else
    echo -e "${RED}✗${NC} Nginx not installed"
fi

# 8. Run production readiness check
echo ""
echo "8. Running production readiness check..."
if [ -f "$APP_DIR/scripts/deployment/production-readiness.sh" ]; then
    "$APP_DIR/scripts/deployment/production-readiness.sh" || true
fi

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Production setup complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Verify backend.env has production values (especially SECRETKEY)"
echo "2. Test login at http://172.27.0.10"
echo "3. Check PM2 logs: pm2 logs"
echo "4. Check Nginx logs: sudo tail -f /var/log/nginx/error.log"

