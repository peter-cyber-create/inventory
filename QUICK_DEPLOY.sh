#!/bin/bash
# Quick deployment script for 502 fix
# Run this on the server: bash QUICK_DEPLOY.sh

set -e

echo "🚀 Quick Deploy - Fixing 502 Bad Gateway..."
echo ""

cd /var/www/inventory || { echo "❌ Directory not found"; exit 1; }

echo "📥 Pulling latest changes..."
git pull origin main

echo "📦 Installing dependencies..."
cd backend
npm install --production
cd ..

echo "🔄 Restarting services..."
pm2 restart moh-ims-backend
pm2 restart moh-ims-frontend

echo "⏳ Waiting for services to start..."
sleep 8

echo "📊 Checking PM2 status..."
pm2 status

echo ""
echo "🏥 Testing backend health..."
if curl -f http://localhost:5000/api/system/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy!"
else
    echo "❌ Backend health check failed"
    echo "📋 Recent logs:"
    pm2 logs moh-ims-backend --lines 20 --nostream
    exit 1
fi

echo ""
echo "✅ Deployment complete!"
echo "🌐 Test login at: http://your-server-ip"
