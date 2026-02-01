#!/bin/bash
# FINAL FIX - This WILL work
set -e

echo "🔧 FINAL 502 FIX - Starting..."
cd /var/www/inventory || exit 1

# Pull latest
git pull origin main

# Install deps
cd backend
npm install --production --legacy-peer-deps 2>&1 | tail -3
cd ..

# Kill everything
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
pkill -f "babel-node.*index.js" 2>/dev/null || true
sleep 2

# Start backend directly first to see errors
echo "Testing backend startup..."
cd backend
timeout 10 node -e "
const path = require('path');
process.env.NODE_ENV = 'production';
process.env.PORT = 5000;
try {
    require('./index.js');
    setTimeout(() => process.exit(0), 2000);
} catch(e) {
    console.error('ERROR:', e.message);
    console.error(e.stack);
    process.exit(1);
}
" 2>&1 || echo "Backend test completed"

# Now start with PM2
cd /var/www/inventory
pm2 start ecosystem.config.js
sleep 10

# Check status
pm2 status

# Test
if curl -f -s http://localhost:5000/api/system/health > /dev/null 2>&1; then
    echo "✅ SUCCESS - Backend is working!"
    curl -s http://localhost:5000/api/system/health
    pm2 save
    exit 0
else
    echo "❌ Still failing. Showing logs:"
    pm2 logs moh-ims-backend --lines 50 --err --nostream
    exit 1
fi
