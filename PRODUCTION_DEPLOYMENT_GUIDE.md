# MoH Uganda IMS - Production Deployment Guide

## 🏥 Ministry of Health Uganda - Inventory Management System v2.0.0

This guide provides step-by-step instructions for deploying the MoH Uganda IMS to a production server.

## 📋 Prerequisites

### Server Requirements
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: Minimum 20GB free space
- **CPU**: 2+ cores

### Software Requirements
- **Node.js**: Version 18+ 
- **npm**: Version 8+
- **PostgreSQL**: Version 12+
- **Git**: Latest version
- **PM2**: Process manager (will be installed automatically)

## 🚀 Quick Deployment

### Option 1: Automated Deployment (Recommended)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/inventory.git
   cd inventory
   ```

2. **Run the deployment script**:
   ```bash
   chmod +x deploy-production.sh
   ./deploy-production.sh
   ```

3. **Access the application**:
   - Frontend: http://your-server-ip:3000
   - Backend API: http://your-server-ip:5000

### Option 2: Manual Deployment

#### Step 1: Server Setup

1. **Update system packages**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Node.js 18+**:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PostgreSQL**:
   ```bash
   sudo apt install postgresql postgresql-contrib -y
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

4. **Install Git**:
   ```bash
   sudo apt install git -y
   ```

#### Step 2: Database Setup

1. **Create database and user**:
   ```bash
   sudo -u postgres psql
   ```
   
   In PostgreSQL shell:
   ```sql
   CREATE DATABASE inventory_db;
   CREATE USER inventory_user WITH PASSWORD 'toor';
   GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;
   \q
   ```

2. **Configure PostgreSQL**:
   ```bash
   sudo nano /etc/postgresql/*/main/postgresql.conf
   ```
   
   Uncomment and set:
   ```
   listen_addresses = 'localhost'
   port = 5432
   ```

3. **Restart PostgreSQL**:
   ```bash
   sudo systemctl restart postgresql
   ```

#### Step 3: Application Deployment

1. **Clone repository**:
   ```bash
   cd /opt
   sudo git clone https://github.com/your-repo/inventory.git moh-uganda-ims
   sudo chown -R $USER:$USER moh-uganda-ims
   cd moh-uganda-ims
   ```

2. **Install dependencies**:
   ```bash
   # Backend
   cd backend
   npm ci --production
   
   # Frontend
   cd ../frontend
   npm ci --production
   npm run build
   ```

3. **Configure environment**:
   ```bash
   cp production.env backend/.env
   nano backend/.env  # Edit as needed
   ```

4. **Initialize database**:
   ```bash
   cd backend
   npm run migrate
   ```

#### Step 4: Process Management with PM2

1. **Install PM2**:
   ```bash
   npm install -g pm2
   ```

2. **Create PM2 ecosystem file**:
   ```bash
   nano ecosystem.config.js
   ```
   
   Use the provided `ecosystem.config.js` from the repository.

3. **Start application**:
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

## 🔧 Configuration

### Environment Variables

Edit `production.env` file:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=inventory_user
DB_PASS=your-secure-password

# Security
SECRETKEY=your-super-secret-production-key
CORS_ORIGIN=http://your-domain.com

# Server
PORT=5000
NODE_ENV=production
```

### Security Considerations

1. **Change default passwords**:
   - Database password
   - JWT secret key
   - Admin user password

2. **Configure firewall**:
   ```bash
   sudo ufw allow 22/tcp    # SSH
   sudo ufw allow 3000/tcp  # Frontend
   sudo ufw allow 5000/tcp  # Backend
   sudo ufw enable
   ```

3. **SSL/HTTPS Setup** (Recommended):
   ```bash
   sudo apt install certbot nginx -y
   # Configure SSL certificates
   ```

## 📊 Monitoring & Maintenance

### Health Checks

- **Backend Health**: http://your-server:5000/api/system/health
- **System Stats**: http://your-server:5000/api/system/stats

### Log Management

- **PM2 Logs**: `pm2 logs`
- **Application Logs**: `/var/log/moh-ims*.log`
- **Log Rotation**: Configured automatically

### Backup Strategy

1. **Database Backup**:
   ```bash
   pg_dump -U inventory_user inventory_db > backup_$(date +%Y%m%d).sql
   ```

2. **Application Backup**:
   ```bash
   tar -czf app_backup_$(date +%Y%m%d).tar.gz /opt/moh-uganda-ims
   ```

## 🔄 Updates & Maintenance

### Updating the Application

1. **Stop services**:
   ```bash
   pm2 stop all
   ```

2. **Backup current version**:
   ```bash
   cp -r /opt/moh-uganda-ims /opt/backups/backup_$(date +%Y%m%d)
   ```

3. **Pull updates**:
   ```bash
   cd /opt/moh-uganda-ims
   git pull origin main
   ```

4. **Update dependencies**:
   ```bash
   cd backend && npm ci --production
   cd ../frontend && npm ci --production && npm run build
   ```

5. **Restart services**:
   ```bash
   pm2 restart all
   ```

### Database Migrations

```bash
cd /opt/moh-uganda-ims/backend
npm run migrate
```

## 🆘 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   sudo lsof -i :3000
   sudo lsof -i :5000
   ```

2. **Database connection failed**:
   - Check PostgreSQL service: `sudo systemctl status postgresql`
   - Verify credentials in `.env` file
   - Check firewall settings

3. **PM2 process not starting**:
   ```bash
   pm2 logs
   pm2 restart all
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

## 📞 Support

For technical support or issues:

1. **Check logs**: `pm2 logs`
2. **Verify health**: http://your-server:5000/api/system/health
3. **Contact**: IT Support Team

## 🔐 Security Checklist

- [ ] Changed default database password
- [ ] Set strong JWT secret key
- [ ] Configured firewall rules
- [ ] Set up SSL/HTTPS
- [ ] Regular security updates
- [ ] Database backups configured
- [ ] Log monitoring enabled

## 📈 Performance Optimization

1. **Enable PM2 clustering** (already configured)
2. **Configure database connection pooling**
3. **Set up Redis for session storage** (optional)
4. **Enable gzip compression**
5. **Configure CDN** (optional)

---

**Version**: 2.0.0  
**Last Updated**: $(date)  
**Maintained by**: MoH Uganda IT Team
