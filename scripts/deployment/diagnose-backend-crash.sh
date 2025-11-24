#!/bin/bash

# Diagnose and fix backend crash issues

set -e

APP_DIR="/var/www/inventory"
cd "$APP_DIR" || exit 1

echo "🔍 Diagnosing Backend Crash..."
echo ""

# 1. Check backend logs
echo "1. Checking backend logs (last 50 lines)..."
echo "=========================================="
pm2 logs moh-ims-backend --lines 50 --nostream || echo "No logs available"
echo ""

# 2. Check if backend.env exists and has required variables
echo "2. Checking backend environment configuration..."
echo "=========================================="
if [ -f "$APP_DIR/config/environments/backend.env" ]; then
    echo "✅ backend.env exists"
    echo ""
    echo "Current configuration:"
    cat "$APP_DIR/config/environments/backend.env"
    echo ""
    
    # Check for required variables
    required_vars=("DB_HOST" "DB_PORT" "DB_NAME" "DB_USER" "DB_PASS" "JWT_SECRET" "PORT")
    missing_vars=()
    
    for var in "${required_vars[@]}"; do
        if ! grep -q "^${var}=" "$APP_DIR/config/environments/backend.env"; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        echo "⚠️  Missing required variables: ${missing_vars[*]}"
    else
        echo "✅ All required variables present"
    fi
else
    echo "❌ backend.env does not exist - creating it..."
    cat > "$APP_DIR/config/environments/backend.env" << 'EOF'
# Ministry of Health Uganda Inventory Management System
# Environment Configuration

# Server Configuration
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

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# File Upload Configuration
MAX_FILE_SIZE=10000000
UPLOAD_PATH=./uploads

# CORS Configuration
FRONTEND_URL=http://172.27.0.10
CORS_ORIGIN=http://172.27.0.10
EOF
    echo "✅ Created backend.env"
fi

# 3. Test database connection
echo ""
echo "3. Testing database connection..."
echo "=========================================="
if command -v psql &> /dev/null; then
    if PGPASSWORD=toor psql -h localhost -U inventory_user -d inventory_db -c "SELECT 1;" > /dev/null 2>&1; then
        echo "✅ Database connection successful"
    else
        echo "❌ Database connection failed"
        echo "Testing with: psql -h localhost -U inventory_user -d inventory_db"
        PGPASSWORD=toor psql -h localhost -U inventory_user -d inventory_db -c "SELECT 1;" || true
    fi
else
    echo "⚠️  psql not found - cannot test database connection"
fi

# 4. Check if backend process is running
echo ""
echo "4. Checking backend process status..."
echo "=========================================="
pm2 list | grep moh-ims-backend || echo "Backend not in PM2 list"

# 5. Check backend directory structure
echo ""
echo "5. Checking backend files..."
echo "=========================================="
if [ -f "$APP_DIR/backend/index.js" ]; then
    echo "✅ backend/index.js exists"
else
    echo "❌ backend/index.js not found"
fi

if [ -f "$APP_DIR/backend/config/db.js" ]; then
    echo "✅ backend/config/db.js exists"
else
    echo "❌ backend/config/db.js not found"
fi

# 6. Check node_modules
echo ""
echo "6. Checking backend dependencies..."
echo "=========================================="
if [ -d "$APP_DIR/backend/node_modules" ]; then
    echo "✅ node_modules exists"
    if [ -f "$APP_DIR/backend/node_modules/.bin/node" ] || [ -d "$APP_DIR/backend/node_modules/express" ]; then
        echo "✅ Dependencies appear installed"
    else
        echo "⚠️  Dependencies may be incomplete - try: cd backend && npm install"
    fi
else
    echo "❌ node_modules not found - run: cd backend && npm install"
fi

# 7. Try to start backend manually to see error
echo ""
echo "7. Attempting to start backend manually (will show error if any)..."
echo "=========================================="
cd "$APP_DIR/backend"
NODE_ENV=production node index.js 2>&1 | head -20 || true
cd "$APP_DIR"

echo ""
echo "=========================================="
echo "Diagnosis complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Review the errors above"
echo "2. Fix any missing environment variables"
echo "3. Ensure database is running: sudo systemctl status postgresql"
echo "4. Restart backend: pm2 restart moh-ims-backend"
echo "5. Monitor logs: pm2 logs moh-ims-backend --lines 100"

