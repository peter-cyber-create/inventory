#!/bin/bash

# Fix network error on login by ensuring proper API and CORS configuration

set -e

APP_DIR="/var/www/inventory"
cd "$APP_DIR" || exit 1

echo "🔧 Fixing Network Error on Login..."
echo ""

# 1. Ensure frontend .env.production has correct API URL
echo "1. Checking frontend API configuration..."
if [ -f "$APP_DIR/frontend/.env.production" ]; then
    if ! grep -q "REACT_APP_API_BASE_URL_PROD=http://172.27.0.10/api" "$APP_DIR/frontend/.env.production"; then
        echo "Updating frontend .env.production..."
        cat > "$APP_DIR/frontend/.env.production" << 'EOF'
REACT_APP_API_BASE_URL_PROD=http://172.27.0.10/api
REACT_APP_API_BASE_URL_DEV=http://localhost:5000
REACT_APP_MOCK_API=false
REACT_APP_UPLOAD_URL=http://172.27.0.10
GENERATE_SOURCEMAP=false
EOF
        echo "✅ Frontend API URL configured"
    else
        echo "✅ Frontend API URL already correct"
    fi
else
    echo "Creating frontend .env.production..."
    cat > "$APP_DIR/frontend/.env.production" << 'EOF'
REACT_APP_API_BASE_URL_PROD=http://172.27.0.10/api
REACT_APP_API_BASE_URL_DEV=http://localhost:5000
REACT_APP_MOCK_API=false
REACT_APP_UPLOAD_URL=http://172.27.0.10
GENERATE_SOURCEMAP=false
EOF
    echo "✅ Created frontend .env.production"
fi

# 2. Ensure backend .env has FRONTEND_URL
echo ""
echo "2. Checking backend CORS configuration..."
if [ -f "$APP_DIR/config/environments/backend.env" ]; then
    if ! grep -q "FRONTEND_URL=http://172.27.0.10" "$APP_DIR/config/environments/backend.env"; then
        echo "Adding FRONTEND_URL to backend.env..."
        echo "" >> "$APP_DIR/config/environments/backend.env"
        echo "# CORS Configuration" >> "$APP_DIR/config/environments/backend.env"
        echo "FRONTEND_URL=http://172.27.0.10" >> "$APP_DIR/config/environments/backend.env"
        echo "CORS_ORIGIN=http://172.27.0.10" >> "$APP_DIR/config/environments/backend.env"
        echo "✅ Added FRONTEND_URL to backend.env"
    else
        echo "✅ Backend CORS already configured"
    fi
else
    echo "⚠️  backend.env not found - please create it"
fi

# 3. Check if backend is running
echo ""
echo "3. Checking backend status..."
if pm2 list | grep -q "moh-ims-backend.*online"; then
    echo "✅ Backend is running"
    
    # Test backend connectivity
    if curl -s http://localhost:5000/api/users > /dev/null 2>&1; then
        echo "✅ Backend is responding on port 5000"
    else
        echo "⚠️  Backend not responding on port 5000 - checking logs..."
        pm2 logs moh-ims-backend --lines 10 --nostream
    fi
else
    echo "❌ Backend is not running - starting..."
    cd "$APP_DIR"
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js --only moh-ims-backend
        pm2 save
    else
        echo "❌ ecosystem.config.js not found"
    fi
fi

# 4. Check Nginx configuration
echo ""
echo "4. Checking Nginx configuration..."
if [ -f "/etc/nginx/sites-enabled/inventory" ]; then
    if sudo nginx -t 2>/dev/null; then
        echo "✅ Nginx configuration is valid"
        
        # Test Nginx proxy
        if curl -s http://localhost/api/users > /dev/null 2>&1; then
            echo "✅ Nginx is proxying /api correctly"
        else
            echo "⚠️  Nginx proxy test failed - reloading..."
            sudo systemctl reload nginx
        fi
    else
        echo "❌ Nginx configuration has errors"
        sudo nginx -t
    fi
else
    echo "⚠️  Nginx config missing - running setup..."
    if [ -f "$APP_DIR/scripts/deployment/setup-nginx.sh" ]; then
        sudo "$APP_DIR/scripts/deployment/setup-nginx.sh"
    fi
fi

# 5. Rebuild frontend with correct API URL
echo ""
echo "5. Rebuilding frontend with correct API configuration..."
cd "$APP_DIR/frontend"
npm run build
cd "$APP_DIR"
echo "✅ Frontend rebuilt"

# 6. Restart services
echo ""
echo "6. Restarting services..."
pm2 restart all
if systemctl is-active --quiet nginx 2>/dev/null; then
    sudo systemctl reload nginx
else
    sudo systemctl start nginx
fi
echo "✅ Services restarted"

echo ""
echo "=========================================="
echo "✅ Network error fix complete!"
echo "=========================================="
echo ""
echo "Test the API:"
echo "  curl http://172.27.0.10/api/users"
echo ""
echo "If still having issues, check:"
echo "  1. Backend logs: pm2 logs moh-ims-backend"
echo "  2. Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "  3. Backend is listening: netstat -tuln | grep 5000"

