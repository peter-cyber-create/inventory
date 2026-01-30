#!/bin/bash

# Remote Deployment Script
# This script connects to the server via SSH and runs the update-and-deploy script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_USER="${SERVER_USER:-$USER}"
SERVER_HOST="${SERVER_HOST:-172.27.0.10}"
APP_DIR="${APP_DIR:-/var/www/inventory}"

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if SSH is available
if ! command -v ssh &> /dev/null; then
    error "SSH is not installed. Please install OpenSSH client."
fi

log "🚀 Starting remote deployment..."
log "Server: ${SERVER_USER}@${SERVER_HOST}"
log "App Directory: ${APP_DIR}"
echo ""

# Test SSH connection
log "Testing SSH connection..."
if ssh -o ConnectTimeout=5 -o BatchMode=yes "${SERVER_USER}@${SERVER_HOST}" exit 2>/dev/null; then
    log "✅ SSH connection successful"
else
    warning "SSH connection test failed or requires password/key"
    info "You may be prompted for password or SSH key passphrase"
fi

# Run the update-and-deploy script on the server
log "📥 Connecting to server and running update script..."
echo ""

ssh "${SERVER_USER}@${SERVER_HOST}" << EOF
    set -e
    cd "${APP_DIR}"
    
    if [ ! -d ".git" ]; then
        echo "❌ Not a git repository. Please set up git first."
        exit 1
    fi
    
    echo "📥 Pulling latest changes..."
    git pull origin main
    
    echo "🔧 Running update-and-deploy script..."
    if [ -f "scripts/deployment/update-and-deploy.sh" ]; then
        chmod +x scripts/deployment/update-and-deploy.sh
        ./scripts/deployment/update-and-deploy.sh
    else
        echo "⚠️  update-and-deploy.sh not found. Running manual update..."
        
        # Manual update steps
        echo "📦 Installing dependencies..."
        npm install || true
        cd backend && npm install || true
        cd ../frontend && npm install || true
        cd ..
        
        echo "🏗️  Building frontend..."
        cd frontend && npm run build && cd ..
        
        echo "🔄 Running migrations..."
        cd backend && npx sequelize-cli db:migrate || true && cd ..
        
        echo "🔄 Restarting PM2 processes..."
        pm2 restart all || pm2 start ecosystem.config.js || true
        pm2 save || true
    fi
    
    echo ""
    echo "✅ Deployment completed on server!"
EOF

if [ $? -eq 0 ]; then
    log "✅ Remote deployment completed successfully!"
    echo ""
    info "Deployment Summary:"
    echo "  - Latest changes pulled from repository"
    echo "  - Dependencies updated"
    echo "  - Frontend built"
    echo "  - Database migrations run"
    echo "  - PM2 processes restarted"
    echo ""
    info "Check application status on server:"
    echo "  ssh ${SERVER_USER}@${SERVER_HOST} 'pm2 status'"
else
    error "Remote deployment failed. Check the output above for details."
fi

