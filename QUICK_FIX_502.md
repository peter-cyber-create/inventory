# 🚀 Quick Fix 502 Error - Server Commands

## Step 1: Find or Clone the Repository

### If repository already exists:
```bash
# Check common locations
ls -la /opt/inventory
ls -la /var/www/inventory
ls -la ~/inventory

# Navigate to the repository
cd /opt/inventory  # or wherever it is
```

### If repository doesn't exist, clone it:
```bash
# Clone the repository
cd /opt
sudo git clone https://github.com/peter-cyber-create/inventory.git inventory
sudo chown -R $USER:$USER inventory
cd inventory
```

## Step 2: Get Latest Code (if repository exists)

```bash
cd /opt/inventory  # or /var/www/inventory
git pull origin main
```

## Step 3: Run the Fix Script

```bash
# Make script executable
chmod +x scripts/deployment/fix-502-error.sh

# Run the fix script
./scripts/deployment/fix-502-error.sh
```

## Alternative: Quick Manual Fix

If you can't run the script, try these commands:

```bash
# 1. Check PM2 status
pm2 status

# 2. Restart backend
pm2 restart moh-ims-backend

# 3. Check if backend is running
sleep 3
curl http://localhost:5000/api/system/health

# 4. If backend works, reload Nginx
sudo nginx -t && sudo systemctl reload nginx

# 5. Test through Nginx
curl http://172.27.0.10/api/system/health
```

## If Backend is Not in PM2

```bash
# Navigate to app directory
cd /opt/inventory  # or /var/www/inventory

# Start with PM2
cd backend
pm2 start index.js --name moh-ims-backend --env production
pm2 save

# Or if ecosystem.config.js exists
cd /opt/inventory
pm2 start ecosystem.config.js
pm2 save
```

## Check Backend Logs

```bash
pm2 logs moh-ims-backend --lines 50
```

## Complete One-Line Setup (if starting fresh)

```bash
cd /opt && sudo git clone https://github.com/peter-cyber-create/inventory.git inventory && sudo chown -R $USER:$USER inventory && cd inventory && chmod +x scripts/deployment/fix-502-error.sh && ./scripts/deployment/fix-502-error.sh
```

