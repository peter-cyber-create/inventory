#!/bin/bash
# Comprehensive Server Diagnostic Script
# Run this on the server to identify the 502 error

echo "🔍 DIAGNOSING 502 BAD GATEWAY ERROR"
echo "===================================="
echo ""

# Check PM2 status
echo "1️⃣ PM2 Status:"
pm2 status
echo ""

# Check if backend process exists
echo "2️⃣ Backend Process Details:"
if pm2 describe moh-ims-backend > /dev/null 2>&1; then
    pm2 describe moh-ims-backend | grep -E "status|pid|pm2 id|restarts|uptime|script|error"
else
    echo "❌ Backend process not found in PM2"
fi
echo ""

# Check backend logs
echo "3️⃣ Recent Backend Error Logs (last 30 lines):"
pm2 logs moh-ims-backend --lines 30 --err --nostream 2>/dev/null || echo "No error logs found"
echo ""

# Check backend output logs
echo "4️⃣ Recent Backend Output Logs (last 20 lines):"
pm2 logs moh-ims-backend --lines 20 --out --nostream 2>/dev/null || echo "No output logs found"
echo ""

# Check if port 5000 is listening
echo "5️⃣ Port 5000 Status:"
if netstat -tlnp 2>/dev/null | grep -q ":5000"; then
    echo "✅ Port 5000 is listening"
    netstat -tlnp 2>/dev/null | grep ":5000"
else
    echo "❌ Port 5000 is NOT listening"
fi
echo ""

# Test backend health endpoint
echo "6️⃣ Backend Health Check:"
if curl -f -s http://localhost:5000/api/system/health > /dev/null 2>&1; then
    echo "✅ Backend health check passed"
    curl -s http://localhost:5000/api/system/health | head -5
else
    echo "❌ Backend health check failed"
    echo "   Trying with verbose output:"
    curl -v http://localhost:5000/api/system/health 2>&1 | head -10
fi
echo ""

# Check Nginx status
echo "7️⃣ Nginx Status:"
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx is running"
    systemctl status nginx --no-pager -l | head -10
else
    echo "❌ Nginx is not running"
fi
echo ""

# Check Nginx error logs
echo "8️⃣ Recent Nginx Error Logs:"
if [ -f /var/log/nginx/error.log ]; then
    tail -20 /var/log/nginx/error.log
else
    echo "Nginx error log not found at /var/log/nginx/error.log"
fi
echo ""

# Check if backend directory exists and has files
echo "9️⃣ Backend Directory Check:"
cd /var/www/inventory/backend 2>/dev/null || { echo "❌ Backend directory not found"; exit 1; }
echo "✅ Backend directory exists"
echo "   Checking key files:"
[ -f "index.js" ] && echo "   ✅ index.js exists" || echo "   ❌ index.js missing"
[ -f "package.json" ] && echo "   ✅ package.json exists" || echo "   ❌ package.json missing"
[ -f "middleware/authorize.js" ] && echo "   ✅ authorize.js exists" || echo "   ❌ authorize.js missing"
[ -f "config/db.js" ] && echo "   ✅ db.js exists" || echo "   ❌ db.js missing"
echo ""

# Check node_modules
echo "🔟 Node Modules Check:"
if [ -d "node_modules" ]; then
    echo "✅ node_modules exists"
    if [ -d "node_modules/@babel" ]; then
        echo "   ✅ Babel packages installed"
    else
        echo "   ❌ Babel packages missing - run: npm install"
    fi
    if [ -d "node_modules/xss" ]; then
        echo "   ✅ xss package installed"
    else
        echo "   ❌ xss package missing - run: npm install"
    fi
else
    echo "❌ node_modules missing - run: npm install"
fi
echo ""

# Check environment variables
echo "1️⃣1️⃣ Environment Variables Check:"
echo "   DB_NAME: ${DB_NAME:+✅ Set}${DB_NAME:-❌ Not set}"
echo "   DB_USER: ${DB_USER:+✅ Set}${DB_USER:-❌ Not set}"
echo "   DB_PASS: ${DB_PASS:+✅ Set}${DB_PASS:-❌ Not set}"
echo "   PORT: ${PORT:-5000 (default)}"
echo "   NODE_ENV: ${NODE_ENV:-not set}"
echo ""

# Try to start backend manually to see errors
echo "1️⃣2️⃣ Testing Backend Start (dry run):"
cd /var/www/inventory/backend
if node -c index.js 2>&1; then
    echo "✅ Syntax check passed"
else
    echo "❌ Syntax errors found"
fi
echo ""

echo "===================================="
echo "📋 SUMMARY"
echo "===================================="
echo "Run these commands to fix common issues:"
echo ""
echo "1. If backend not running:"
echo "   pm2 restart moh-ims-backend"
echo ""
echo "2. If missing dependencies:"
echo "   cd /var/www/inventory/backend && npm install"
echo ""
echo "3. If port not listening:"
echo "   pm2 delete moh-ims-backend"
echo "   cd /var/www/inventory && pm2 start ecosystem.config.js"
echo ""
echo "4. To see real-time logs:"
echo "   pm2 logs moh-ims-backend --lines 50"
echo ""
