#!/bin/bash

# Quick Deployment Script
# This script clones the repository and runs the setup script

set -e

# Configuration (can be overridden with environment variables)
SERVER_IP="${SERVER_IP:-172.27.0.10}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
BACKEND_PORT="${BACKEND_PORT:-5000}"
APP_DIR="${APP_DIR:-/var/www/inventory}"
REPO_URL="${REPO_URL:-https://github.com/peter-cyber-create/inventory.git}"

echo "🚀 Starting Deployment for MoH Uganda IMS..."
echo "Configuration:"
echo "  Server IP: $SERVER_IP"
echo "  Frontend Port: $FRONTEND_PORT"
echo "  Backend Port: $BACKEND_PORT"
echo "  App Directory: $APP_DIR"
echo ""

# Export variables for the setup script
export SERVER_IP FRONTEND_PORT BACKEND_PORT APP_DIR

# Clone or update repository
if [ -d "$APP_DIR/.git" ]; then
    echo "📦 Repository exists, updating..."
    cd "$APP_DIR"
    git pull origin main
else
    echo "📦 Cloning repository..."
    sudo mkdir -p "$(dirname $APP_DIR)"
    sudo git clone "$REPO_URL" "$APP_DIR"
    sudo chown -R $USER:$USER "$APP_DIR"
    cd "$APP_DIR"
fi

# Make setup script executable and run
echo "🔧 Running setup script..."
chmod +x scripts/deployment/setup-new-server.sh
./scripts/deployment/setup-new-server.sh

echo ""
echo "✅ Deployment completed!"
echo ""
echo "Access your application at:"
echo "  Frontend: http://$SERVER_IP:$FRONTEND_PORT"
echo "  Backend: http://$SERVER_IP:$BACKEND_PORT/api"
