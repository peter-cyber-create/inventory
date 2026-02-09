# MOH Uganda Inventory Management System - Deployment Guide

## Executive Summary

✅ **All Issues Resolved:**
- Failed to load assets: ✅ FIXED
- Data retrieval: ✅ WORKING  
- Forms display: ✅ WORKING
- Backend API: ✅ OPERATIONAL
- Database schema: ✅ CORRECTED

---

## Current Status - Local Development

### Services Running ✅
| Service | Status | Port | URL |
|---------|--------|------|-----|
| Backend API | ✅ Running | 5000 | http://localhost:5000 |
| Frontend | ✅ Running | 3000 | http://localhost:3000 |
| PostgreSQL | ✅ Connected | 5432 | localhost |
| PM2 | ✅ Ready | - | Process manager |

### Database Schema ✅
All required columns added:
- assets table: 30+ columns including all foreign keys
- audit_log table: Complete with audit tracking
- Category, Brand, Type, Staff, Department, Division tables: All verified

### API Endpoints Verified ✅
- `/api/users/login` - ✅ JWT authentication working
- `/api/assets` - ✅ Data retrieval functional
- `/api/category` - ✅ Ready for data
- All protected routes - ✅ Bearer token authentication

---

## Server Deployment Instructions

### Remote Server Specifications
- **Host:** 172.27.1.170 (Ubuntu 22.04.5 LTS)
- **User:** frank
- **Node.js:** v22.22.0 ✅
- **npm:** 11.8.0 ✅
- **PostgreSQL:** 14.20 ✅
- **PM2:** 6.0.14 ✅

### Quick Start - Production Deployment

#### Step 1: Prepare and Deploy
From your local machine in the inventory directory:

```bash
# Make deployment script executable
chmod +x deploy-to-server.sh

# Run deployment script
bash deploy-to-server.sh
```

This script will:
1. Verify SSH connectivity
2. Check remote server prerequisites
3. Create directory structure
4. Upload backend, frontend, and config
5. Install dependencies
6. Build frontend production version
7. Configure PM2

#### Step 2: Complete Server Setup (On Remote Server)
After deployment, SSH to the server and run:

```bash
ssh frank@172.27.1.170
cd /home/frank/inventory-system/scripts
chmod +x server-setup.sh
bash server-setup.sh
```

This script will:
1. Install system dependencies (Nginx, PostgreSQL-contrib)
2. Setup PostgreSQL database and user
3. Configure environment variables
4. Setup Nginx reverse proxy
5. Initialize database schema
6. Start services with PM2

#### Step 3: Verify Deployment
```bash
# On remote server
pm2 status                           # Check service status
pm2 logs moh-ims-backend            # View backend logs
pm2 logs moh-ims-frontend           # View frontend logs
curl http://localhost:5000/api/health   # Test API
curl http://localhost:3000          # Test Frontend
curl http://172.27.1.170            # Test via Nginx
```

---

## File Structure on Server

```
/var/www/inventory/
├── backend/                 # Node.js API server
│   ├── index.js
│   ├── package.json
│   ├── config/
│   ├── models/
│   ├── routes/
│   └── node_modules/
├── frontend/               # React application
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── build/              # Production build
│   └── node_modules/
├── config/
│   └── environments/
│       └── backend.env     # Server configuration
├── logs/                   # Application logs
├── ecosystem.config.js     # PM2 configuration
└── scripts/
    └── server-setup.sh     # Server initialization
```

---

## Environment Configuration

### Server Environment Variables
Location: `/home/frank/inventory-system/config/environments/backend.env`

```dotenv
# Server
NODE_ENV=production
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=inventory_user
DB_PASS=KLy1p6Wh0x4BnES5PdTCLA==
DB_DIALECT=postgres

# JWT
SECRETKEY=6b033e599b93009eb81add2e3ea64a22979a0937aa38b077613f20a40af21247
JWT_SECRET=6b033e599b93009eb81add2e3ea64a22979a0937aa38b077613f20a40af21247
JWT_EXPIRE=30d

# API
API_URL=http://172.27.1.170:5000

# CORS
CORS_ORIGIN=*
CORS_CREDENTIALS=true

# Logging
LOG_LEVEL=info
```

---

## Service Management

### Start Services
```bash
pm2 start ecosystem.config.js --env production
```

### Stop Services
```bash
pm2 stop all
```

### Restart Services
```bash
pm2 restart all
```

### View Status
```bash
pm2 status
```

### View Logs
```bash
pm2 logs                    # All services
pm2 logs moh-ims-backend   # Backend only
pm2 logs moh-ims-frontend  # Frontend only
pm2 logs --lines 100       # Last 100 lines
```

### Enable Auto-Start on Boot
```bash
pm2 startup systemd
pm2 save
```

---

## Nginx Configuration

The deployment includes Nginx reverse proxy configuration:

- **Frontend:** Routes `/` to React app (port 3000)
- **API:** Routes `/api/` to Node.js backend (port 5000)
- **Static files:** 30-day caching
- **Client uploads:** 50MB limit

Configuration location: `/etc/nginx/sites-available/inventory`

### Restart Nginx
```bash
sudo systemctl restart nginx
```

### Check Nginx Status
```bash
sudo systemctl status nginx
```

---

## Troubleshooting

### Services Won't Start
```bash
# Check logs
pm2 logs

# Verify dependencies installed
npm ls --depth=0

# Manually test backend
cd backend && NODE_ENV=production node index.js
```

### Database Connection Failed
```bash
# Test PostgreSQL connection
psql -U inventory_user -h localhost -d inventory_db

# Check if PostgreSQL is running
sudo systemctl status postgresql

# Verify credentials in backend.env
cat config/environments/backend.env
```

### Assets Not Loading
1. Check backend is running: `pm2 status`
2. Test API directly: `curl http://localhost:5000/api/assets`
3. Check database schema: Run `/scripts/fix-assets-complete.js`
4. View backend logs: `pm2 logs moh-ims-backend`

### Frontend Not Rendering
1. Check frontend process: `pm2 status`
2. Test frontend: `curl http://localhost:3000`
3. Check frontend logs: `pm2 logs moh-ims-frontend`
4. Verify build: `ls -la frontend/build/`

### Nginx Issues
```bash
# Test configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log

# Restart service
sudo systemctl restart nginx
```

---

## Maintenance

### Regular Tasks

**Weekly:**
- Monitor PM2 logs for errors
- Check disk space: `df -h`
- Monitor memory: `free -h`

**Monthly:**
- Database backups: `pg_dump inventory_db > backup.sql`
- Review application logs
- Check for system updates: `apt list --upgradable`

**Quarterly:**
- Update dependencies: `npm update`
- Security audit: `npm audit`
- System updates: `sudo apt update && sudo apt upgrade`

---

## Backup & Recovery

### Database Backup
```bash
# Backup
pg_dump -U inventory_user inventory_db > /home/frank/backups/inventory_db_$(date +%Y%m%d).sql

# Restore
psql -U inventory_user inventory_db < /home/frank/backups/inventory_db_20260208.sql
```

### Application Backup
```bash
# Backup application directory
tar -czf inventory-system-$(date +%Y%m%d).tar.gz /home/frank/inventory-system/

# Store safely
mv inventory-system-*.tar.gz /backup/location/
```

---

## Performance Optimization

### Enable PM2 Clustering (Optional)
For multi-core systems, update `ecosystem.config.js`:
```javascript
instances: 'max',        // Use all CPU cores
instance_var: 'INSTANCE_ID'
```

### Database Optimization
```bash
# Connect to PostgreSQL
psql -U inventory_user inventory_db

# Analyze and vacuum
ANALYZE;
VACUUM;

# Check table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Monitoring & Health Checks

### API Health Check
```bash
curl http://172.27.1.170:5000/api/system/health
```

Expected response:
```json
{
  "status": "success",
  "timestamp": "2026-02-08T14:00:00Z"
}
```

### System Health
```bash
# On remote server
echo "=== System Status ===" && \
df -h | head -2 && \
free -h | head -2 && \
pm2 status && \
sudo systemctl status nginx
```

---

## Rollback Procedures

If deployment fails:

```bash
# Stop and delete PM2 apps
pm2 stop all
pm2 delete all

# Restore from backup
cd /home/frank
rm -rf inventory-system
tar -xzf /backup/inventory-system-previous.tar.gz

# Restart services
cd inventory-system
pm2 start ecosystem.config.js --env production
```

---

## Success Indicators ✅

After deployment, verify:

1. **Frontend accessible:** http://172.27.1.170 loads login page
2. **Login works:** Admin credentials authenticate successfully  
3. **Forms display:** All module pages show forms
4. **Assets load:** Asset lists populate with data
5. **API responds:** `curl http://172.27.1.170/api/category` returns data
6. **Services running:** `pm2 status` shows all apps online
7. **Database connected:** Data persists across page refreshes
8. **No errors in logs:** `pm2 logs` shows no error messages

---

## Support & Debugging

For detailed debugging:

```bash
# Enable verbose logging
NODE_ENV=production DEBUG=* node /var/www/inventory/backend/index.js

# Check system resources
top
htop

# Network connectivity
netstat -tlnp | grep -E '5000|3000|80'

# Database queries log
sudo tail -f /var/log/postgresql/postgresql-*.log
```

---

**Deployment Version:** 1.0  
**Last Updated:** February 8, 2026  
**Status:** Ready for Production Deployment ✅
