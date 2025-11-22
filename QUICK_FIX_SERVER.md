# Quick Fix for Server Build Issues

## Run These Commands on the Server

```bash
cd /var/www/inventory

# 1. Reset all local changes
git reset --hard HEAD
git clean -fd

# 2. Pull latest changes
git pull origin main

# 3. Fix the broken imports manually (if needed)
# Fix ICT Dashboard
sed -i 's/EditOutlined as _EditOutlined/EditOutlined/g' frontend/src/pages/ICT/Dashboard.jsx 2>/dev/null || true
sed -i 's/const { Title: _Title, Text: _Text }/const { Title: _Title, Text }/g' frontend/src/pages/ICT/Dashboard.jsx 2>/dev/null || true

# Fix Stores Dashboard  
sed -i 's/EditOutlined as _EditOutlined/EditOutlined/g' frontend/src/pages/Stores/Dashboard.jsx 2>/dev/null || true
sed -i 's/const { Title: _Title, Text: _Text }/const { Title: _Title, Text }/g' frontend/src/pages/Stores/Dashboard.jsx 2>/dev/null || true

# 4. Rebuild frontend
cd frontend
npm run build
cd ..

# 5. Restart PM2
pm2 restart all
```

## What This Does

1. **Resets local changes** - Removes all modifications from the ESLint fix script
2. **Pulls correct version** - Gets the fixed files from the repo
3. **Fixes any remaining issues** - Ensures imports are correct
4. **Rebuilds** - Creates a clean build
5. **Restarts services** - Applies the new build

After running these commands, the build should complete successfully!

