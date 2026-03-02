#!/bin/bash
# Sync project to frank@172.27.1.170:~/inv
# Run from project root: ./scripts/sync-to-server.sh

set -e
RSYNC_EXCLUDES=(
  --exclude 'node_modules'
  --exclude 'backend/node_modules'
  --exclude 'frontend/node_modules'
  --exclude 'backend/.env'
  --exclude '.env'
  --exclude '.git'
)
rsync -avz "${RSYNC_EXCLUDES[@]}" . frank@172.27.1.170:~/inv/
echo ""
echo "Sync done. You must BUILD on the server or the new UI will not appear."
echo "On the server run:"
echo "  cd ~/inv && bash scripts/deploy-on-server.sh"
echo ""
echo "Or manually:"
echo "  cd ~/inv && npm install && cd backend && npm install && cd .. && npm run build"
echo "  cd backend && npx prisma migrate deploy && pkill -f 'node dist/index.js'; nohup npm start > ../backend.log 2>&1 &"
echo ""
echo "Then hard-refresh the browser (Ctrl+Shift+R or Cmd+Shift+R) to avoid cached index.html."
