# 🔧 Fix 502 Bad Gateway Error

## Problem
The backend is crashing because the `xss` package is missing. This package is required for input sanitization in the route files we just updated.

## Solution

Run these commands on the server:

```bash
# 1. Navigate to the application directory
cd /var/www/inventory

# 2. Pull the latest changes (includes the xss package fix)
git pull origin main

# 3. Install the missing xss package
cd backend
npm install xss

# 4. Restart the backend
pm2 restart moh-ims-backend

# 5. Check if it's running
pm2 status
pm2 logs moh-ims-backend --lines 50

# 6. Test the backend
curl http://localhost:5000/api/system/health
```

## Quick One-Liner

```bash
cd /var/www/inventory && git pull origin main && cd backend && npm install xss && pm2 restart moh-ims-backend && pm2 logs moh-ims-backend --lines 30
```

## Verification

After running the fix, you should see:
- ✅ `pm2 status` shows `moh-ims-backend` as `online`
- ✅ `curl http://localhost:5000/api/system/health` returns a success response
- ✅ Login page works without 502 error

## If Still Not Working

Check the logs for other errors:
```bash
pm2 logs moh-ims-backend --lines 100
```

Look for:
- Database connection errors
- Other missing packages
- Syntax errors
