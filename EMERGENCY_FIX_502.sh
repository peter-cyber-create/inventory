#!/bin/bash
# EMERGENCY FIX for 502 Bad Gateway
# This script fixes the most common causes

set -e

echo "🚨 EMERGENCY 502 FIX"
echo "===================="
echo ""

cd /var/www/inventory || { echo "❌ Directory not found"; exit 1; }

# Pull latest
echo "📥 Pulling latest code..."
git pull origin main || echo "⚠️ Git pull failed, continuing..."

# Fix 1: Ensure all dependencies are installed
echo "📦 Installing/updating dependencies..."
cd backend
npm install --production --legacy-peer-deps 2>&1 | tail -5
cd ..

# Fix 2: Check if ecosystem.config.js is correct
echo "🔍 Checking PM2 configuration..."
if [ ! -f "ecosystem.config.js" ]; then
    echo "❌ ecosystem.config.js missing!"
    exit 1
fi

# Fix 3: Stop everything
echo "🛑 Stopping all PM2 processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true
sleep 2

# Fix 4: Check if backend can start manually (test)
echo "🧪 Testing backend startup..."
cd backend
timeout 5 node -e "
try {
    require('./index.js');
    console.log('✅ Backend can load');
} catch(e) {
    console.error('❌ Backend error:', e.message);
    process.exit(1);
}
" 2>&1 || echo "⚠️ Manual test failed, but continuing..."

# Fix 5: Start with PM2 using the ecosystem file
echo "🚀 Starting with PM2..."
cd /var/www/inventory
pm2 start ecosystem.config.js
pm2 save

# Fix 6: Wait and check
echo "⏳ Waiting 15 seconds for services to start..."
sleep 15

# Fix 7: Check PM2 status
echo ""
echo "📊 PM2 Status:"
pm2 status

# Fix 8: Check if backend is listening
echo ""
echo "🔌 Checking port 5000..."
if netstat -tlnp 2>/dev/null | grep -q ":5000" || ss -tlnp 2>/dev/null | grep -q ":5000"; then
    echo "✅ Port 5000 is listening"
else
    echo "❌ Port 5000 is NOT listening"
    echo ""
    echo "📋 Backend error logs:"
    pm2 logs moh-ims-backend --lines 50 --err --nostream
    echo ""
    echo "📋 Backend output logs:"
    pm2 logs moh-ims-backend --lines 30 --out --nostream
    exit 1
fi

# Fix 9: Test health endpoint
echo ""
echo "🏥 Testing health endpoint..."
for i in {1..3}; do
    if curl -f -s http://localhost:5000/api/system/health > /dev/null 2>&1; then
        echo "✅ Backend is responding!"
        curl -s http://localhost:5000/api/system/health
        echo ""
        break
    else
        echo "⏳ Attempt $i/3: Not ready yet..."
        sleep 3
    fi
done

# Fix 10: Restart Nginx
echo ""
echo "🌐 Restarting Nginx..."
sudo systemctl restart nginx 2>/dev/null || echo "⚠️ Could not restart Nginx (may need manual restart)"

echo ""
echo "✅ EMERGENCY FIX COMPLETE!"
echo ""
echo "If still getting 502, run:"
echo "  pm2 logs moh-ims-backend --lines 100"
echo ""
