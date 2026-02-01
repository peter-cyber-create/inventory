#!/bin/bash
# Check PM2 logs to see what's crashing

echo "📋 Backend Error Logs:"
pm2 logs moh-ims-backend --lines 30 --err --nostream

echo ""
echo "📋 Backend Output Logs:"
pm2 logs moh-ims-backend --lines 30 --out --nostream
