#!/bin/bash

# Fix server build issues by resetting local changes and pulling correct version

set -e

APP_DIR="/var/www/inventory"
cd "$APP_DIR" || exit 1

echo "🔧 Fixing Server Build Issues..."
echo ""

# Stash or reset local changes
echo "1. Resetting local changes..."
git reset --hard HEAD
git clean -fd
echo "✅ Local changes reset"

# Pull latest changes
echo ""
echo "2. Pulling latest changes..."
git pull origin main
echo "✅ Latest changes pulled"

# Verify the files are correct
echo ""
echo "3. Verifying imports..."
if grep -q "EditOutlined" frontend/src/pages/ICT/Dashboard.jsx && grep -q "from '@ant-design/icons'" frontend/src/pages/ICT/Dashboard.jsx; then
    echo "✅ ICT/Dashboard.jsx imports correct"
else
    echo "❌ ICT/Dashboard.jsx imports broken - fixing..."
    # Fix ICT Dashboard
    sed -i 's/EditOutlined as _EditOutlined/EditOutlined/g' frontend/src/pages/ICT/Dashboard.jsx 2>/dev/null || true
    sed -i 's/const { Title: _Title, Text: _Text }/const { Title: _Title, Text }/g' frontend/src/pages/ICT/Dashboard.jsx 2>/dev/null || true
fi

if grep -q "EditOutlined" frontend/src/pages/Stores/Dashboard.jsx && grep -q "from '@ant-design/icons'" frontend/src/pages/Stores/Dashboard.jsx; then
    echo "✅ Stores/Dashboard.jsx imports correct"
else
    echo "❌ Stores/Dashboard.jsx imports broken - fixing..."
    # Fix Stores Dashboard
    sed -i 's/EditOutlined as _EditOutlined/EditOutlined/g' frontend/src/pages/Stores/Dashboard.jsx 2>/dev/null || true
    sed -i 's/const { Title: _Title, Text: _Text }/const { Title: _Title, Text }/g' frontend/src/pages/Stores/Dashboard.jsx 2>/dev/null || true
fi

# Rebuild frontend
echo ""
echo "4. Rebuilding frontend..."
cd frontend
npm run build
cd ..
echo "✅ Frontend rebuilt"

# Restart PM2
echo ""
echo "5. Restarting PM2..."
pm2 restart all
echo "✅ PM2 restarted"

echo ""
echo "=========================================="
echo "✅ Build fix complete!"
echo "=========================================="

