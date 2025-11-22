#!/bin/bash

# Start application script
# Run this to ensure everything is started correctly

cd /opt/inventory

echo "🚀 Starting Application..."
echo ""

# Make sure we're in the right directory
if [ ! -f "ecosystem.config.js" ]; then
    echo "❌ ecosystem.config.js not found. Running fix script..."
    ./scripts/deployment/fix-pm2-config.sh
fi

# Stop any existing processes
echo "Stopping existing PM2 processes..."
pm2 delete all 2>/dev/null || true

# Start applications
echo "Starting applications with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Wait a moment
sleep 3

# Check status
echo ""
echo "Application Status:"
pm2 status

echo ""
echo "Testing connections..."
sleep 2

# Test backend
if curl -f http://localhost:5000/api/system/health > /dev/null 2>&1; then
    echo "✅ Backend is responding"
else
    echo "❌ Backend is not responding"
    echo "Check logs: pm2 logs moh-ims-backend"
fi

# Test frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is responding"
else
    echo "❌ Frontend is not responding"
    echo "Check logs: pm2 logs moh-ims-frontend"
fi

echo ""
echo "View logs with: pm2 logs"
echo "View status with: pm2 status"

