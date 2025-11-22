#!/bin/bash

# Status check script for troubleshooting connection issues

echo "🔍 Checking Application Status..."
echo ""

# Check PM2 status
echo "1. PM2 Status:"
pm2 list
echo ""

# Check if ports are listening
echo "2. Port Status:"
echo "Checking port 5000 (backend):"
sudo netstat -tulpn | grep :5000 || echo "  ❌ Port 5000 not listening"
echo ""
echo "Checking port 3000 (frontend):"
sudo netstat -tulpn | grep :3000 || echo "  ❌ Port 3000 not listening"
echo ""

# Check if processes are running
echo "3. Node.js Processes:"
ps aux | grep -E "node|serve" | grep -v grep || echo "  ❌ No Node.js processes found"
echo ""

# Test local connections
echo "4. Local Connection Tests:"
echo "Testing backend (localhost:5000):"
curl -s http://localhost:5000/api/system/health || echo "  ❌ Backend not responding"
echo ""
echo "Testing frontend (localhost:3000):"
curl -s -I http://localhost:3000 | head -1 || echo "  ❌ Frontend not responding"
echo ""

# Check PM2 logs
echo "5. Recent PM2 Logs (last 10 lines):"
pm2 logs --lines 10 --nostream
echo ""

# Check if ecosystem.config.js exists
echo "6. Configuration Check:"
if [ -f "/var/www/inventory/ecosystem.config.js" ]; then
    echo "  ✅ ecosystem.config.js exists"
    echo "  Contents:"
    cat /var/www/inventory/ecosystem.config.js | head -20
else
    echo "  ❌ ecosystem.config.js not found"
fi
echo ""

# Check if build directory exists
echo "7. Build Check:"
if [ -d "/var/www/inventory/frontend/build" ]; then
    echo "  ✅ Frontend build directory exists"
    ls -la /var/www/inventory/frontend/build | head -5
else
    echo "  ❌ Frontend build directory not found"
fi
echo ""

# Check backend index.js
echo "8. Backend File Check:"
if [ -f "/var/www/inventory/backend/index.js" ]; then
    echo "  ✅ backend/index.js exists"
else
    echo "  ❌ backend/index.js not found"
fi
echo ""

echo "📋 Summary:"
echo "If PM2 shows apps as 'online' but ports aren't listening, try:"
echo "  pm2 restart all"
echo ""
echo "If apps show as 'errored' or 'stopped', check logs:"
echo "  pm2 logs"
echo ""
echo "To start applications:"
echo "  pm2 start ecosystem.config.js"

