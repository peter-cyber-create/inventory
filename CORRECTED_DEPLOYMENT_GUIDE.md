# ✅ CORRECTED DEPLOYMENT GUIDE
## Using `/var/www/inventory` on Server 172.27.1.170

---

## KEY UPDATE ⚠️

The application deploys to **`/var/www/inventory`** on the server, not `/home/frank/inventory-system`.

---

## DEPLOYMENT STEPS (Updated)

### **Step 1: Deploy to Server** 
From your local machine:
```bash
cd /home/peter/Desktop/Dev/inventory
bash deploy-to-server.sh
```

**What happens:**
- Creates `/var/www/inventory/` on server  
- Sets proper permissions (frank:frank)
- Uploads backend, frontend, config
- Installs npm dependencies
- Builds React production version
- Copies PM2 configuration

---

### **Step 2: Server Configuration**
SSH to server and run setup:
```bash
ssh frank@172.27.1.170

cd /var/www/inventory/scripts
bash server-setup.sh
```

**What happens:**
- Installs Nginx, PostgreSQL
- Creates database user & database
- Configures `/var/www/inventory/config/environments/backend.env`
- Sets up Nginx reverse proxy
- Initializes database schema
- Starts services with PM2

---

### **Step 3: Verify & Access**
```bash
# Check services
pm2 status

# View logs
pm2 logs

# Test API
curl http://localhost:5000/api/assets
curl http://localhost:3000

# Exit and test externally
exit

# From your machine
curl http://172.27.1.170
```

---

## APPLICATION LOCATION ON SERVER

```
/var/www/inventory/
├── backend/                    # API server
├── frontend/                   # React UI
│   └── build/                 # Production build
├── config/
│   └── environments/
│       └── backend.env        # Configuration
├── logs/                       # Application logs
└── ecosystem.config.js         # PM2 config
```

---

## IMPORTANT PATHS

| Item | Path | Owner |
|------|------|-------|
| App Directory | `/var/www/inventory` | frank:frank |
| Backend Config | `/var/www/inventory/config/environments/backend.env` | frank |
| Nginx Config | `/etc/nginx/sites-available/inventory` | root |
| PM2 Logs | `/var/www/inventory/.pm2/logs/` | frank |
| Backups | `/var/backups/` | root |

---

## SERVICE MANAGEMENT

All commands from remote server:

```bash
# Start services
pm2 start ecosystem.config.js --env production

# Stop services
pm2 stop all

# Restart services
pm2 restart all

# View status
pm2 status

# View logs
pm2 logs                      # All
pm2 logs moh-ims-backend     # Backend only
pm2 logs moh-ims-frontend    # Frontend only
```

---

## DATABASE ACCESS

```bash
# Connect to database
psql -U inventory_user -h localhost -d inventory_db

# Useful queries
SELECT count(*) FROM assets;          # Count assets
SELECT * FROM information_schema.tables WHERE table_schema='public';  # List tables
```

---

## TROUBLESHOOTING ON SERVER

### Check what's Running
```bash
pm2 status
ps aux | grep node
netstat -tlnp | grep -E '80|3000|5000'
```

### View Error Logs
```bash
pm2 logs --err                         # Errors only
pm2 logs moh-ims-backend --lines 50   # Last 50 lines
tail -f /var/www/inventory/backend/backend.log
```

### Restart Everything
```bash
pm2 kill
sleep 2
cd /var/www/inventory
pm2 start ecosystem.config.js --env production
pm2 save
```

### Check Database
```bash
psql -U inventory_user inventory_db -c "SELECT 1"
```

### Check Nginx
```bash
sudo systemctl status nginx
sudo nginx -t
sudo systemctl restart nginx
```

---

## ENVIRONMENT FILE

Location: `/var/www/inventory/config/environments/backend.env`

```dotenv
NODE_ENV=production
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=inventory_user
DB_PASS=KLy1p6Wh0x4BnES5PdTCLA==

SECRETKEY=6b033e599b93009eb81add2e3ea64a22979a0937aa38b077613f20a40af21247
JWT_SECRET=6b033e599b93009eb81add2e3ea64a22979a0937aa38b077613f20a40af21247
JWT_EXPIRE=30d

API_URL=http://172.27.1.170:5000
CORS_ORIGIN=*
CORS_CREDENTIALS=true
LOG_LEVEL=info
```

---

## QUICK REFERENCE

```bash
# After SSH: ssh frank@172.27.1.170

# Navigate to app
cd /var/www/inventory

# Check services
pm2 status

# View logs
pm2 logs

# Restart if needed
pm2 restart all

# Update permissions
sudo chown -R frank:frank /var/www/inventory

# View frontend
curl http://localhost:3000

# Test API
curl http://localhost:5000/api/assets
```

---

## POST-DEPLOYMENT CHECKLIST

After everything is running:

- [ ] Frontend loads at http://172.27.1.170
- [ ] Login works with admin/admin123
- [ ] All modules display (ICT Assets, Stores, Fleet, Finance, Activities)
- [ ] Forms load correctly
- [ ] Can create test records
- [ ] Database persists data
- [ ] PM2 status shows all apps online
- [ ] No errors in `pm2 logs`

---

## NOW YOU'RE READY! 🚀

The system is deployed and running on **`/var/www/inventory`** on server **172.27.1.170**

Access at: **http://172.27.1.170**

---

**Date Updated:** February 8, 2026  
**Path Corrected:** ✅ /var/www/inventory  
**Status:** Ready for Production ✅
