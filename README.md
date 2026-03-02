# Ministry of Health — IMS (Integrated Management System)

## Run locally (full stack for testing before deployment)

1. **PostgreSQL**  
   Ensure Postgres is running and a database exists, e.g.:
   - Database: `ims_db`
   - User: `ims`
   - Password: `ims_secret`
   - Port: `5432`

2. **Backend env**  
   ```bash
   cp backend/.env.example backend/.env
   ```
   Edit `backend/.env` and set `DATABASE_URL` to your local Postgres (and optionally `JWT_SECRET`).

3. **Migrations**  
   From repo root:
   ```bash
   npm run db:migrate
   ```

4. **Start backend + frontend**  
   From repo root:
   ```bash
   npm run dev
   ```
   - Backend: http://localhost:3000  
   - Frontend: http://localhost:5173 (proxies `/api` and `/health` to the backend)

5. **Seed (optional)**  
   To create an admin user with a known password:  
   `npm run db:seed`  
   Then sign in with **admin@ims.local** or **admin** / **Admin@123**.

6. **Smoke test**  
   Open http://localhost:5173 → Sign in (admin@ims.local or admin / Admin@123) → **Stores → Items**: list and add an item (no 401, no 500).

## Deploy to server

**One command from your machine** (sync + build + restart on server):

```bash
cd /home/peter/Desktop/Dev/inv
./scripts/deploy.sh
```

You’ll be prompted for the server password (or use SSH keys). The script syncs code, then SSHs in and runs install, build, migrate, and restart. When it finishes, open the site and do a **hard refresh (Ctrl+Shift+R)**.

**How to confirm the new build is live**  
The app shows a **Build** date/time in the header (and on the login page). After deploy, that time should match the deploy you just ran. If it doesn’t, do a hard refresh or clear the site’s cache.

---

**Manual deploy (if you prefer)**  
1. Sync from your machine: `./scripts/sync-to-server.sh`  
2. On the server: `cd ~/inv && bash scripts/deploy-on-server.sh`

- Ensure `backend/.env` on the server has correct `DATABASE_URL` and `JWT_SECRET`.
- **Nginx must proxy `/api` and `/health` to the backend.** Use `config/nginx-ims.conf` as a reference: root = `~/inv/frontend/dist`, and `location /api` must `proxy_pass http://127.0.0.1:3000`. Without this, login and all API calls return **404**.

**Vehicle table:** If you see "column Vehicle.old_number_plate does not exist", run migrations on the server: `cd ~/inv/backend && npx prisma migrate deploy`. This applies the migration that adds `old_number_plate`, `new_number_plate`, and other Vehicle columns.

### Production checklist (after sync)

| Step | On server |
|------|-----------|
| 1 | `cd ~/inv && bash scripts/deploy-on-server.sh` (builds frontend + runs migrations + starts backend) |
| 2 | Nginx: root = `~/inv/frontend/dist`, proxy `/api` and `/health` to `http://127.0.0.1:3000` |
| 3 | Hard-refresh browser (Ctrl+Shift+R) so cached index.html is dropped |

### Troubleshooting

- **"Request failed with status code 404" on Sign in**  
  The request goes to `/api/auth/login`. Nginx (or whatever serves the site) must proxy `/api` to the Node backend on port 3000. If there is no proxy, Nginx returns 404. Add a `location /api { proxy_pass http://127.0.0.1:3000; ... }` block and reload Nginx. Also ensure the backend is running: `cd ~/inv/backend && npm start` (or already running in background).

- **401 on "New Item" or other actions**  
  The app will redirect you to the login page and show "Session expired. Please sign in again." Sign in again and retry. If 401 persists, run `./scripts/deploy.sh` so the server runs the latest backend (stores items do not require auth in current code). Ensure `backend/.env` on the server has the same `JWT_SECRET` as when you first logged in (changing it invalidates existing tokens).

- **Still seeing old UI / same things after deploy**  
  1) Use the one-command deploy so the server always rebuilds: `./scripts/deploy.sh` from your machine.  
  2) Check the **Build** date in the app header or on the login page — it must match the time you just deployed. If it’s older, the browser or Nginx is serving a cached build: hard-refresh (Ctrl+Shift+R) or clear site data for the site.  
  3) Confirm Nginx document root is `~/inv/frontend/dist` and reload Nginx after deploy: `sudo systemctl reload nginx`.

**If nothing works:** Follow [docs/TROUBLESHOOTING-LIVE.md](docs/TROUBLESHOOTING-LIVE.md). Run the verify script on the server and open `/api/build-info` and `/build-time.txt` in the browser; the output shows exactly where things are failing.

## Scripts (from repo root)

| Command | Description |
|--------|-------------|
| `npm run dev` | Run backend (watch) + frontend (Vite) |
| `npm run build` | Build backend + frontend |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run start` | Run backend only (production) |
