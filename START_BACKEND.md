# How to Start the Backend

## Quick Start

**Run this command in your terminal:**

```bash
cd /home/peter/Desktop/Dev/inventory/backend
npm run dev
```

**Keep this terminal open** - the backend will run in the foreground and show logs.

## What You Should See

When the backend starts successfully, you'll see output like:

```
✅ PostgreSQL Database Connection has been established successfully.
Server running on port 5000
```

Or if database connection fails (but server still starts):

```
⚠️ Database connection warning: ...
✅ Server is running - configure PostgreSQL database
```

## Verify It's Running

**Open a NEW terminal window** and run:

```bash
curl http://localhost:5000/api/system/health
```

You should get a JSON response. If you get "Connection refused", the backend isn't running yet.

## Common Issues

### Issue: "Cannot find module"
**Solution:**
```bash
cd /home/peter/Desktop/Dev/inventory/backend
npm install
```

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Find and kill the process using port 5000
lsof -ti:5000 | xargs kill -9
# Or
pkill -f "babel-node.*index.js"
```

### Issue: Database connection error
**The server will still start**, but database operations won't work. To fix:
```bash
# Start PostgreSQL (if not running)
sudo systemctl start postgresql

# Verify database exists
psql -U inventory_user -d inventory_db -c "SELECT 1;"
```

## Next Steps

Once backend is running:
1. **Start frontend** (in another terminal):
   ```bash
   cd /home/peter/Desktop/Dev/inventory/frontend
   npm start
   ```

2. **Open browser**: http://localhost:3000

3. **Login**: admin / admin123
