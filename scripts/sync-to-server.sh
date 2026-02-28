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
echo "Sync done. Now on the server run:"
echo "  cd ~/inv && npm install && cd backend && npm install && cd .. && npm run build && cd backend && npx prisma migrate deploy && npm start"
