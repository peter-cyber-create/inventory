#!/bin/bash

# Update and Deploy Script
# This script pulls the latest changes and deploys them to the server

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="${APP_DIR:-/var/www/inventory}"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

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

# Check if we're in the app directory or if APP_DIR exists
if [ ! -d "$APP_DIR" ]; then
    error "Application directory not found: $APP_DIR"
fi

cd "$APP_DIR"

# Check if this is a git repository
if [ ! -d ".git" ]; then
    error "Not a git repository. Please clone the repository first."
fi

log "🚀 Starting update and deployment..."

# Step 1: Pull latest changes
log "📥 Pulling latest changes from repository..."
if git pull origin main; then
    log "✅ Successfully pulled latest changes"
else
    error "Failed to pull changes from repository"
fi

# Step 2: Install/update dependencies
log "📦 Installing/updating dependencies..."

log "Installing root dependencies..."
if npm install; then
    log "✅ Root dependencies installed"
else
    warning "Root dependencies installation had issues"
fi

log "Installing backend dependencies..."
cd "$BACKEND_DIR"
if npm install; then
    log "✅ Backend dependencies installed"
else
    warning "Backend dependencies installation had issues"
fi

log "Installing frontend dependencies..."
cd "$FRONTEND_DIR"
if npm install; then
    log "✅ Frontend dependencies installed"
else
    warning "Frontend dependencies installation had issues"
fi

cd "$APP_DIR"

# Step 3: Build frontend
log "🏗️  Building frontend for production..."
cd "$FRONTEND_DIR"
if npm run build; then
    log "✅ Frontend build completed"
else
    error "Frontend build failed"
fi

cd "$APP_DIR"

# Step 4: Run database migrations
log "🔄 Running database migrations..."
cd "$BACKEND_DIR"

# Load environment variables if available
if [ -f "../config/environments/backend.env" ]; then
    export $(grep -v '^#' ../config/environments/backend.env | xargs)
    log "✅ Environment variables loaded"
fi

# Run migrations
if command -v npx &> /dev/null; then
    if npx sequelize-cli db:migrate; then
        log "✅ Database migrations completed"
    else
        warning "Database migrations had issues. Check logs above."
    fi
else
    warning "npx not found. Skipping migrations. Run manually: cd backend && npx sequelize-cli db:migrate"
fi

cd "$APP_DIR"

# Step 5: Restart PM2 processes
log "🔄 Restarting application with PM2..."

if command -v pm2 &> /dev/null; then
    # Check if processes are running
    if pm2 list | grep -q "moh-ims-backend\|moh-ims-frontend"; then
        log "Restarting existing PM2 processes..."
        pm2 restart all
        log "✅ PM2 processes restarted"
    else
        log "Starting PM2 processes..."
        if [ -f "ecosystem.config.js" ]; then
            pm2 start ecosystem.config.js
            pm2 save
            log "✅ PM2 processes started"
        else
            warning "ecosystem.config.js not found. Please start processes manually."
        fi
    fi
    
    # Show status
    log "📊 Current PM2 status:"
    pm2 status
else
    warning "PM2 not found. Please restart the application manually."
fi

# Step 6: Health check
log "🏥 Performing health check..."
sleep 5

BACKEND_PORT="${BACKEND_PORT:-5000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"

if curl -f http://localhost:$BACKEND_PORT/api/system/health > /dev/null 2>&1; then
    log "✅ Backend health check passed"
else
    warning "Backend health check failed. Check logs: pm2 logs moh-ims-backend"
fi

if curl -f http://localhost:$FRONTEND_PORT > /dev/null 2>&1; then
    log "✅ Frontend health check passed"
else
    warning "Frontend health check failed. Check logs: pm2 logs moh-ims-frontend"
fi

# Summary
echo ""
log "✅ Update and deployment completed!"
echo ""
info "Useful commands:"
echo "  pm2 status          - Check application status"
echo "  pm2 logs            - View logs"
echo "  pm2 restart all     - Restart all applications"
echo ""
info "Access URLs:"
echo "  Frontend: http://localhost:$FRONTEND_PORT"
echo "  Backend API: http://localhost:$BACKEND_PORT/api"

