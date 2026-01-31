# 🔧 Diagnose 502 Bad Gateway - Step by Step

## Step 1: Check if latest changes are pulled

```bash
cd /var/www/inventory
git status
git log --oneline -5
```

**Expected**: Should show the latest commit with "Fix: Add missing authorize import"

If not, run:
```bash
git pull origin main
```

## Step 2: Check PM2 Status

```bash
pm2 status
```

**Expected**: `moh-ims-backend` should show `online` status

**If it shows `errored` or `stopped`**: Continue to Step 3

## Step 3: Check Backend Logs

```bash
pm2 logs moh-ims-backend --lines 100 --err
```

**Look for**:
- `ReferenceError: authorize is not defined` - Missing import (should be fixed now)
- `Cannot find module 'xss'` - Missing package
- `SyntaxError` - Code syntax error
- Any other error messages

## Step 4: Manual Test - Start Backend Directly

```bash
cd /var/www/inventory/backend
node index.js
```

This will show the exact error preventing startup. Press `Ctrl+C` to stop after seeing the error.

## Step 5: Verify Dependencies

```bash
cd /var/www/inventory/backend
npm list xss
npm list | grep authorize
```

**Expected**: Should show `xss@1.0.14` installed

If missing:
```bash
npm install xss
```

## Step 6: Verify authorize.js exists

```bash
ls -la /var/www/inventory/backend/middleware/authorize.js
```

**Expected**: File should exist

If missing, the file needs to be created or pulled from git.

## Step 7: Check userRoutes.js has the import

```bash
grep -n "authorize" /var/www/inventory/backend/routes/users/userRoutes.js | head -5
```

**Expected**: Should show:
- Line with `const authorize = require(...)`
- Line with `authorize('admin')` usage

## Step 8: Full Restart

After fixing any issues:

```bash
cd /var/www/inventory
git pull origin main
cd backend
npm install  # Install any missing packages
pm2 restart moh-ims-backend
pm2 logs moh-ims-backend --lines 50
```

## Step 9: Verify Backend is Running

```bash
# Check if port 5000 is listening
sudo netstat -tlnp | grep 5000
# OR
sudo ss -tlnp | grep 5000

# Test backend directly
curl http://localhost:5000/api/system/health
```

**Expected**: Should return JSON response with status

## Common Issues & Fixes

### Issue 1: Missing xss package
```bash
cd /var/www/inventory/backend
npm install xss
pm2 restart moh-ims-backend
```

### Issue 2: Missing authorize import
```bash
cd /var/www/inventory
git pull origin main
pm2 restart moh-ims-backend
```

### Issue 3: authorize.js file missing
```bash
cd /var/www/inventory
git pull origin main
ls -la backend/middleware/authorize.js  # Verify it exists
pm2 restart moh-ims-backend
```

### Issue 4: Syntax error in route file
Check the specific file mentioned in logs and fix the syntax error.

## Quick Fix Command

If you've pulled the latest changes:

```bash
cd /var/www/inventory && \
git pull origin main && \
cd backend && \
npm install && \
pm2 restart moh-ims-backend && \
sleep 3 && \
pm2 logs moh-ims-backend --lines 30
```
