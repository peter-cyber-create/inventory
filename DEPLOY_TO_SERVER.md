# Deploy Changes to Server

## Quick Deployment

To pull the latest changes to your server, you have two options:

### Option 1: SSH and Run Update Script (Recommended)

1. **SSH into your server:**
   ```bash
   ssh peter@172.27.0.10
   ```

2. **Navigate to the application directory:**
   ```bash
   cd /var/www/inventory
   ```

3. **Run the update script:**
   ```bash
   chmod +x scripts/deployment/update-and-deploy.sh
   ./scripts/deployment/update-and-deploy.sh
   ```

   This script will:
   - Pull latest changes from git
   - Update dependencies
   - Build the frontend
   - Run database migrations
   - Restart PM2 processes
   - Perform health checks

### Option 2: Manual Update Steps

If you prefer to run the steps manually:

```bash
# SSH into server
ssh peter@172.27.0.10

# Navigate to app directory
cd /var/www/inventory

# Pull latest changes
git pull origin main

# Update dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Build frontend
cd frontend && npm run build && cd ..

# Run migrations
cd backend && npx sequelize-cli db:migrate && cd ..

# Restart PM2 processes
pm2 restart all
pm2 save

# Check status
pm2 status
```

### Option 3: Use the Remote Deployment Script (If SSH Key is Set Up)

If you have SSH key authentication configured:

```bash
# From your local machine
cd /home/peter/Desktop/Dev/inventory
./scripts/deployment/deploy-to-server.sh
```

You can customize the server connection by setting environment variables:
```bash
export SERVER_USER=your_username
export SERVER_HOST=your_server_ip
export APP_DIR=/path/to/app
./scripts/deployment/deploy-to-server.sh
```

## Verify Deployment

After deployment, verify the application is running:

```bash
# On the server
pm2 status
pm2 logs

# Check health endpoints
curl http://localhost:5000/api/system/health
curl http://localhost:3000
```

## Troubleshooting

### SSH Connection Issues

If you get host key verification errors:
```bash
ssh-keygen -f ~/.ssh/known_hosts -R 172.27.0.10
```

### Permission Issues

If you encounter permission errors:
```bash
sudo chown -R $USER:$USER /var/www/inventory
```

### PM2 Not Found

If PM2 is not installed:
```bash
npm install -g pm2
```

### Migration Errors

If migrations fail, check the backend logs:
```bash
cd /var/www/inventory/backend
pm2 logs moh-ims-backend
```

