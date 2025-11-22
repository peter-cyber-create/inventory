#!/bin/bash

# Quick verification script after migration

echo "🔍 Verifying Deployment..."
echo ""

cd /var/www/inventory

# Check PM2 status
echo "1. PM2 Status:"
pm2 status
echo ""

# Test backend
echo "2. Testing Backend (localhost:5000):"
if curl -f http://localhost:5000/api/system/health 2>/dev/null; then
    echo "  ✅ Backend is responding"
else
    echo "  ❌ Backend not responding"
fi
echo ""

# Test frontend
echo "3. Testing Frontend (localhost:3000):"
if curl -f http://localhost:3000 2>/dev/null | head -1; then
    echo "  ✅ Frontend is responding"
else
    echo "  ❌ Frontend not responding"
fi
echo ""

# Check ports
echo "4. Port Status:"
netstat -tuln 2>/dev/null | grep -E ':(5000|3000)' || ss -tuln 2>/dev/null | grep -E ':(5000|3000)'
echo ""

# Check application directory
echo "5. Application Location:"
pwd
ls -la | head -10
echo ""

echo "✅ Verification complete!"
echo ""
echo "Access URLs:"
echo "  Frontend: http://172.27.0.10:3000"
echo "  Backend API: http://172.27.0.10:5000/api/system/health"
echo ""
echo "If you can't access from browser, check:"
echo "  - Firewall rules (ports 3000 and 5000 should be open)"
echo "  - Nginx configuration (if using reverse proxy)"

