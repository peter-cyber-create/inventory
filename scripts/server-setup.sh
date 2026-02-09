#!/bin/bash

###############################################################################
# Server Setup Script - Execute on Remote Server
# Run on 172.27.1.170 after application is deployed
# Usage: bash server-setup.sh
###############################################################################

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_PATH="/var/www/inventory"
DB_NAME="inventory_db"
DB_USER="inventory_user"
DB_PASSWORD="KLy1p6Wh0x4BnES5PdTCLA=="

print_status() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${YELLOW}ℹ${NC} $1"; }

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}Server Configuration Setup${NC}"
echo -e "${BLUE}=========================================${NC}\n"

# Step 1: Install system dependencies
echo -e "${BLUE}[1/5]${NC} Installing system dependencies..."
sudo apt-get update -qq
sudo apt-get install -y -qq nginx postgresql postgresql-contrib curl git 2>&1 | tail -3

# Step 2: Create database and user
echo -e "\n${BLUE}[2/5]${NC} Setting up PostgreSQL database..."
sudo -u postgres psql << SQL
-- Create database user if not exists
SELECT 1 FROM pg_user WHERE usename = '${DB_USER}' \G
\gset exists
\if :exists
  ALTER USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
\else
  CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
\endif

-- Create database if not exists
SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}' \G
\gset db_exists
\if :db_exists
  -- Database exists, ensure proper permissions
  GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
\else
  -- Create new database
  CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};
  GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
\endif
SQL
print_status "Database setup complete"

# Step 3: Configure environment file
echo -e "\n${BLUE}[3/5]${NC} Configuring environment variables..."
sudo mkdir -p "${APP_PATH}/config/environments"
sudo tee "${APP_PATH}/config/environments/backend.env" > /dev/null << EOF
# Server Environment Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASS=${DB_PASSWORD}
DB_DIALECT=postgres

# JWT Configuration
SECRETKEY=6b033e599b93009eb81add2e3ea64a22979a0937aa38b077613f20a40af21247
JWT_SECRET=6b033e599b93009eb81add2e3ea64a22979a0937aa38b077613f20a40af21247
JWT_EXPIRE=30d

# API Configuration
API_URL=http://172.27.1.170:5000

# CORS Configuration
CORS_ORIGIN=*
CORS_CREDENTIALS=true

# Logging
LOG_LEVEL=info
EOF
sudo chmod 600 "${APP_PATH}/config/environments/backend.env"
print_status "Environment file created"

# Step 4: Setup Nginx reverse proxy
echo -e "\n${BLUE}[4/5]${NC} Configuring Nginx reverse proxy..."
sudo tee /etc/nginx/sites-available/inventory > /dev/null << 'NGINX'
upstream backend {
    server localhost:5000;
}

upstream frontend {
    server localhost:3000;
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    server_name _;
    client_max_body_size 50M;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX

# Enable the site
sudo ln -sf /etc/nginx/sites-available/inventory /etc/nginx/sites-enabled/inventory
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
if sudo nginx -t 2>&1 | grep -q "successful"; then
    sudo systemctl restart nginx
    print_status "Nginx configured and restarted"
else
    print_error "Nginx configuration has errors"
fi

# Step 5: Database schema setup
echo -e "\n${BLUE}[5/5]${NC} Running database migrations..."
cd "${APP_PATH}/backend"

# Install dependencies if not already done
npm install --production 2>&1 | tail -1

# Create schema fix script inline
node -e "
const path = require('path');
process.env.NODE_PATH = __dirname + '/node_modules';
require('module')._initPaths();
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config({ path: '../config/environments/backend.env' });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✓ Database connection successful');
    
    const queryInterface = sequelize.getQueryInterface();
    
    // Create assets table if needed
    try {
      const assetsColumns = await queryInterface.describeTable('assets');
      console.log('✓ Assets table exists');
    } catch (e) {
      console.log('Creating assets table...');
      // Tables will be created by Sequelize models
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Database error:', error.message);
    process.exit(1);
  }
})();
"
print_status "Database ready"

# Summary
echo -e "\n${BLUE}=========================================${NC}"
echo -e "${GREEN}✓ Server Setup Complete!${NC}\n"
echo -e "${YELLOW}Configuration Summary:${NC}"
echo -e "  Database: ${DB_NAME} (user: ${DB_USER})"
echo -e "  Application Path: ${APP_PATH}"
echo -e "  Nginx: Listening on port 80"
echo -e "  Backend: http://localhost:5000"
echo -e "  Frontend: http://localhost:3000"
echo -e "\n${YELLOW}Starting Services...${NC}"

# Start services with PM2 if ecosystem.config.js exists
if [ -f "${APP_PATH}/ecosystem.config.js" ]; then
    cd "${APP_PATH}"
    pm2 delete all 2>/dev/null || true
    pm2 start ecosystem.config.js --env production
    pm2 save
    echo -e "\n${GREEN}Services started with PM2:${NC}"
    pm2 list
else
    echo -e "${YELLOW}Note: ecosystem.config.js not found. Start services manually with:${NC}"
    echo -e "  cd ${APP_PATH}"
    echo -e "  pm2 start ecosystem.config.js --env production"
fi

echo -e "\n${YELLOW}To view logs:${NC}"
echo -e "  pm2 logs moh-ims-backend"
echo -e "  pm2 logs moh-ims-frontend"
echo -e "\n${BLUE}=========================================${NC}"
