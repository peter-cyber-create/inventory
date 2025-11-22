#!/bin/bash

# Quick fix script for PM2 configuration
# Run this on the server after pulling latest changes

cd /opt/inventory

echo "Fixing PM2 configuration..."

# Create logs directory
mkdir -p /opt/inventory/logs
chmod 755 /opt/inventory/logs

# Delete old ecosystem config
rm -f ecosystem.config.js

# Create correct ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'moh-ims-backend',
      script: 'index.js',
      cwd: '/opt/inventory/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/opt/inventory/logs/backend-error.log',
      out_file: '/opt/inventory/logs/backend-out.log',
      log_file: '/opt/inventory/logs/backend.log',
      time: true,
      max_memory_restart: '1G'
    },
    {
      name: 'moh-ims-frontend',
      script: 'npx',
      args: 'serve -s build -l 3000',
      cwd: '/opt/inventory/frontend',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/opt/inventory/logs/frontend-error.log',
      out_file: '/opt/inventory/logs/frontend-out.log',
      log_file: '/opt/inventory/logs/frontend.log',
      time: true
    }
  ]
};
EOF

echo "PM2 configuration fixed!"
echo ""
echo "Now run:"
echo "  pm2 delete all"
echo "  pm2 start ecosystem.config.js"
echo "  pm2 save"

