# Quick Fix for 502 Bad Gateway - Server Deployment

## Problem
The backend was crashing due to ES6 import/CommonJS require mixing, causing `ReferenceError: require is not defined in ES module scope`.

## Solution Applied
✅ Converted all 37 files from ES6 `import` to CommonJS `require` statements
✅ Fixed syntax errors in model files
✅ All changes pushed to repository

## Server Deployment Steps

Run these commands on your server:

```bash
# 1. Navigate to project directory
cd /var/www/inventory

# 2. Pull latest changes
git pull origin main

# 3. Install any new dependencies (if needed)
cd backend && npm install && cd ..

# 4. Restart PM2 processes
pm2 restart moh-ims-backend
pm2 restart moh-ims-frontend

# 5. Wait a few seconds and check status
sleep 5
pm2 status

# 6. Test backend health
curl http://localhost:5000/api/system/health

# 7. Check logs if still having issues
pm2 logs moh-ims-backend --lines 50
```

## One-Liner Command

```bash
cd /var/www/inventory && git pull origin main && cd backend && npm install && cd .. && pm2 restart all && sleep 5 && pm2 status && curl http://localhost:5000/api/system/health
```

## Expected Result

- ✅ Backend should start without errors
- ✅ Health check should return `{"status":"ok"}`
- ✅ Login page should work
- ✅ No more 502 Bad Gateway errors

## If Still Having Issues

1. Check PM2 logs:
   ```bash
   pm2 logs moh-ims-backend --lines 100 --err
   ```

2. Verify PM2 is using babel-node:
   ```bash
   pm2 describe moh-ims-backend | grep script
   ```
   Should show: `npx babel-node index.js`

3. Check if backend is listening:
   ```bash
   netstat -tlnp | grep 5000
   ```

4. Restart Nginx if needed:
   ```bash
   sudo systemctl restart nginx
   ```

## Files Fixed

- All model files (assets, vehicles, activity, etc.)
- All route files with ES6 imports
- Total: 37 files converted
