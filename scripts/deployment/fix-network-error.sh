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
BACKEND_STATUS=$(pm2 jlist | grep -o '"name":"moh-ims-backend"[^}]*"status":"[^"]*"' | grep -o '"status":"[^"]*"' | cut -d'"' -f4 || echo "not_found")

if [ "$BACKEND_STATUS" = "online" ]; then
    echo "✅ Backend is running"
    
    # Test backend connectivity
    if curl -s http://localhost:5000/api/users > /dev/null 2>&1; then
        echo "✅ Backend is responding on port 5000"
    else
        echo "⚠️  Backend not responding on port 5000 - checking logs..."
        pm2 logs moh-ims-backend --lines 20 --nostream
    fi
elif [ "$BACKEND_STATUS" = "errored" ] || [ "$BACKEND_STATUS" = "stopped" ]; then
    echo "❌ Backend has crashed - checking logs..."
    echo "=========================================="
    pm2 logs moh-ims-backend --lines 50 --nostream || echo "No logs available"
    echo ""
    
    # Check backend.env has all required variables
    echo "Checking backend environment configuration..."
    if [ -f "$APP_DIR/config/environments/backend.env" ]; then
        # Ensure all required variables exist
        if ! grep -q "^DB_HOST=" "$APP_DIR/config/environments/backend.env"; then
            echo "DB_HOST=localhost" >> "$APP_DIR/config/environments/backend.env"
        fi
        if ! grep -q "^DB_PORT=" "$APP_DIR/config/environments/backend.env"; then
            echo "DB_PORT=5432" >> "$APP_DIR/config/environments/backend.env"
        fi
        if ! grep -q "^DB_NAME=" "$APP_DIR/config/environments/backend.env"; then
            echo "DB_NAME=inventory_db" >> "$APP_DIR/config/environments/backend.env"
        fi
        if ! grep -q "^DB_USER=" "$APP_DIR/config/environments/backend.env"; then
            echo "DB_USER=inventory_user" >> "$APP_DIR/config/environments/backend.env"
        fi
        if ! grep -q "^DB_PASS=" "$APP_DIR/config/environments/backend.env"; then
            echo "DB_PASS=toor" >> "$APP_DIR/config/environments/backend.env"
        fi
        if ! grep -q "^JWT_SECRET=" "$APP_DIR/config/environments/backend.env"; then
            echo "JWT_SECRET=$(openssl rand -base64 32)" >> "$APP_DIR/config/environments/backend.env"
        fi
        if ! grep -q "^PORT=" "$APP_DIR/config/environments/backend.env"; then
            echo "PORT=5000" >> "$APP_DIR/config/environments/backend.env"
        fi
        if ! grep -q "^NODE_ENV=" "$APP_DIR/config/environments/backend.env"; then
            echo "NODE_ENV=production" >> "$APP_DIR/config/environments/backend.env"
        fi
        echo "✅ Backend environment variables checked"
    else
        echo "❌ backend.env not found - creating it..."
        cat > "$APP_DIR/config/environments/backend.env" << 'EOF'
# Ministry of Health Uganda Inventory Management System
PORT=5000
NODE_ENV=production

# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=inventory_user
DB_PASS=toor

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_here_change_in_production
JWT_EXPIRE=30d

# CORS Configuration
FRONTEND_URL=http://172.27.0.10
CORS_ORIGIN=http://172.27.0.10

# File Upload Configuration
MAX_FILE_SIZE=10000000
UPLOAD_PATH=./uploads
EOF
        echo "✅ Created backend.env"
    fi
    
    # Test database connection
    echo ""
    echo "Testing database connection..."
    if command -v psql &> /dev/null; then
        if PGPASSWORD=toor psql -h localhost -U inventory_user -d inventory_db -c "SELECT 1;" > /dev/null 2>&1; then
            echo "✅ Database connection successful"
        else
            echo "⚠️  Database connection failed - ensure PostgreSQL is running"
            echo "   Run: sudo systemctl status postgresql"
        fi
    fi
    
    # Try to restart backend
    echo ""
    echo "Attempting to restart backend..."
    cd "$APP_DIR"
    pm2 delete moh-ims-backend 2>/dev/null || true
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js --only moh-ims-backend
        sleep 3
        pm2 logs moh-ims-backend --lines 20 --nostream
        pm2 save
    else
        echo "❌ ecosystem.config.js not found"
    fi
else
    echo "⚠️  Backend status: $BACKEND_STATUS"
    echo "Checking logs..."
    pm2 logs moh-ims-backend --lines 20 --nostream || true
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

# 5. Fix missing route files
echo ""
echo "5. Checking for missing route files..."
if [ ! -f "$APP_DIR/backend/routes/uploads/index.js" ]; then
    echo "⚠️  Missing route files detected - fixing..."
    if [ -f "$APP_DIR/scripts/deployment/fix-missing-routes.sh" ]; then
        chmod +x "$APP_DIR/scripts/deployment/fix-missing-routes.sh"
        "$APP_DIR/scripts/deployment/fix-missing-routes.sh"
    else
        echo "Creating missing uploads route..."
        mkdir -p "$APP_DIR/backend/routes/uploads"
        # File will be created by git pull or fix script
    fi
else
    echo "✅ Route files exist"
fi

# 6. Rebuild frontend with correct API URL
echo ""
echo "6. Rebuilding frontend with correct API configuration..."
cd "$APP_DIR/frontend"
npm run build
cd "$APP_DIR"
echo "✅ Frontend rebuilt"

# 7. Restart services
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

