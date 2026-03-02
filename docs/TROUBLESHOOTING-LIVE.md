# Troubleshooting: Live site not updating / 401 / “nothing works”

Do these in order and note the results. That will show where things are failing.

---

## Step A: Deploy from your machine

```bash
cd /home/peter/Desktop/Dev/inv
./scripts/deploy.sh
```

Enter the server password when asked. Wait until it finishes (including “Deploy done”).

---

## Step B: Verify on the server

SSH in and run the verify script:

```bash
ssh frank@172.27.1.170 'cd ~/inv && bash scripts/verify-server.sh'
```

Check the output:

1. **Backend process** – Should show one line like `12345 node dist/index.js`. If it says “No node backend process found”, the backend is not running.
2. **Backend health** – Should show `HTTP 200`. If it says “Connection failed”, the backend is not listening on 3000 or not running.
3. **Frontend dist** – Should show:
   - `build-time.txt: 2026-03-01T14:30:00.000Z` (today’s deploy time).
   - `index.html` with a recent “mtime” (time of last build).
   If `build-time.txt` is missing or the time is old, the frontend was not rebuilt or the build failed.
4. **Nginx root** – Should show a `root` that points to your app’s frontend, e.g. `/home/frank/inv/frontend/dist`. If it points somewhere else (e.g. `/var/www/html`), Nginx is not serving the new build.

---

## Step C: Verify in the browser

Use the **exact** URL you use for the app (e.g. `https://inventory.health.go.ug`).

1. **Backend API**
   - Open: `https://inventory.health.go.ug/api/build-info`  
   - You should see JSON: `{"ok":true,"backend":"ims","time":"..."}`.  
   - If you get 404, Nginx is not proxying `/api` to the backend.  
   - If you get “connection refused” or no response, the backend is not running or not reachable.

2. **Frontend build time**
   - Open: `https://inventory.health.go.ug/build-time.txt`  
   - You should see a single line with a timestamp (e.g. `2026-03-01T14:30:00.000Z`).  
   - If the timestamp is old or you get 404, Nginx is either serving from a different folder or the new build was not deployed.

3. **Hard refresh the app**
   - Open the main app URL.
   - Do a hard refresh: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac).
   - Check the **Build** date in the header or on the login page. It should match the time from `build-time.txt`.

---

## Step D: If something is wrong

| Problem | What to do |
|--------|------------|
| Backend process “not found” | On server: `cd ~/inv/backend && nohup npm start > ../backend.log 2>&1 &` |
| Backend health “Connection failed” | Same as above; then check `~/inv/backend.log` for errors. |
| `build-time.txt` missing or old | On server: `cd ~/inv && npm run build`. Then run Step B again. |
| Nginx root not `~/inv/frontend/dist` | Edit the Nginx server block so `root` is `/home/frank/inv/frontend/dist` (or your actual path). Then: `sudo systemctl reload nginx`. |
| `/api/build-info` returns 404 | In the Nginx config, add (or fix) `location /api { proxy_pass http://127.0.0.1:3000; ... }`. Then: `sudo systemctl reload nginx`. |
| `/build-time.txt` 404 or old | Nginx is serving from the wrong directory. Fix `root` as above and reload Nginx. |
| 401 on login or “New Item” | Log out, clear site data for this domain, then log in again. If it still happens, on the server check `backend/.env` and ensure `JWT_SECRET` has not changed. |
| **“Route not found” / “Page not found”** | Usually means Nginx is **not** sending non-file URLs to `index.html`. In the `server` block, the `location /` must have `try_files $uri $uri/ /index.html;`. Then run `sudo systemctl reload nginx`. Always open the app from the root URL (e.g. `https://inventory.health.go.ug/`) and use the sidebar; avoid opening or refreshing direct paths until Nginx is fixed. |

---

## One-line verify (from your machine)

After deploy, run:

```bash
ssh frank@172.27.1.170 'cd ~/inv && bash scripts/verify-server.sh'
```

Then in the browser open (replace with your domain):

- `https://inventory.health.go.ug/api/build-info`
- `https://inventory.health.go.ug/build-time.txt`

Send the **exact** outputs (and any error messages) so we can see where it’s failing.
