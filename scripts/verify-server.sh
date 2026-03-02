#!/bin/bash
# Run this ON THE SERVER (e.g. ssh frank@172.27.1.170 'bash -s' < scripts/verify-server.sh)
# Or: ssh frank@172.27.1.170 'cd ~/inv && bash scripts/verify-server.sh'
# Prints what is actually running so we can see why the new UI or API might not appear.

set -e
cd "$(dirname "$0")/.."
echo "=== 1. Backend process ==="
pgrep -af "node.*dist/index" || echo "No node backend process found."
echo ""
echo "=== 2. Backend health (localhost:3000) ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:3000/health 2>/dev/null || echo "Connection failed (backend not running or wrong port)."
echo ""
echo "=== 3. Frontend dist (when was it built?) ==="
if [ -f frontend/dist/build-time.txt ]; then
  echo "build-time.txt: $(cat frontend/dist/build-time.txt)"
else
  echo "frontend/dist/build-time.txt not found (run npm run build in ~/inv)."
fi
if [ -f frontend/dist/index.html ]; then
  echo "index.html mtime: $(stat -c '%y' frontend/dist/index.html 2>/dev/null || stat -f '%Sm' frontend/dist/index.html 2>/dev/null)"
else
  echo "frontend/dist/index.html not found."
fi
echo ""
echo "=== 4. Nginx root (where is it serving from?) ==="
if command -v nginx &>/dev/null; then
  nginx -T 2>/dev/null | grep -E "root |server_name " | head -20 || echo "Run: sudo nginx -T | grep root"
else
  echo "Nginx not in PATH. Run: sudo nginx -T | grep -E 'root|server_name'"
fi
echo ""
echo "=== 5. Done ==="
echo "If backend is down, run: cd ~/inv/backend && npm start"
echo "If frontend/dist is old, run: cd ~/inv && npm run build"
echo "If Nginx root is not ~/inv/frontend/dist, fix the server block and: sudo systemctl reload nginx"
