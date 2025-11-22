#!/bin/bash

# Setup Nginx reverse proxy to serve on port 80
# This allows accessing the site at http://172.27.0.10 (without :3000)

cd /var/www/inventory

echo "🌐 Setting up Nginx reverse proxy..."
echo ""

# Check if Nginx is installed
if ! command -v nginx &> /dev/null; then
    echo "Installing Nginx..."
    sudo apt update
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
fi

# Create Nginx configuration
echo "Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/inventory > /dev/null << 'EOF'
server {
    listen 80;
    server_name 172.27.0.10;

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend (React app)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable site
echo "Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/inventory /etc/nginx/sites-enabled/

# Remove default site if it exists
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "Testing Nginx configuration..."
if sudo nginx -t; then
    echo "✅ Nginx configuration is valid"
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded"
else
    echo "❌ Nginx configuration test failed"
    exit 1
fi

# Check Nginx status
echo ""
echo "Nginx status:"
sudo systemctl status nginx --no-pager | head -5

echo ""
echo "✅ Nginx reverse proxy configured!"
echo ""
echo "You can now access the site at:"
echo "  http://172.27.0.10 (no port needed)"
echo ""
echo "Backend API: http://172.27.0.10/api"

