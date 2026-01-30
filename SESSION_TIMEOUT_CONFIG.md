# Session Timeout Configuration

## Current Session Timeout Settings

### Backend Configuration

**JWT Token Expiration:**
- **Location:** `backend/routes/users/userRoutes.js`
- **Login Route:** Token expires in **24 hours** (86400 seconds)
- **Register Route:** Cookie maxAge set to **1 day** (86400 seconds)

```javascript
// Login - Line 173
let token = jwt.sign({ id: user.id }, process.env.SECRETKEY, { expiresIn: 86400 }); // 24 hours

// Register - Line 129
res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
```

**Authentication Middleware:**
- **Location:** `backend/middleware/auth.js`
- Automatically validates JWT tokens on protected routes
- Returns 401 if token is expired or invalid

### Frontend Configuration

**Token Storage:**
- Tokens stored in `localStorage`
- Automatically cleared on 401 responses
- **Location:** `frontend/src/helpers/api.js`

**Session Management:**
- API interceptor handles token expiration (Line 48-58)
- Automatically redirects to login on 401 errors
- Clears all auth data (token, user, userRole)

**Request Timeout:**
- API requests timeout after **30 seconds**
- **Location:** `frontend/src/helpers/api.js` (Line 12)

## Session Timeout Behavior

1. **Token Expiration:** After 24 hours, JWT tokens expire
2. **Automatic Logout:** When expired token is used, frontend receives 401
3. **Token Cleanup:** All auth data is cleared from localStorage
4. **Redirect:** User is automatically redirected to login page

## Deployment Status

✅ **All session timeout configurations are committed and pushed to repository**

## Deployment Instructions

To deploy session timeout configuration to the server:

```bash
# SSH into server
ssh peter@172.27.0.10

# Navigate to app directory
cd /var/www/inventory

# Pull latest changes
git pull origin main

# Run deployment script
./scripts/deployment/update-and-deploy.sh
```

Or use the quick update command:

```bash
ssh peter@172.27.0.10 "cd /var/www/inventory && git pull origin main && ./scripts/deployment/update-and-deploy.sh"
```

## Verification

After deployment, verify session timeout is working:

1. **Login to the application**
2. **Wait 24 hours** (or manually expire token in browser console)
3. **Make an API request** - should receive 401
4. **Verify automatic redirect** to login page
5. **Check localStorage** - should be cleared

## Customization

To change session timeout duration:

1. **Backend:** Edit `backend/routes/users/userRoutes.js`
   - Change `expiresIn: 86400` to desired seconds
   - Example: `expiresIn: 3600` for 1 hour

2. **Frontend:** No changes needed - automatically handles any token expiration

## Security Notes

- ✅ Tokens are HTTP-only cookies (register route)
- ✅ Tokens validated on every protected route
- ✅ Expired tokens automatically rejected
- ✅ Frontend handles token expiration gracefully
- ✅ No sensitive data stored in localStorage (only token and user info)

