# System Testing Guide

## Prerequisites

1. **PostgreSQL Database Running**
   ```bash
   sudo systemctl status postgresql
   # If not running: sudo systemctl start postgresql
   ```

2. **Database Setup** (if not already done)
   ```bash
   sudo -u postgres psql
   CREATE DATABASE inventory_db;
   CREATE USER inventory_user WITH PASSWORD 'KLy1p6Wh0x4BnES5PdTCLA==';
   GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;
   \q
   ```

3. **Node.js and npm installed**
   ```bash
   node --version  # Should be v14+
   npm --version
   ```

## Step 1: Start the System

### Option A: Development Mode (Recommended for Testing)
```bash
cd /home/peter/Desktop/Dev/inventory
npm run dev
```
This starts both backend (port 5000) and frontend (port 3000) concurrently.

### Option B: Production Mode (Matches Server)
```bash
# Terminal 1: Backend
cd /home/peter/Desktop/Dev/inventory/backend
npm start

# Terminal 2: Frontend (build first)
cd /home/peter/Desktop/Dev/inventory/frontend
npm run build
npm run serve  # or use PM2: pm2 start ecosystem.config.js
```

## Step 2: Run Automated Tests

```bash
cd /home/peter/Desktop/Dev/inventory
./scripts/test-system.sh
```

This will test:
- Backend health
- Database connection
- Authentication
- API endpoints
- Frontend build
- Configuration

## Step 3: Manual Testing

### 3.1 Backend API Testing

#### Test Health Endpoint
```bash
curl http://localhost:5000/api/system/health
```

Expected response:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

#### Test Authentication
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Expected: Returns JWT token

#### Test Protected Endpoints (with token)
```bash
# Get token from login response, then:
TOKEN="your_jwt_token_here"

# Test Staff endpoint
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/staff

# Test Categories endpoint
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/category

# Test Assets endpoint
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/assets
```

### 3.2 Frontend Testing

1. **Open Browser**: Navigate to `http://localhost:3000`

2. **Login Test**
   - Username: `admin`
   - Password: `admin123`
   - Should redirect to dashboard

3. **Test Each Module** (follow TEST_CHECKLIST.md):

   **ICT Assets Module:**
   - Navigate to `/ict/categories` - Should load without "Something went wrong"
   - Navigate to `/ict/types` - Should load
   - Navigate to `/ict/brands` - Should load
   - Navigate to `/ict/models` - Should load
   - Navigate to `/ict/assets` - Should load
   - Navigate to `/ict/staff` - Should load
   - Navigate to `/ict/departments` - Should load
   - Navigate to `/ict/divisions` - Should load
   - Navigate to `/ict/facilities` - Should load
   - Navigate to `/ict/assets/add` - Test Add Asset form
     - Fill "Assigned User Information" table
     - Fill "ICT Asset Line Items" table
     - Submit and verify data saves

   **Stores Module:**
   - Navigate to `/stores/grn` - Should load GRN list
   - Navigate to `/stores/ledger` - Should load ledger
   - Navigate to `/stores/form76a` - Should load Form 76A
   - Test creating new GRN
   - Test creating Form 76A requisition

   **Fleet Module:**
   - Navigate to `/fleet/vehicles` - Should load vehicles
   - Test creating new vehicle
   - Test creating job card

   **Finance Module:**
   - Navigate to `/finance/activities` - Should load activities
   - Navigate to `/finance/users` - Should load users
   - Test creating new activity

   **Servers Module:**
   - Navigate to `/ict/servers` - Should load servers
   - Navigate to `/ict/virtual-servers` - Should load virtual servers
   - Test creating host server
   - Test creating virtual server
   - Verify warranty field is optional

### 3.3 Data Entry Testing

For each form, test:
1. **Required Field Validation**
   - Try submitting empty form
   - Should show validation errors

2. **Data Entry**
   - Fill all required fields
   - Submit form
   - Should show success message
   - Should redirect or refresh list

3. **Data Retrieval**
   - Navigate to list page
   - Verify new entry appears
   - Verify data displays correctly

4. **Data Update**
   - Click edit on an entry
   - Modify data
   - Save
   - Verify changes appear in list

5. **Data Deletion** (if applicable)
   - Delete an entry
   - Verify it's removed from list

### 3.4 Error Handling Testing

1. **Network Errors**
   - Stop backend server
   - Try to load a page
   - Should show user-friendly error message

2. **Authentication Errors**
   - Logout
   - Try to access protected page
   - Should redirect to login

3. **Validation Errors**
   - Submit invalid data
   - Should show field-specific errors

4. **404 Errors**
   - Navigate to non-existent route
   - Should show 404 page

## Step 4: Database Verification

### Check Data in Database
```bash
psql -U inventory_user -d inventory_db

# Check tables
\dt

# Check recent entries
SELECT * FROM "Assets" ORDER BY "createdAt" DESC LIMIT 5;
SELECT * FROM "Staff" ORDER BY "createdAt" DESC LIMIT 5;
SELECT * FROM "GRNs" ORDER BY "createdAt" DESC LIMIT 5;

# Check foreign key relationships
SELECT 
    a."serialNo", 
    b.name as brand, 
    m.name as model 
FROM "Assets" a 
LEFT JOIN "Brands" b ON a."brandId" = b.id 
LEFT JOIN "Models" m ON a."modelId" = m.id 
LIMIT 10;

\q
```

## Step 5: Performance Testing

1. **Page Load Times**
   - Open browser DevTools (F12)
   - Go to Network tab
   - Navigate to each major page
   - Check load time (should be < 3 seconds)

2. **API Response Times**
   - Open browser DevTools
   - Go to Network tab
   - Filter by XHR/Fetch
   - Check API response times (should be < 1 second)

3. **Memory Usage**
   - Open browser DevTools
   - Go to Performance tab
   - Record while using the app
   - Check for memory leaks

## Step 6: Browser Console Check

1. **Open Browser Console** (F12 → Console tab)
2. **Navigate through all pages**
3. **Check for:**
   - No red errors
   - No "Something went wrong" errors
   - No undefined/null errors
   - No network errors (unless backend is down)

## Common Issues and Solutions

### Issue: "Something went wrong" error
**Solution**: Check browser console for specific error. Usually means:
- API returned undefined data → Fixed with defensive normalization
- Network error → Check backend is running
- Authentication error → Re-login

### Issue: Backend not responding
**Solution**:
```bash
# Check if backend is running
curl http://localhost:5000/api/system/health

# If not, restart:
cd /home/peter/Desktop/Dev/inventory/backend
npm start
```

### Issue: Database connection failed
**Solution**:
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check credentials in backend.env
cat config/environments/backend.env | grep DB_

# Test connection
psql -U inventory_user -d inventory_db -c "SELECT 1;"
```

### Issue: Frontend not loading
**Solution**:
```bash
# Check if frontend is running
curl http://localhost:3000

# If not, start:
cd /home/peter/Desktop/Dev/inventory/frontend
npm start
```

## Test Results Log

Use TEST_CHECKLIST.md to track your testing progress. Mark each item as you test it.

## Next Steps After Testing

1. **Fix any issues found** during testing
2. **Commit fixes** to git
3. **Push to server** and deploy
4. **Re-test on server** to verify fixes

---

**Note**: The system is now configured to match the server settings. All defensive data handling has been implemented to prevent "Something went wrong" errors.
