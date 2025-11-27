# 🔧 Fix 502 Bad Gateway Error

## Quick Fix Commands

### Option 1: Run the automated fix script (Recommended)

```bash
cd /opt/inventory  # or /var/www/inventory
chmod +x scripts/deployment/fix-502-error.sh
./scripts/deployment/fix-502-error.sh
```

If PM2 is still pointing to an old directory (common when the app was previously installed under `/var/www/*`), fix the paths first:

```bash
cd /opt/inventory  # management clone
chmod +x scripts/deployment/fix-path-mismatch.sh
./scripts/deployment/fix-path-mismatch.sh
./scripts/deployment/fix-502-error.sh
```

### Option 2: Manual Fix Steps

#### Step 1: Check if backend is running

```bash
pm2 status
pm2 logs moh-ims-backend --lines 50
```

If backend is not running or crashed:
```bash
cd /opt/inventory  # or /var/www/inventory
pm2 restart moh-ims-backend
# OR if using ecosystem.config.js
pm2 restart ecosystem.config.js --only moh-ims-backend
```

#### Step 2: Verify backend is listening on port 5000

```bash
# Check if port 5000 is in use
netstat -tuln | grep 5000
# OR
ss -tuln | grep 5000

# Test backend directly
curl http://localhost:5000/api/system/health
```

If backend is not responding:
```bash
# Check backend logs
pm2 logs moh-ims-backend --lines 100

# Restart backend
pm2 restart moh-ims-backend
```

#### Step 3: Check Nginx configuration

```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

#### Step 4: Update Nginx configuration (if needed)

```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/inventory
```

Make sure the `/api` location block looks like this:

```nginx
location /api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
    proxy_send_timeout 300s;
}
```

Then reload Nginx:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

#### Step 5: Verify the fix

```bash
# Test backend directly
curl http://localhost:5000/api/system/health

# Test through Nginx
curl http://172.27.0.10/api/system/health
```

## Common Causes and Solutions

### 1. Backend Not Running
**Symptom**: PM2 shows backend as stopped or errored

**Solution**:
```bash
pm2 restart moh-ims-backend
pm2 logs moh-ims-backend
```

### 2. Backend Crashed on Startup
**Symptom**: Backend starts then immediately stops

**Solution**:
```bash
# Check logs for errors
pm2 logs moh-ims-backend --lines 100

# Common issues:
# - Database connection failed
# - Port already in use
# - Missing environment variables
# - Syntax errors in code
```

### 3. Wrong Port Configuration
**Symptom**: Backend running on different port than Nginx expects

**Solution**:
```bash
# Check what port backend is actually using
pm2 logs moh-ims-backend | grep "port"

# Update Nginx config to match, or update backend PORT in ecosystem.config.js
```

### 4. Database Connection Issues
**Symptom**: Backend can't connect to database

**Solution**:
```bash
# Check database is running
sudo systemctl status postgresql

# Test database connection
cd /opt/inventory/backend
node -e "require('dotenv').config({path: '../config/environments/backend.env'}); require('./config/db').connectDB().then(() => console.log('✅ Connected')).catch(e => console.error('❌ Failed:', e))"
```

### 5. Nginx Configuration Error
**Symptom**: Nginx test fails

**Solution**:
```bash
# Test configuration
sudo nginx -t

# Fix syntax errors shown
sudo nano /etc/nginx/sites-available/inventory

# Reload after fixing
sudo nginx -t && sudo systemctl reload nginx
```

### 6. Firewall Blocking
**Symptom**: Backend works locally but not through Nginx

**Solution**:
```bash
# Check if ports are open
sudo ufw status
sudo netstat -tuln | grep 5000
```

## Diagnostic Commands

Run these to get a full picture:

```bash
# 1. PM2 status
pm2 status
pm2 list

# 2. Backend logs
pm2 logs moh-ims-backend --lines 50

# 3. Port status
netstat -tuln | grep -E "5000|3000"

# 4. Nginx status
sudo systemctl status nginx
sudo nginx -t

# 5. Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# 6. Database status
sudo systemctl status postgresql

# 7. Test connections
curl -v http://localhost:5000/api/system/health
curl -v http://172.27.0.10/api/system/health
```

## Complete Reset (Last Resort)

If nothing else works:

```bash
# Stop everything
pm2 stop all
sudo systemctl stop nginx

# Restart backend
cd /opt/inventory  # or /var/www/inventory
pm2 restart ecosystem.config.js
# OR
cd backend
pm2 restart index.js --name moh-ims-backend

# Wait a few seconds
sleep 5

# Restart Nginx
sudo systemctl start nginx
sudo systemctl reload nginx

# Check status
pm2 status
curl http://localhost:5000/api/system/health
```

## Still Having Issues?

1. **Check all logs**:
   ```bash
   pm2 logs --lines 100
   sudo journalctl -u nginx -n 50
   ```

2. **Verify environment variables**:
   ```bash
   cd /opt/inventory/backend
   cat ../config/environments/backend.env | grep -E "PORT|DB_"
   ```

3. **Check file permissions**:
   ```bash
   ls -la /opt/inventory/backend/index.js
   ls -la /opt/inventory/ecosystem.config.js
   ```

4. **Verify Node.js version**:
   ```bash
   node --version  # Should be 18+ or 20 LTS
   ```

## Prevention

To prevent 502 errors in the future:

1. **Set up PM2 auto-restart**:
   ```bash
   pm2 startup
   pm2 save
   ```

2. **Monitor backend health**:
   ```bash
   pm2 monit
   ```

3. **Set up log rotation**:
   ```bash
   pm2 install pm2-logrotate
   ```

4. **Add health check endpoint** (already exists at `/api/system/health`)

5. **Configure proper timeouts in Nginx** (already added in updated config)

