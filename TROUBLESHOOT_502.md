# 🔧 Troubleshooting 502 Bad Gateway Error

## Quick Diagnosis Commands

Run these commands on the server to diagnose the issue:

### 1. Check PM2 Status
```bash
pm2 status
```

**Expected Output**: Both `moh-ims-backend` and `moh-ims-frontend` should show `online` status.

**If backend shows `errored` or `stopped`**:
- Check logs: `pm2 logs moh-ims-backend --lines 100`
- Look for syntax errors, missing dependencies, or database connection issues

### 2. Check Backend Logs
```bash
pm2 logs moh-ims-backend --lines 100
```

**Common Issues to Look For**:
- Syntax errors in route files
- Missing dependencies (e.g., `xss` package)
- Database connection errors
- Port already in use
- Module not found errors

### 3. Check if Backend is Listening
```bash
# Check if port 5000 is in use
sudo netstat -tlnp | grep 5000
# OR
sudo ss -tlnp | grep 5000

# Test backend directly
curl http://localhost:5000/api/system/health
```

### 4. Check Nginx Error Logs
```bash
sudo tail -50 /var/log/nginx/error.log
```

### 5. Verify Dependencies
```bash
cd /var/www/inventory/backend
npm list xss  # Check if xss package is installed
```

## Common Fixes

### Fix 1: Missing `xss` Package
If you see `Cannot find module 'xss'` error:

```bash
cd /var/www/inventory/backend
npm install xss
pm2 restart moh-ims-backend
```

### Fix 2: Syntax Error in Route Files
If there's a syntax error, check the specific file mentioned in logs:

```bash
# Example: Check brandRoutes.js
cd /var/www/inventory/backend
node -c routes/categories/brandRoutes.js
```

### Fix 3: Restart Backend
```bash
pm2 restart moh-ims-backend
pm2 logs moh-ims-backend --lines 50
```

### Fix 4: Full Restart
```bash
pm2 restart all
pm2 save
```

### Fix 5: Reinstall Dependencies
```bash
cd /var/www/inventory/backend
rm -rf node_modules package-lock.json
npm install
pm2 restart moh-ims-backend
```

## Verification Steps

After fixing, verify:

1. **PM2 Status**: `pm2 status` - should show both processes online
2. **Backend Health**: `curl http://localhost:5000/api/system/health`
3. **Nginx Test**: `sudo nginx -t`
4. **Reload Nginx**: `sudo systemctl reload nginx`
5. **Test Login**: Try logging in again

## If Still Not Working

1. **Check Environment Variables**:
```bash
cd /var/www/inventory/backend
cat .env  # or check where env vars are loaded from
```

2. **Check Database Connection**:
```bash
# Verify database is accessible
psql -h localhost -U inventory_user -d inventory_db -c "SELECT 1;"
```

3. **Manual Start Test**:
```bash
cd /var/www/inventory/backend
node index.js
# This will show any startup errors
```

4. **Check File Permissions**:
```bash
ls -la /var/www/inventory/backend/routes/
# Ensure files are readable
```
