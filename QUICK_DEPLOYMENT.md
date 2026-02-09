# QUICK START - PRODUCTION DEPLOYMENT
## 3-Step Deployment to 172.27.1.170

---

## ✅ PRE-DEPLOYMENT CHECKLIST

All items completed:
- [x] Backend API tested and working
- [x] Frontend compiled successfully
- [x] Database schema fixed
- [x] Authentication verified
- [x] Deployment scripts created
- [x] Server prerequisites verified
- [x] Documentation complete

---

## DEPLOYMENT IN 3 STEPS

### **STEP 1: Deploy Application** (5-10 minutes)
```bash
cd /home/peter/Desktop/Dev/inventory

# Run automated deployment script
bash deploy-to-server.sh
```

**What this does:**
- Verifies SSH connectivity to 172.27.1.170
- Checks remote server environment
- Uploads backend, frontend, and config files
- Installs npm dependencies
- Builds React production version
- Configures PM2 process manager

---

### **STEP 2: Configure Server** (5-10 minutes)
```bash
# SSH to remote server
ssh frank@172.27.1.170

# Navigate to scripts  
cd /var/www/inventory/scripts

# Run server setup script
bash server-setup.sh
```

**What this does:**
- Installs system dependencies (Nginx, PostgreSQL)
- Creates and configures PostgreSQL database
- Sets up environment variables
- Configures Nginx reverse proxy
- Initializes database schema
- Starts services with PM2

---

### **STEP 3: Verify Deployment** (2-5 minutes)
```bash
# (Still on remote server)

# Check service status
pm2 status

# View service logs
pm2 logs

# Test endpoints
curl http://localhost:5000/api/assets
curl http://localhost:3000

# Exit and test via network
exit

# From your local machine
curl http://172.27.1.170               # Should show login page
curl http://172.27.1.170/api/assets    # Should get error (auth required)
```

---

## ACCESS AFTER DEPLOYMENT

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://172.27.1.170 | Web interface |
| API | http://172.27.1.170/api | All API endpoints |
| Backend Direct | http://172.27.1.170:5000 | Debug/direct access |

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

---

## IMMEDIATELY AVAILABLE

### For Frontend Users
1. Open http://172.27.1.170 in browser
2. Login with admin/admin123
3. Navigate all modules
4. Create, read, update, delete assets
5. Generate reports
6. Manage inventory

### For Developers
1. SSH Access: `ssh frank@172.27.1.170`
2. Application Path: `/var/www/inventory`
3. View Logs: `pm2 logs`
4. Manage Services: `pm2 [start|stop|restart|status]`
5. Database: `psql -U inventory_user -d inventory_db`

---

## TROUBLESHOOTING QUICK FIXES

### Services Not Starting
```bash
ssh frank@172.27.1.170
cd /var/www/inventory
pm2 delete all
pm2 start ecosystem.config.js --env production
pm2 save
```

### Database Connection Issues  
```bash
# Check PostgreSQL
sudo systemctl status postgresql

# Test connection
psql -U inventory_user inventory_db

# Check env file
cat config/environments/backend.env
```

### Frontend Shows Blank Page
```bash
# Check if build exists
ls -la /var/www/inventory/frontend/build/

# Check nginx
sudo systemctl status nginx
sudo nginx -t
```

### Clear Cache & Restart
```bash
pm2 flush
pm2 kill
cd /var/www/inventory
pm2 start ecosystem.config.js --env production
pm2 save
```

---

## POST-DEPLOYMENT TASKS

### Essential ✅
1. Test login with admin account
2. Verify all modules loading
3. Test data creation (add test asset)
4. Confirm database saving data

### Recommended ⭐
1. Change admin password
2. Create user accounts for team
3. Setup daily backups
4. Configure email settings
5. Test backup/restore procedures

### Optional 🎯
1. Setup SSL certificate (Let's Encrypt)
2. Configure monitoring
3. Setup automated backups
4. Configure CDN for assets
5. Setup rate limiting

---

## MONITORING COMMANDS

```bash
# Check all services
pm2 status

# View logs
pm2 logs                    # All
pm2 logs moh-ims-backend   # Backend only
pm2 logs moh-ims-frontend  # Frontend only

# System resources  
free -h                     # Memory
df -h                       # Disk
top -b -n1 | head -10      # CPU

# Process info
ps aux | grep node
netstat -tlnp | grep -E '80|3000|5000'

# Database check
psql -U inventory_user inventory_db -c "SELECT count(*) FROM assets;"
```

---

### Rollback If Needed

```bash
# Stop current deployment
ssh frank@172.27.1.170
pm2 stop all

# Remove current version
sudo rm -rf /var/www/inventory

# Restore from backup (if available)
sudo tar -xzf /var/backups/inventory-system-backup.tar.gz -C /var/www/

# Fix permissions
sudo chown -R frank:frank /var/www/inventory

# Restart services
cd /var/www/inventory
pm2 start ecosystem.config.js --env production
```

---

## IMPORTANT FILES

| File | Location | Purpose |
|------|----------|---------|
| Backend Config | `/var/www/inventory/config/environments/backend.env` | Database & API settings |
| Nginx Config | `/etc/nginx/sites-available/inventory` | Reverse proxy |
| PM2 Config | `/var/www/inventory/ecosystem.config.js` | Process management |
| Database | PostgreSQL on localhost | Data storage |
| Logs | `/var/www/inventory/logs/` | Application logs |

---

## SUPPORT

### If Something Goes Wrong
1. Check logs: `pm2 logs`
2. Check services: `pm2 status`
3. Check database: `psql -U inventory_user inventory_db`
4. Check system: `free -h`, `df -h`
5. Restart all: `pm2 restart all`

### Reference Documents
- [SERVER_DEPLOYMENT_GUIDE.md](./SERVER_DEPLOYMENT_GUIDE.md) - Complete guide
- [COMPREHENSIVE_STATUS_REPORT.md](./COMPREHENSIVE_STATUS_REPORT.md) - Full status
- [SYSTEM_RESOLUTION_REPORT.md](./SYSTEM_RESOLUTION_REPORT.md) - What was fixed

---

## TIMELINE ESTIMATE

| Step | Time | Status |
|------|------|--------|
| Deploy App | 5-10 min | Ready ✅ |
| Server Setup | 5-10 min | Ready ✅ |
| Verification | 2-5 min | Ready ✅ |
| **Total** | **15-30 min** | **Go Now!** ✅ |

---

## START DEPLOYMENT NOW

```bash
cd /home/peter/Desktop/Dev/inventory
bash deploy-to-server.sh
```

That's it! Follow the prompts and your system will be deployed.

---

**Status:** 🟢 READY FOR PRODUCTION DEPLOYMENT  
**Date:** February 8, 2026  
**Systems:** ✅ All Verified  

**Let's deploy! 🚀**
