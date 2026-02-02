#!/bin/bash
# Clean restart script - kills all processes and restarts PM2

echo "🧹 Cleaning up all processes..."

# Stop and delete all PM2 processes
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Kill any node processes on port 5000
lsof -ti:5000 | xargs kill -9 2>/dev/null || true

# Kill any babel-node processes
pkill -f "babel-node.*index.js" 2>/dev/null || true
pkill -f "node.*index.js" 2>/dev/null || true

# Wait a moment
sleep 2

# Verify port is free
if lsof -ti:5000 > /dev/null 2>&1; then
    echo "⚠️  Port 5000 still in use, force killing..."
    lsof -ti:5000 | xargs kill -9 2>/dev/null || true
    sleep 1
fi

# Check if port is now free
if lsof -ti:5000 > /dev/null 2>&1; then
    echo "❌ ERROR: Port 5000 is still in use!"
    echo "Processes using port 5000:"
    lsof -i:5000
    exit 1
fi

echo "✅ Port 5000 is free"

# Start PM2
echo "🚀 Starting PM2..."
cd /var/www/inventory
pm2 start ecosystem.config.js
sleep 5

# Check status
echo ""
echo "📊 PM2 Status:"
pm2 status

# Test health endpoint
echo ""
echo "🏥 Testing health endpoint..."
sleep 3
if curl -f -s http://localhost:5000/api/system/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy!"
    curl -s http://localhost:5000/api/system/health | head -5
    pm2 save
else
    echo "❌ Backend health check failed. Showing logs:"
    pm2 logs moh-ims-backend --lines 30 --nostream
fi
