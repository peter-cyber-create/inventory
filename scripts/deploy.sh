#!/bin/bash
# One-command deploy: sync code to server, then build and restart on the server.
# Run from project root: ./scripts/deploy.sh
# Requires: rsync, ssh access to frank@172.27.1.170 (password or key)

set -e
SERVER="${IMS_SERVER:-frank@172.27.1.170}"
REMOTE_DIR="${IMS_REMOTE_DIR:-~/inv}"

echo "=== 1. Syncing code to ${SERVER} ==="
RSYNC_EXCLUDES=(
  --exclude 'node_modules'
  --exclude 'backend/node_modules'
  --exclude 'frontend/node_modules'
  --exclude 'backend/.env'
  --exclude '.env'
  --exclude '.git'
)
rsync -avz "${RSYNC_EXCLUDES[@]}" . "${SERVER}:${REMOTE_DIR}/"

echo ""
echo "=== 2. Building and restarting on server ==="
ssh "${SERVER}" "cd ${REMOTE_DIR} && bash scripts/deploy-on-server.sh"

echo ""
echo "=== Deploy finished. ==="
echo "Open the site and check the header for 'Build: <date/time>' — when that updates, the new build is live."
echo "If the UI looks unchanged, do a hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)."
