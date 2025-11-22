#!/bin/bash

# Migration script to move application from /opt/inventory to /var/www/inventory

set -e

echo "🔄 Migrating application from /opt/inventory to /var/www/inventory..."
echo ""

# Stop PM2 processes
echo "1. Stopping PM2 processes..."
pm2 delete all 2>/dev/null || true
pm2 kill 2>/dev/null || true

# Create new directory
echo "2. Creating /var/www/inventory directory..."
sudo mkdir -p /var/www/inventory
sudo chown -R $USER:$USER /var/www/inventory

# Move application
echo "3. Moving application files..."
if [ -d "/opt/inventory" ]; then
    sudo mv /opt/inventory/* /var/www/inventory/ 2>/dev/null || true
    sudo mv /opt/inventory/.* /var/www/inventory/ 2>/dev/null || true
    echo "  ✅ Files moved"
else
    echo "  ⚠️  /opt/inventory not found, skipping move"
fi

# Create logs directory
echo "4. Creating logs directory..."
mkdir -p /var/www/inventory/logs
chmod 755 /var/www/inventory/logs

# Update PM2 config
echo "5. Updating PM2 configuration..."
cd /var/www/inventory
./scripts/deployment/fix-pm2-config.sh

# Start applications
echo "6. Starting applications..."
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "✅ Migration complete!"
echo ""
echo "Application is now at: /var/www/inventory"
echo "Check status: pm2 status"

