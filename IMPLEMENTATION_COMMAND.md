# 🚀 Implementation Command for New Server Deployment

## Quick Start (Default Configuration)

> **Note:** The setup script clones the production copy into `APP_DIR` (defaults to `/var/www/inventory`).  
> If you prefer a different location (e.g. `/opt/inventory`), export `APP_DIR` before running the script.

```bash
# Optional: pick where the live app will live
export APP_DIR="/var/www/inventory"

# Download helper script and run
cd /opt
sudo git clone https://github.com/peter-cyber-create/inventory.git inventory
sudo chown -R $USER:$USER inventory
cd inventory

chmod +x scripts/deployment/setup-new-server.sh
./scripts/deployment/setup-new-server.sh
```

## Custom Configuration

To customize the deployment (different IP, ports, or paths):

```bash
# Set environment variables before running
export SERVER_IP="your-server-ip-or-domain"
export FRONTEND_PORT="3000"
export BACKEND_PORT="5000"
export APP_DIR="/var/www/inventory"
export DB_NAME="inventory_db"
export DB_USER="inventory_user"
export DB_HOST="localhost"
export DB_PORT="5432"

# Clone repository
cd /opt
sudo git clone https://github.com/peter-cyber-create/inventory.git inventory
sudo chown -R $USER:$USER inventory
cd inventory

# Make script executable and run
chmod +x scripts/deployment/setup-new-server.sh
./scripts/deployment/setup-new-server.sh
```

## One-Line Command (Default Settings)

```bash
cd /opt && sudo git clone https://github.com/peter-cyber-create/inventory.git inventory && sudo chown -R $USER:$USER inventory && cd inventory && chmod +x scripts/deployment/setup-new-server.sh && ./scripts/deployment/setup-new-server.sh
```

## One-Line Command (Custom Settings)

```bash
export SERVER_IP="172.27.0.10" FRONTEND_PORT="3000" BACKEND_PORT="5000" APP_DIR="/var/www/inventory" && cd /opt && sudo git clone https://github.com/peter-cyber-create/inventory.git inventory && sudo chown -R $USER:$USER inventory && cd inventory && chmod +x scripts/deployment/setup-new-server.sh && ./scripts/deployment/setup-new-server.sh
```

## For Existing Repository (Update and Redeploy)

Once the application has been provisioned on the server (for example under `/var/www/inventory`), redeploy by pulling the latest changes and rebuilding:

```bash
cd /var/www/inventory   # or wherever APP_DIR points
git pull origin main
./scripts/deployment/redeploy-from-git.sh
```

or run everything via `deploy.sh` (re-runs the full setup if needed):

```bash
cd /opt/inventory       # management clone
./deploy.sh
```

## What the Script Does

The setup script will automatically:

1. ✅ Check and install prerequisites (Node.js 20 LTS, npm, git)
2. ✅ Install Nginx (if not present)
3. ✅ Install PostgreSQL (if not present)
4. ✅ Install PM2 globally
5. ✅ Create database and user (with password prompt)
6. ✅ Create application directory
7. ✅ Clone repository (if not already cloned)
8. ✅ Install all dependencies (root, backend, frontend)
9. ✅ Setup environment variables (with prompts)
10. ✅ Build frontend for production
11. ✅ Test database connection
12. ✅ Run database migrations
13. ✅ Setup PM2 ecosystem configuration
14. ✅ Create logs directory
15. ✅ Start application with PM2
16. ✅ Configure Nginx reverse proxy
17. ✅ Perform health checks

## Post-Deployment Steps

After the script completes, remember to:

1. **Update sensitive values** in `config/environments/backend.env`:
   - Change `JWT_SECRET` to a secure random value
   - Update email configuration if needed
   - Verify all database credentials

2. **Change default passwords**:
   - Database user password
   - Admin user password (if using default)

3. **Sync PM2 configuration**  
   - `ecosystem.config.js` now auto-detects the install directory via `APP_DIR`
   - Use `scripts/deployment/fix-path-mismatch.sh` if PM2 was previously configured with outdated paths

4. **Configure SSL/HTTPS** (recommended for production):
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

4. **Set up backups**:
   - Database backups
   - Application file backups

5. **Monitor the application**:
   ```bash
   pm2 status
   pm2 logs
   pm2 monit
   ```

## Troubleshooting

If you encounter issues:

1. **Check logs**:
   ```bash
   pm2 logs moh-ims-backend
   pm2 logs moh-ims-frontend
   ```

2. **Verify services**:
   ```bash
   sudo systemctl status postgresql
   sudo systemctl status nginx
   pm2 status
   ```

3. **Test database connection**:
   ```bash
   cd /opt/inventory/backend
   node -e "require('dotenv').config({path: '../config/environments/backend.env'}); require('./config/db').connectDB().then(() => console.log('✅ Connected')).catch(e => console.error('❌ Failed:', e))"
   ```

4. **Restart services / redeploy**:
   ```bash
./scripts/deployment/redeploy-from-git.sh          # preferred
# or manually
pm2 restart all
sudo systemctl restart postgresql
sudo systemctl restart nginx
   ```

## Access URLs

After successful deployment:

- **Frontend**: `http://SERVER_IP:FRONTEND_PORT` (default: `http://172.27.0.10:3000`)
- **Backend API**: `http://SERVER_IP:BACKEND_PORT/api` (default: `http://172.27.0.10:5000/api`)
- **With Nginx**: `http://SERVER_IP` (frontend) and `http://SERVER_IP/api` (backend)

## Security Notes

⚠️ **Important**: 
- Never run the script as root (it will exit if attempted)
- Change all default passwords immediately
- Update JWT_SECRET in production
- Configure firewall rules appropriately
- Use SSL/HTTPS for production deployments

