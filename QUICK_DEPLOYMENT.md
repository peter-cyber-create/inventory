# ⚡ Quick Deployment Guide

## For New Server: confdb@172.27.0.10
# **Note**: Single-server deployment (application and database on same server)

### Prerequisites Check
```bash
# Check Node.js
node --version  # Should be 18+ (20 LTS recommended)

# Check PostgreSQL client
psql --version

# Check Git
git --version
```

### Quick Setup (Automated)
```bash
# Run the automated setup script
./scripts/deployment/setup-new-server.sh
```

### Manual Setup Steps

#### 1. Clone Repository
```bash
cd /opt
git clone <your-repo-url> inventory
cd inventory
```

#### 2. Install Dependencies
```bash
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

#### 3. Configure Environment

**Backend** (`config/environments/backend.env`):
```bash
# Database on same server, use localhost
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=inventory_user
DB_PASS=your_password_here
NODE_ENV=production
PORT=5000
```

**Frontend** (`frontend/.env.production`):
```bash
REACT_APP_API_BASE_URL_PROD=http://your-server-ip:5000
```

#### 4. Build & Deploy
```bash
# Build frontend
cd frontend && npm run build && cd ..

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
```

### Database Setup (Same Server)

```bash
# Install PostgreSQL (if not installed)
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
sudo -u postgres psql -c "CREATE DATABASE inventory_db;"
sudo -u postgres psql -c "CREATE USER inventory_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;"
sudo -u postgres psql -c "ALTER USER inventory_user CREATEDB;"
```

### Verify Deployment

```bash
# Check backend
curl http://localhost:5000/api/system/health

# Check frontend
curl http://localhost:3001

# Check PM2 status
pm2 status
```

### Common Issues

**Database Connection Failed:**
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check if PostgreSQL is installed: `which psql`
- Install if missing: `sudo apt install -y postgresql postgresql-contrib`
- Test connection: `psql -U inventory_user -d inventory_db -h localhost`
- Check postgres user exists: `sudo -u postgres psql -c '\du'`

**Port Already in Use:**
- Check what's using the port: `sudo lsof -i :5000`
- Kill process: `sudo kill -9 <PID>`

**Build Fails:**
- Clear cache: `cd frontend && rm -rf node_modules build && npm install && npm run build`

### Update Application

```bash
cd /opt/inventory
git pull origin main
cd backend && npm install && cd ..
cd frontend && npm install && npm run build && cd ..
pm2 restart all
```

---

For detailed instructions, see [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

