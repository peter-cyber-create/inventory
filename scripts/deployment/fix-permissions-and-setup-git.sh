#!/bin/bash

# Script to fix permissions and set up git on server
# Run this script on the server

set -e

APP_DIR="${APP_DIR:-/var/www/inventory}"
REPO_URL="${REPO_URL:-https://github.com/peter-cyber-create/inventory.git}"

echo "🔧 Fixing permissions and setting up git..."
echo ""

# Check current user
CURRENT_USER=$(whoami)
echo "Current user: $CURRENT_USER"

# Check directory ownership
echo "Checking directory ownership..."
ls -ld "$APP_DIR" || {
    echo "❌ Directory $APP_DIR does not exist"
    exit 1
}

# Fix ownership (run with sudo if needed)
echo ""
echo "📝 Fixing ownership of $APP_DIR..."
echo "   (You may need to run: sudo chown -R $CURRENT_USER:$CURRENT_USER $APP_DIR)"

# Check if we can write to the directory
if [ ! -w "$APP_DIR" ]; then
    echo "⚠️  Cannot write to $APP_DIR"
    echo "   Please run: sudo chown -R $CURRENT_USER:$CURRENT_USER $APP_DIR"
    echo "   Or run this script with appropriate permissions"
    exit 1
fi

cd "$APP_DIR"

# Backup important files
echo ""
echo "📦 Backing up configuration files..."
BACKUP_DIR="/tmp/inventory-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

if [ -f "config/environments/backend.env" ]; then
    cp "config/environments/backend.env" "$BACKUP_DIR/" && echo "✅ Backed up backend.env"
fi

if [ -f "production.env" ]; then
    cp "production.env" "$BACKUP_DIR/" && echo "✅ Backed up production.env"
fi

if [ -f "ecosystem.config.js" ]; then
    cp "ecosystem.config.js" "$BACKUP_DIR/" && echo "✅ Backed up ecosystem.config.js"
fi

echo "Backup location: $BACKUP_DIR"
echo ""

# Initialize git
echo "🔗 Initializing git repository..."
git init

# Add remote
echo "📡 Adding remote repository..."
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

# Fetch
echo "📥 Fetching from remote..."
git fetch origin

# Checkout
echo "📦 Checking out main branch..."
git checkout -b main origin/main || git checkout main

echo ""
echo "✅ Git repository initialized!"
echo ""

# Restore backed up files
echo "📋 Restoring configuration files..."
if [ -f "$BACKUP_DIR/backend.env" ]; then
    cp "$BACKUP_DIR/backend.env" "config/environments/backend.env" && echo "✅ Restored backend.env"
fi

if [ -f "$BACKUP_DIR/production.env" ]; then
    cp "$BACKUP_DIR/production.env" "production.env" && echo "✅ Restored production.env"
fi

if [ -f "$BACKUP_DIR/ecosystem.config.js" ]; then
    cp "$BACKUP_DIR/ecosystem.config.js" "ecosystem.config.js" && echo "✅ Restored ecosystem.config.js"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "You can now run:"
echo "  git pull origin main"
echo "  git status"

