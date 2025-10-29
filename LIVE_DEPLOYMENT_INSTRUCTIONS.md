# 🚀 MoH Uganda IMS - Live Server Deployment Instructions

## ✅ System Status: PRODUCTION READY

All runtime errors have been fixed and the system is now fully production-ready with:
- ✅ All stores module endpoints working correctly
- ✅ Form76A creation and management functional
- ✅ Database schema complete and tested
- ✅ Frontend and backend integration verified
- ✅ Production deployment scripts created
- ✅ Security configurations implemented

## 📋 Step-by-Step Live Server Deployment

### Prerequisites
- Ubuntu 20.04+ server with root access
- Minimum 4GB RAM, 20GB storage
- Internet connection

### Step 1: Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget git build-essential

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install PM2 globally
sudo npm install -g pm2
```

### Step 2: Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL shell, run:
CREATE DATABASE inventory_db;
CREATE USER inventory_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;
\q

# Configure PostgreSQL
sudo nano /etc/postgresql/*/main/postgresql.conf
# Uncomment: listen_addresses = 'localhost'

sudo systemctl restart postgresql
```

### Step 3: Application Deployment

```bash
# Clone the repository
cd /opt
sudo git clone https://github.com/peter-cyber-create/inventory.git moh-uganda-ims
sudo chown -R $USER:$USER moh-uganda-ims
cd moh-uganda-ims

# Make deployment script executable
chmod +x deploy-production.sh

# Run automated deployment
./deploy-production.sh
```

### Step 4: Configuration

```bash
# Edit production environment
nano production.env

# Update these critical values:
DB_PASS=your_secure_password_here
SECRETKEY=your_super_secret_jwt_key_here
CORS_ORIGIN=http://your-domain.com
```

### Step 5: Start Services

```bash
# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Check status
pm2 status
```

### Step 6: Verify Deployment

```bash
# Test backend health
curl http://localhost:5000/api/system/health

# Test frontend
curl http://localhost:3000

# Check logs
pm2 logs
```

## 🔧 Manual Deployment (Alternative)

If automated deployment fails, follow these manual steps:

### 1. Install Dependencies

```bash
cd /opt/moh-uganda-ims/backend
npm ci --production

cd ../frontend
npm ci --production
npm run build
```

### 2. Configure Environment

```bash
cp production.env backend/.env
nano backend/.env  # Edit database credentials
```

### 3. Initialize Database

```bash
cd backend
# Run database initialization scripts
psql -U inventory_user -d inventory_db -f complete-database-init.sql
```

### 4. Start Services

```bash
# Backend
cd backend
pm2 start index.js --name "moh-ims-backend"

# Frontend
cd ../frontend
npm install -g serve
pm2 start "serve -s build -l 3000" --name "moh-ims-frontend"

pm2 save
```

## 🌐 Access URLs

After successful deployment:

- **Frontend**: http://your-server-ip:3000
- **Backend API**: http://your-server-ip:5000
- **Health Check**: http://your-server-ip:5000/api/system/health
- **System Stats**: http://your-server-ip:5000/api/system/stats

## 🔐 Default Login Credentials

- **Username**: admin
- **Password**: admin123

**⚠️ IMPORTANT**: Change the admin password immediately after first login!

## 📊 Monitoring Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs

# Restart services
pm2 restart all

# Stop services
pm2 stop all

# Monitor resources
pm2 monit
```

## 🔄 Updates & Maintenance

### Updating the Application

```bash
cd /opt/moh-uganda-ims

# Backup current version
cp -r . ../backup-$(date +%Y%m%d)

# Pull updates
git pull origin main

# Update dependencies
cd backend && npm ci --production
cd ../frontend && npm ci --production && npm run build

# Restart services
pm2 restart all
```

### Database Backup

```bash
# Create backup
pg_dump -U inventory_user inventory_db > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U inventory_user inventory_db < backup_20240101.sql
```

## 🆘 Troubleshooting

### Common Issues & Solutions

1. **Port already in use**:
   ```bash
   sudo lsof -i :3000
   sudo lsof -i :5000
   sudo kill -9 <PID>
   ```

2. **Database connection failed**:
   ```bash
   sudo systemctl status postgresql
   sudo systemctl restart postgresql
   ```

3. **PM2 process not starting**:
   ```bash
   pm2 logs
   pm2 delete all
   pm2 start ecosystem.config.js
   ```

4. **Frontend build failed**:
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

### Log Locations

- **PM2 Logs**: `~/.pm2/logs/`
- **Application Logs**: `/var/log/moh-ims*.log`
- **System Logs**: `/var/log/syslog`

## 🔒 Security Checklist

- [ ] Changed default database password
- [ ] Set strong JWT secret key
- [ ] Configured firewall (ports 3000, 5000, 22)
- [ ] Set up SSL/HTTPS (recommended)
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Log monitoring enabled

## 📞 Support

For technical support:
1. Check logs: `pm2 logs`
2. Verify health: http://your-server:5000/api/system/health
3. Contact IT Support Team

---

## 🎉 Deployment Complete!

Your MoH Uganda IMS is now live and ready for production use!

**System Features Available**:
- ✅ User Management & Authentication
- ✅ ICT Assets Management
- ✅ Fleet Management
- ✅ Stores Management (Fully Functional)
- ✅ Finance & Activities
- ✅ Admin Dashboard
- ✅ System Health Monitoring
- ✅ Comprehensive Reporting

**Next Steps**:
1. Change default admin password
2. Configure SSL/HTTPS
3. Set up regular backups
4. Train users on the system
5. Monitor system performance

**Version**: 2.0.0  
**Status**: Production Ready ✅  
**Last Updated**: $(date)


