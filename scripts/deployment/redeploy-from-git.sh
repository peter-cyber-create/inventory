#!/bin/bash

# Redeploy script to sync latest code, rebuild, and restart services

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

if [[ $EUID -eq 0 ]]; then
    warning "Running as root is not recommended. Continue? (y/N)"
    read -r CONTINUE_ROOT
    if [[ ! "$CONTINUE_ROOT" =~ ^[Yy]$ ]]; then
        error "Aborting."
        exit 1
    fi
fi

APP_DIR="${APP_DIR:-/var/www/inventory}"
BRANCH="${BRANCH:-main}"
BACKEND_PORT="${BACKEND_PORT:-5000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"

log "Using application directory: $APP_DIR"

if [ ! -d "$APP_DIR/.git" ]; then
    error "No git repository found in $APP_DIR"
    exit 1
fi

cd "$APP_DIR"

log "Fetching latest code..."
git fetch origin
git checkout "$BRANCH"
git pull origin "$BRANCH"

log "Installing root dependencies..."
npm install

log "Installing backend dependencies..."
(cd backend && npm install)

log "Installing frontend dependencies..."
(cd frontend && npm install)

log "Building frontend..."
(cd frontend && npm run build)

if [ ! -f "ecosystem.config.js" ]; then
    error "ecosystem.config.js not found. Please run setup script first."
    exit 1
fi

log "Ensuring logs directory exists..."
mkdir -p "$APP_DIR/logs"

log "Restarting applications with PM2..."
pm2 start ecosystem.config.js
pm2 save

log "Waiting for services to stabilize..."
sleep 5

log "Performing health checks..."
if curl -f "http://localhost:${BACKEND_PORT}/api/system/health" > /dev/null 2>&1; then
    log "Backend health check passed ✅"
else
    warning "Backend health check failed. Check: pm2 logs moh-ims-backend"
fi

if curl -f "http://localhost:${FRONTEND_PORT}" > /dev/null 2>&1; then
    log "Frontend health check passed ✅"
else
    warning "Frontend health check failed. Check: pm2 logs moh-ims-frontend"
fi

log "Redeploy completed successfully."

