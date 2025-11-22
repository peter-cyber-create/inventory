# 🖥️ Single Server Deployment Guide

## Overview

This deployment uses **one server** for both the application and database. The server is `confdb@172.27.0.10`.

## Quick Setup

### 1. Install PostgreSQL (if not installed)

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
sudo systemctl status postgresql
```

### 2. Create Database and User

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE inventory_db;
CREATE USER inventory_user WITH PASSWORD 'your_secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;
ALTER USER inventory_user CREATEDB;
\q
```

### 3. Configure Application

**Backend Environment** (`config/environments/backend.env`):
```bash
# Database on same server - use localhost
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=inventory_user
DB_PASS=your_secure_password_here
NODE_ENV=production
PORT=5000
```

### 4. Test Database Connection

```bash
# Test connection
psql -U inventory_user -d inventory_db -h localhost

# If connection works, you'll see the PostgreSQL prompt
# Type \q to exit
```

## Troubleshooting

### Error: "unknown user postgres"

This means PostgreSQL is not installed. Install it:

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Error: "password authentication failed"

1. Verify the user exists:
   ```bash
   sudo -u postgres psql -c '\du'
   ```

2. Reset password if needed:
   ```bash
   sudo -u postgres psql -c "ALTER USER inventory_user WITH PASSWORD 'new_password';"
   ```

### Error: "database does not exist"

Create the database:
```bash
sudo -u postgres psql -c "CREATE DATABASE inventory_db;"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;"
```

## Key Differences from Multi-Server Setup

| Multi-Server | Single-Server |
|--------------|---------------|
| `DB_HOST=172.27.0.10` | `DB_HOST=localhost` |
| Database on separate server | Database on same server |
| Need network access | Local connection only |
| Configure remote access | No remote config needed |

## Next Steps

After setting up the database:
1. Continue with application deployment (see `DEPLOYMENT_GUIDE.md`)
2. Configure environment variables
3. Build and start the application

---

**Remember**: Since everything is on one server, use `localhost` for database connections, not the server IP address.

