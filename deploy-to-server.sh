#!/bin/bash

###############################################################################
# MOH Uganda Inventory Management System - Server Deployment Script
# Purpose: Deploy the application to production server (172.27.1.170)
# Usage: bash deploy-to-server.sh
###############################################################################

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REMOTE_USER="frank"
REMOTE_HOST="172.27.1.170"
REMOTE_PATH="/var/www/inventory"
LOCAL_PATH="$(pwd)"
APP_PORT=5000
FRONTEND_PORT=3000

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}MOH Inventory System - Server Deployment${NC}"
echo -e "${BLUE}=========================================${NC}\n"

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${YELLOW}ℹ${NC} $1"
}

# Step 1: Check local prerequisites
echo -e "${BLUE}[1/7]${NC} Checking local prerequisites..."
if ! command -v ssh &> /dev/null; then
    print_error "SSH is not installed"
    exit 1
fi
if ! command -v scp &> /dev/null; then
    print_error "SCP is not installed"
    exit 1
fi
print_status "SSH and SCP available"

# Step 2: Check remote server connectivity
echo -e "\n${BLUE}[2/7]${NC} Testing connection to remote server..."
if ssh -o ConnectTimeout=5 "${REMOTE_USER}@${REMOTE_HOST}" "echo 'SSH connection successful'" &> /dev/null; then
    print_status "Connected to ${REMOTE_HOST}"
else
    print_error "Cannot connect to ${REMOTE_HOST}"
    exit 1
fi

# Step 3: Check remote environment
echo -e "\n${BLUE}[3/7]${NC} Checking remote server environment..."
REMOTE_ENV=$(ssh "${REMOTE_USER}@${REMOTE_HOST}" "node --version && npm --version && pm2 --version" 2>&1)
echo -e "$REMOTE_ENV" | while read line; do
    print_status "$line"
done

# Step 4: Create remote directory structure
echo -e "\n${BLUE}[4/7]${NC} Setting up remote directories..."
ssh "${REMOTE_USER}@${REMOTE_HOST}" << 'EOF'
    sudo mkdir -p /var/www/inventory/{backend,frontend,config,logs}
    sudo chown -R frank:frank /var/www/inventory
    echo "Directories created successfully"
EOF
print_status "Remote directories created"

# Step 5: Upload application files
echo -e "\n${BLUE}[5/7]${NC} Uploading application files..."
print_info "Uploading backend..."
rsync -avz --exclude='node_modules' --exclude='.git' \
    "${LOCAL_PATH}/backend/" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/backend/" 2>&1 | tail -5
print_status "Backend uploaded"

print_info "Uploading frontend..."
rsync -avz --exclude='node_modules' --exclude='.git' --exclude='build' \
    "${LOCAL_PATH}/frontend/" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/frontend/" 2>&1 | tail -5
print_status "Frontend uploaded"

print_info "Uploading configuration..."
rsync -avz "${LOCAL_PATH}/config/" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/config/" 2>&1 | tail -3
print_status "Configuration uploaded"

# Step 6: Install dependencies and build
echo -e "\n${BLUE}[6/7]${NC} Installing dependencies and building..."
ssh "${REMOTE_USER}@${REMOTE_HOST}" << 'EOF'
    cd /var/www/inventory
    
    echo "Installing backend dependencies..."
    cd backend && npm install --production 2>&1 | tail -3
    echo "Backend dependencies installed"
    
    echo "Installing frontend dependencies..."
    cd ../frontend && npm install 2>&1 | tail -3
    echo "Building React application..."
    CI=false npm run build 2>&1 | tail -5
    echo "Frontend build complete"
EOF
print_status "Dependencies installed and frontend built"

# Step 7: Configure PM2 and start services
echo -e "\n${BLUE}[7/7]${NC} Configuring and starting services..."
scp "${LOCAL_PATH}/ecosystem.config.js" "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/" 2>&1 | grep -v "^$"
print_status "PM2 configuration copied"

ssh "${REMOTE_USER}@${REMOTE_HOST}" << 'EOF'
    cd /var/www/inventory
    
    # Stop any existing PM2 apps
    pm2 delete all 2>/dev/null || true
    
    # Start services with PM2
    pm2 start ecosystem.config.js --env production
    
    # Save PM2 configuration
    pm2 save
    
    # Enable PM2 startup on boot
    pm2 startup systemd
    
    echo ""
    echo "Services started. Current status:"
    pm2 list
EOF
print_status "Services configured and started"

# Final summary
echo -e "\n${BLUE}=========================================${NC}"
echo -e "${GREEN}✓ Deployment Complete!${NC}\n"
echo -e "${YELLOW}Server Setup Summary:${NC}"
echo -e "  Host: ${REMOTE_HOST}"
echo -e "  Backend URL: http://${REMOTE_HOST}:${APP_PORT}"
echo -e "  Frontend URL: http://${REMOTE_HOST}:${FRONTEND_PORT}"
echo -e "  App Path: ${REMOTE_PATH}"
echo -e "\n${YELLOW}Next Steps:${NC}"
echo -e "  1. SSH into server: ssh ${REMOTE_USER}@${REMOTE_HOST}"
echo -e "  2. Run server setup: cd /var/www/inventory/scripts && bash server-setup.sh"
echo -e "  3. Check service status: pm2 status"
echo -e "  4. View logs: pm2 logs"
echo -e "  5. Access system: http://172.27.1.170"
echo -e "\n${BLUE}=========================================${NC}"
