#!/bin/bash
# Run this script ON THE SERVER after syncing code (or use ./scripts/deploy.sh from your machine to sync + run this).
# Usage: cd ~/inv && bash scripts/deploy-on-server.sh

set -e
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "=== Deploy started at ${BUILD_TIME} ==="

echo "=== Installing dependencies ==="
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

echo "=== Building backend + frontend (updates frontend/dist) ==="
npm run build

echo "=== Running migrations ==="
cd backend && npx prisma migrate deploy && cd ..

echo "=== Stopping existing backend (if any) ==="
pkill -f 'node dist/index.js' 2>/dev/null || true
sleep 2

echo "=== Starting backend ==="
cd backend && nohup npm start > ../backend.log 2>&1 &
sleep 2
if curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/health 2>/dev/null | grep -q 200; then
  echo "Backend responding on port 3000."
else
  echo "Warning: Backend may not be up yet. Check ~/inv/backend.log"
fi

echo ""
echo "=== Deploy done. Build time: ${BUILD_TIME} ==="
echo "Backend log: ~/inv/backend.log"
echo "Check the app header for 'Build: <date>' — when it matches this time, the new UI is live. Hard refresh (Ctrl+Shift+R) if needed."
