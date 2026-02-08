# Quick Start Guide

## Option 1: Using npm run dev (Recommended)

```bash
cd /home/peter/Desktop/Dev/inventory
npm run dev
```

This will start both backend and frontend concurrently.

## Option 2: Start Separately (If concurrently fails)

### Terminal 1 - Backend:
```bash
cd /home/peter/Desktop/Dev/inventory/backend
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd /home/peter/Desktop/Dev/inventory/frontend
npm start
```

## Option 3: Using the startup script

```bash
cd /home/peter/Desktop/Dev/inventory
./start-dev.sh
```

## Verify System is Running

### Check Backend:
```bash
curl http://localhost:5000/api/system/health
```

Expected response:
```json
{"status":"ok","database":"connected",...}
```

### Check Frontend:
Open browser: http://localhost:3000

## Login Credentials

- Username: `admin`
- Password: `admin123`

## Run Tests

After system is running, in a new terminal:

```bash
cd /home/peter/Desktop/Dev/inventory
./scripts/test-system.sh
```

## Troubleshooting

### Issue: "concurrently: not found"
**Solution**: Use Option 2 (start separately) or run:
```bash
npm install concurrently --save-dev
```

### Issue: Backend not starting
**Check**:
1. Database is running: `sudo systemctl status postgresql`
2. Environment file exists: `ls config/environments/backend.env`
3. Check backend logs for errors

### Issue: Frontend not starting
**Check**:
1. Port 3000 is not in use: `lsof -i :3000`
2. Node modules installed: `cd frontend && npm install`
3. Check frontend logs for errors

### Issue: Database connection failed
**Check**:
1. PostgreSQL is running: `sudo systemctl start postgresql`
2. Database exists: `psql -U inventory_user -d inventory_db -c "SELECT 1;"`
3. Credentials in `config/environments/backend.env` are correct
