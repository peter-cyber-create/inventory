#!/bin/bash
# Quick Backend Status Check
# Run this on the server to see what's wrong

echo "🔍 BACKEND STATUS CHECK"
echo "======================="
echo ""

# Check PM2
echo "1. PM2 Status:"
pm2 list | grep moh-ims-backend || echo "   ❌ Backend not in PM2"
echo ""

# Check if process is running
echo "2. Process Check:"
if pgrep -f "babel-node.*index.js" > /dev/null; then
    echo "   ✅ Backend process is running"
    pgrep -f "babel-node.*index.js"
else
    echo "   ❌ Backend process NOT running"
fi
echo ""

# Check port
echo "3. Port 5000:"
if netstat -tlnp 2>/dev/null | grep -q ":5000" || ss -tlnp 2>/dev/null | grep -q ":5000"; then
    echo "   ✅ Port 5000 is listening"
    netstat -tlnp 2>/dev/null | grep ":5000" || ss -tlnp 2>/dev/null | grep ":5000"
else
    echo "   ❌ Port 5000 is NOT listening"
fi
echo ""

# Check health endpoint
echo "4. Health Endpoint:"
if curl -f -s http://localhost:5000/api/system/health > /dev/null 2>&1; then
    echo "   ✅ Backend is responding"
    curl -s http://localhost:5000/api/system/health
else
    echo "   ❌ Backend is NOT responding"
    echo "   Testing connection:"
    curl -v http://localhost:5000/api/system/health 2>&1 | head -10
fi
echo ""

# Show recent errors
echo "5. Recent Error Logs:"
pm2 logs moh-ims-backend --lines 20 --err --nostream 2>/dev/null || echo "   No error logs"
echo ""

# Show recent output
echo "6. Recent Output Logs:"
pm2 logs moh-ims-backend --lines 15 --out --nostream 2>/dev/null || echo "   No output logs"
echo ""

echo "======================="
echo "If backend is not running, run:"
echo "  cd /var/www/inventory && bash EMERGENCY_FIX_502.sh"
echo ""
