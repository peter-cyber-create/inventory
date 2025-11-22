#!/bin/bash

# Setup Nginx to serve application on port 80
# This allows access via http://172.27.0.9 or http://172.27.0.10 (no port needed)

echo "🔧 Setting up Nginx reverse proxy on port 80..."

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
sudo cat > /etc/nginx/sites-available/inventory << 'NGINX_EOF'
server {
    listen 80;
    server_name 172.27.0.9 172.27.0.10 _;

    # Increase timeouts for slow authentication
    proxy_connect_timeout 300;
    proxy_send_timeout 300;
    proxy_read_timeout 300;
    send_timeout 300;

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
        
        # Increase buffer sizes
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }

    # Frontend
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
        
        # Increase buffer sizes
        proxy_buffer_size 128k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
    }

    # Static assets
    location /static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1d;
        expires 1d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_EOF

# Enable site
echo "Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/inventory /etc/nginx/sites-enabled/

# Remove default site if it exists
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    echo "Removing default Nginx site..."
    sudo rm /etc/nginx/sites-enabled/default
fi

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
sudo systemctl status nginx --no-pager | head -10

echo ""
echo "✅ Nginx setup complete!"
echo ""
echo "You can now access the application at:"
echo "  http://172.27.0.9"
echo "  http://172.27.0.10"
echo ""
echo "No port number needed - Nginx serves on port 80 (default HTTP port)"

