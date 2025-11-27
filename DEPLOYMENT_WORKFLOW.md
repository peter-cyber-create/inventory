## 📦 Deployment Workflow

This guide explains how to move code changes from local development to the live server and keep the application (backend, frontend, and APIs) fully functional.

---

### 1. Local Development

1. Make changes locally (feature work, bug fixes, etc.)
2. Run tests / builds where possible:
   ```bash
   npm install
   cd backend && npm install && cd ..
   cd frontend && npm install && npm run build && cd ..
   ```
3. Commit and push:
   ```bash
   git add .
   git commit -m "<your message>"
   git push origin main
   ```

---

### 2. Prepare the Server

SSH into the live server and make sure the application directory exists.

```bash
ssh confdb@172.27.0.10
ls /var/www/inventory     # default APP_DIR
```

If the directory does **not** contain a git repo, run the full setup script once:

```bash
cd /opt/inventory                  # management clone
./scripts/deployment/setup-new-server.sh
```

---

### 3. Redeploy After New Changes

Use the redeploy script to pull the latest code, install dependencies, rebuild the frontend, and restart PM2:

```bash
cd /var/www/inventory               # or export APP_DIR=<path>
chmod +x scripts/deployment/redeploy-from-git.sh
./scripts/deployment/redeploy-from-git.sh
```

This script performs:
- `git fetch && git pull`
- `npm install` (root + backend + frontend)
- `npm run build` for the frontend
- Restarts PM2 via `ecosystem.config.js`
- Health checks for backend (`/api/system/health`) and frontend

---

### 4. Fixing Existing Deployments

If PM2 still references an old path (e.g., `/var/www/inventory` vs `/opt/inventory`), run:

```bash
./scripts/deployment/fix-path-mismatch.sh
```

For 502/Bad Gateway errors, run:

```bash
./scripts/deployment/fix-502-error.sh
```

Both scripts are idempotent and safe to rerun.

---

### 5. Health Checks & Verification

After redeployment:

```bash
curl http://localhost:5000/api/system/health         # backend direct
curl http://172.27.0.10/api/system/health            # backend via Nginx
curl http://172.27.0.10                               # frontend via Nginx
pm2 status
```

---

### 6. Environment Variables Reminder

Ensure these files remain up to date on the server:

- `config/environments/backend.env`
- `frontend/.env.production`

Never commit real secrets to git. Use the files on the server only.

---

### 7. Ongoing Maintenance

- Rotate sensitive credentials frequently (DB password, JWT secret, admin login)
- Keep Node.js & npm updated (`nvm` or Nodesource)
- Use `pm2 save` after any change to PM2 configuration
- Monitor logs:
  ```bash
  pm2 logs moh-ims-backend
  pm2 logs moh-ims-frontend
  sudo tail -f /var/log/nginx/error.log
  ```

---

By following this workflow, you can confidently push from development, pull on the server, and redeploy with fully functional backend APIs and frontend UI. 

