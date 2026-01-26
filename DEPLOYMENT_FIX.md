# Dashboard Not Loading - Fix Instructions

## Problem
After login, only header and footer are visible. Dashboard content is not rendering.

## Changes Made
1. ✅ Removed duplicate `Layout/index.js` (was using antd, now uses `index.jsx`)
2. ✅ Fixed Layout component imports (`Header` → `AppHeader`, `Sidebar` → `AppSidebar`)
3. ✅ Removed old antd `Dashboard/index.js` (now uses professional `index.jsx`)
4. ✅ Improved Dashboard error handling to always render content

## Deployment Steps

```bash
cd /var/www/inventory

# Pull latest changes
git pull origin main

# Rebuild frontend
cd frontend
npm run build
cd ..

# Restart PM2
pm2 restart moh-ims-frontend

# Check status
pm2 status
pm2 logs moh-ims-frontend --lines 50
```

## Debugging Steps (if still not working)

1. **Check browser console** (F12 → Console):
   - Look for red JavaScript errors
   - Share any errors you see

2. **Check Network tab** (F12 → Network):
   - Look for failed API requests (red entries)
   - Check if `/api/` calls are working

3. **Check user role**:
   - Dashboard route requires `admin` role
   - If user is not admin, they'll be redirected
   - Check: `localStorage.getItem('userRole')` in browser console

4. **Verify route**:
   - After login, check URL in browser
   - Should be `/dashboard` for admin users
   - Other roles go to their specific dashboards

## Expected Result
After deployment, you should see:
- Professional header with MoH logo and user menu
- Sidebar navigation
- Dashboard content with:
  - Uganda flag stripe
  - "Dashboard" heading
  - Summary cards (Pending Approvals, Stock Warnings, etc.)
  - Tables with data (or empty state if no data)
- Footer with copyright

## Design Consistency
The Dashboard now uses the same design system as the login page:
- Same color scheme (MoH green, institutional colors)
- Same typography (Inter font)
- Same spacing and layout principles
- Professional, government-grade appearance

