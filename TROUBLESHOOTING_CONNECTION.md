# 🔧 Troubleshooting Connection Issues

## Error: "This site can't be reached - 172.27.0.10 refused to connect"

This means the application is not running or not accessible. Follow these steps:

## Step 1: Check if Application is Running

```bash
# Check if Node.js processes are running
ps aux | grep node

# Check if PM2 is managing the application
pm2 list

# Check if ports are in use
sudo netstat -tulpn | grep -E ':(5000|3001)'
# OR
sudo ss -tulpn | grep -E ':(5000|3001)'
```

## Step 2: Start the Application

### Option A: Using PM2 (Recommended)

```bash
cd /opt/inventory  # or wherever you cloned the repo

# Start the application
pm2 start ecosystem.config.js

# Or start manually
pm2 start backend/index.js --name moh-ims-backend
pm2 start serve --name moh-ims-frontend -- -s build -l 3001 -d /opt/inventory/frontend

# Save PM2 configuration
pm2 save
```

### Option B: Manual Start (for testing)

```bash
# Terminal 1 - Backend
cd /opt/inventory/backend
npm start
# Should see: "Server started successfully on port 5000"

# Terminal 2 - Frontend (if using serve)
cd /opt/inventory/frontend
npx serve -s build -l 3001
```

## Step 3: Check Application Logs

```bash
# PM2 logs
pm2 logs

# Or check specific app
pm2 logs moh-ims-backend
pm2 logs moh-ims-frontend

# Check for errors
pm2 logs --err
```

## Step 4: Verify Application is Listening

```bash
# Check if backend is listening
curl http://localhost:5000/api/system/health

# Check if frontend is listening
curl http://localhost:3001

# Check from server itself
curl http://127.0.0.1:5000/api/system/health
```

## Step 5: Check Firewall Settings

```bash
# Check firewall status
sudo ufw status

# If firewall is active, allow ports
sudo ufw allow 5000/tcp
sudo ufw allow 3001/tcp
sudo ufw allow 22/tcp  # SSH

# Check if ports are open
sudo ufw status numbered
```

## Step 6: Check Application Configuration

Verify the application is binding to the correct interface:

```bash
# Check backend environment
cat config/environments/backend.env | grep PORT

# Backend should listen on 0.0.0.0 (all interfaces) or specific IP
# Check backend/index.js - should have:
# app.listen(PORT, '0.0.0.0', ...)  or  app.listen(PORT, ...)
```

## Step 7: Verify Network Access

```bash
# Check if server is accessible
ping 172.27.0.10

# From your local machine, test connection
telnet 172.27.0.10 5000
# OR
nc -zv 172.27.0.10 5000
```

## Step 8: Check Application Status

```bash
# Full status check
pm2 status
pm2 info moh-ims-backend
pm2 info moh-ims-frontend

# Restart if needed
pm2 restart all
```

## Common Issues and Solutions

### Issue: Application not starting

**Solution:**
```bash
# Check Node.js version
node --version

# Check dependencies
cd /opt/inventory/backend
npm install

# Check environment variables
cat config/environments/backend.env

# Try starting manually to see errors
cd /opt/inventory/backend
node index.js
```

### Issue: Port already in use

**Solution:**
```bash
# Find what's using the port
sudo lsof -i :5000
sudo lsof -i :3001

# Kill the process
sudo kill -9 <PID>

# Or change port in backend.env
```

### Issue: Database connection error

**Solution:**
```bash
# Test database connection
psql -U inventory_user -d inventory_db -h localhost

# Check backend.env has correct settings
cat config/environments/backend.env | grep DB_

# Should show:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=inventory_db
# DB_USER=inventory_user
```

### Issue: Frontend build missing

**Solution:**
```bash
cd /opt/inventory/frontend
npm run build

# Verify build directory exists
ls -la build/
```

## Quick Diagnostic Commands

Run these to get a full picture:

```bash
# 1. Check if services are running
pm2 list
systemctl status postgresql

# 2. Check ports
sudo netstat -tulpn | grep -E ':(5000|3001|5432)'

# 3. Check firewall
sudo ufw status

# 4. Test local connections
curl http://localhost:5000/api/system/health
curl http://localhost:3001

# 5. Check application logs
pm2 logs --lines 50
```

## Expected Results

✅ **Application Running:**
- `pm2 list` shows apps as "online"
- `curl http://localhost:5000/api/system/health` returns JSON
- `curl http://localhost:3001` returns HTML

✅ **Network Access:**
- `curl http://172.27.0.10:5000/api/system/health` works from server
- Ports 5000 and 3001 are listening on 0.0.0.0 or 172.27.0.10

✅ **Firewall:**
- Ports 5000 and 3001 are allowed
- SSH (port 22) is allowed

## Next Steps After Fixing

Once the application is running:

1. **Test from server:**
   ```bash
   curl http://localhost:5000/api/system/health
   curl http://172.27.0.10:5000/api/system/health
   ```

2. **Test from browser:**
   - Frontend: `http://172.27.0.10:3001`
   - Backend API: `http://172.27.0.10:5000/api/system/health`

3. **Set up PM2 to start on boot:**
   ```bash
   pm2 startup
   pm2 save
   ```

---

**Most Common Fix:** The application simply isn't running. Start it with PM2 or manually, then check the logs for any errors.

