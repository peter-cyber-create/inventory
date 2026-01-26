#!/bin/bash

# Script to initialize git on an existing server deployment
# This connects an existing deployment to the git repository

set -e

APP_DIR="${APP_DIR:-/var/www/inventory}"
REPO_URL="${REPO_URL:-https://github.com/peter-cyber-create/inventory.git}"

echo "🔧 Setting up git repository on existing deployment..."
echo ""

cd "$APP_DIR"

# Check if .git already exists
if [ -d ".git" ]; then
    echo "✅ Git repository already exists"
    git remote -v
    exit 0
fi

# Backup important files that shouldn't be overwritten
echo "📦 Backing up configuration files..."
BACKUP_DIR="/tmp/inventory-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup environment files and configs
if [ -f "config/environments/backend.env" ]; then
    cp "config/environments/backend.env" "$BACKUP_DIR/"
    echo "✅ Backed up backend.env"
fi

if [ -f "production.env" ]; then
    cp "production.env" "$BACKUP_DIR/"
    echo "✅ Backed up production.env"
fi

if [ -f "ecosystem.config.js" ]; then
    cp "ecosystem.config.js" "$BACKUP_DIR/"
    echo "✅ Backed up ecosystem.config.js"
fi

if [ -d "backend/uploads" ]; then
    echo "⚠️  Note: backend/uploads directory exists (will be preserved)"
fi

echo ""
echo "🔗 Initializing git repository..."

# Initialize git
git init
git remote add origin "$REPO_URL" || git remote set-url origin "$REPO_URL"

# Fetch from remote
echo "📥 Fetching from remote repository..."
git fetch origin

# Checkout main branch (this will overwrite files, but we have backups)
echo "📦 Checking out main branch..."
git checkout -b main origin/main || git checkout main

echo ""
echo "✅ Git repository initialized!"
echo ""
echo "📋 Restoring backed up configuration files..."

# Restore backed up files
if [ -f "$BACKUP_DIR/backend.env" ]; then
    cp "$BACKUP_DIR/backend.env" "config/environments/backend.env"
    echo "✅ Restored backend.env"
fi

if [ -f "$BACKUP_DIR/production.env" ]; then
    cp "$BACKUP_DIR/production.env" "production.env"
    echo "✅ Restored production.env"
fi

if [ -f "$BACKUP_DIR/ecosystem.config.js" ]; then
    cp "$BACKUP_DIR/ecosystem.config.js" "ecosystem.config.js"
    echo "✅ Restored ecosystem.config.js"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Backup location: $BACKUP_DIR"
echo ""
echo "You can now use:"
echo "  git pull origin main  # To update from repository"
echo "  git status            # To check status"

