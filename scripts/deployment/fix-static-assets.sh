#!/bin/bash

# Fix static assets serving issue
# The problem is that serve needs to serve from the build directory correctly

cd /var/www/inventory

echo "🔧 Fixing static assets serving..."
echo ""

# Check if build directory has assets
if [ ! -d "frontend/build/assets" ]; then
    echo "⚠️  Assets not in build directory. Rebuilding frontend..."
    cd frontend
    npm run build
    cd ..
fi

# Update PM2 config to serve with correct options
echo "Updating PM2 configuration for proper static asset serving..."

cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'moh-ims-backend',
      script: 'index.js',
      cwd: '/var/www/inventory/backend',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/var/www/inventory/logs/backend-error.log',
      out_file: '/var/www/inventory/logs/backend-out.log',
      log_file: '/var/www/inventory/logs/backend.log',
      time: true,
      max_memory_restart: '1G'
    },
    {
      name: 'moh-ims-frontend',
      script: 'npx',
      args: 'serve -s build -l 3000 --single',
      cwd: '/var/www/inventory/frontend',
      instances: 1,
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/www/inventory/logs/frontend-error.log',
      out_file: '/var/www/inventory/logs/frontend-out.log',
      log_file: '/var/www/inventory/logs/frontend.log',
      time: true
    }
  ]
};
EOF

echo "✅ PM2 configuration updated"
echo ""
echo "Restarting applications..."
pm2 delete all
pm2 start ecosystem.config.js
pm2 save

echo ""
echo "✅ Done! Static assets should now be served correctly."
echo "The --single flag ensures all routes serve index.html for React Router"

