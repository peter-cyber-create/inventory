#!/bin/bash
# Complete Fix Script for 502 Bad Gateway
# This script performs all necessary fixes

set -e

echo "🔧 COMPLETE 502 FIX SCRIPT"
echo "=========================="
echo ""

cd /var/www/inventory || { echo "❌ Directory not found"; exit 1; }

# Step 1: Pull latest changes
echo "📥 Step 1: Pulling latest changes..."
git pull origin main || { echo "⚠️ Git pull failed, continuing anyway..."; }

# Step 2: Install/update dependencies
echo "📦 Step 2: Installing dependencies..."
cd backend
npm install --production --no-audit --no-fund
cd ..

# Step 3: Stop all PM2 processes
echo "🛑 Step 3: Stopping PM2 processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Step 4: Verify ecosystem.config.js exists
echo "📋 Step 4: Checking PM2 configuration..."
if [ ! -f "ecosystem.config.js" ]; then
    echo "❌ ecosystem.config.js not found!"
    exit 1
fi
echo "✅ PM2 config found"

# Step 5: Start with PM2
echo "🚀 Step 5: Starting services with PM2..."
pm2 start ecosystem.config.js
pm2 save

# Step 6: Wait for services
echo "⏳ Step 6: Waiting for services to start..."
sleep 10

# Step 7: Check status
echo "📊 Step 7: Checking PM2 status..."
pm2 status

# Step 8: Check backend health
echo "🏥 Step 8: Testing backend health..."
for i in {1..5}; do
    if curl -f -s http://localhost:5000/api/system/health > /dev/null 2>&1; then
        echo "✅ Backend is healthy!"
        curl -s http://localhost:5000/api/system/health
        echo ""
        break
    else
        echo "⏳ Attempt $i/5: Backend not ready yet, waiting..."
        sleep 3
    fi
done

# Step 9: Show logs if still failing
if ! curl -f -s http://localhost:5000/api/system/health > /dev/null 2>&1; then
    echo "❌ Backend health check failed after 5 attempts"
    echo ""
    echo "📋 Recent error logs:"
    pm2 logs moh-ims-backend --lines 30 --err --nostream
    echo ""
    echo "📋 Recent output logs:"
    pm2 logs moh-ims-backend --lines 20 --out --nostream
    echo ""
    echo "🔍 Run DIAGNOSE_SERVER.sh for detailed diagnostics"
    exit 1
fi

# Step 10: Check Nginx
echo "🌐 Step 9: Checking Nginx..."
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
    sudo systemctl restart nginx 2>/dev/null || echo "⚠️ Could not restart Nginx (may need sudo)"
else
    echo "⚠️ Nginx is not running"
fi

echo ""
echo "✅ FIX COMPLETE!"
echo "🌐 Test your application now"
echo ""
