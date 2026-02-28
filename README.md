# Government IMS (Inventory Management System)

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

**1. From your machine** (sync code; excludes `node_modules` and `backend/.env`):

```bash
cd /home/peter/Desktop/Dev/inv
./scripts/sync-to-server.sh
```

Or manually:

```bash
rsync -avz --exclude 'node_modules' --exclude 'backend/node_modules' --exclude 'frontend/node_modules' --exclude 'backend/.env' --exclude '.git' . frank@172.27.1.170:~/inv/
```

**2. On the server** (SSH in, then):

```bash
cd ~/inv
npm install
cd backend && npm install && cd ..
npm run build
cd backend && npx prisma migrate deploy
# Restart the Node process (e.g. if using pm2: pm2 restart ims; or kill existing and:)
npm start
```

- Ensure `backend/.env` on the server has correct `DATABASE_URL` and `JWT_SECRET`.
- Nginx: serve frontend from `~/inv/frontend/dist` and proxy `/api` to `http://127.0.0.1:3000`.

## Scripts (from repo root)

| Command | Description |
|--------|-------------|
| `npm run dev` | Run backend (watch) + frontend (Vite) |
| `npm run build` | Build backend + frontend |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run start` | Run backend only (production) |
