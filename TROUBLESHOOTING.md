# Troubleshooting Guide - Innovation Tracking System

## Issue: Repeated OPTIONS Requests / CORS Issues

### Problem
You're seeing repeated OPTIONS requests in the server logs, indicating that the actual API requests may be failing.

### Symptoms
```
::1 - - [07/Mar/2026:06:07:52 +0000] "OPTIONS /api/ideas/my HTTP/1.1" 204
```

### Cause
1. **Port Mismatch**: Frontend running on port 3000 but backend configured for port 5173
2. **CORS Preflight**: Browser sending OPTIONS before each request
3. **Authentication Issues**: JWT token may be invalid or missing

---

## Solution Applied

### 1. Updated CORS Configuration
The backend now accepts connections from multiple ports:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:5174`

### 2. Enhanced Socket.IO CORS
Socket.IO also configured for multiple origins.

### 3. Changed Morgan to 'dev' mode
Easier to read logs during development.

---

## How to Restart the Server

### Stop Current Server
In the terminal running the server, press `Ctrl + C`

### Start Server Again
```bash
cd E:\PCDP\Innovation-Tracking-System\server
npm run dev
```

You should see:
```
Server running on port 5004
Socket.IO server ready for real-time connections
```

---

## Verify the Fix

### 1. Check Frontend Port
Check which port your frontend is running on by looking at the terminal where you started it:
```
  ➜  Local:   http://localhost:3000/
```
or
```
  ➜  Local:   http://localhost:5173/
```

### 2. Update Client .env (if needed)
If your frontend is on port 3000, the API URL should still be:
```env
VITE_API_URL=http://localhost:5004
```

### 3. Test the Connection

#### Method 1: Browser Console
Open browser DevTools → Console, and run:
```javascript
localStorage.getItem('auth_token')
```

If this returns `null`, you need to log in again.

#### Method 2: Check Network Tab
1. Open DevTools → Network tab
2. Reload the page
3. Look for API calls like `/api/ideas/my`
4. Check the status code:
   - **200** = Success ✅
   - **401** = Not authenticated (need to login)
   - **403** = No permission
   - **500** = Server error

---

## Common Issues & Fixes

### Issue 1: 401 Unauthorized
**Cause**: No JWT token or expired token

**Fix**:
1. Log out (if visible in UI)
2. Clear browser storage:
   ```javascript
   localStorage.clear()
   ```
3. Refresh the page
4. Login again

### Issue 2: Role Mismatch
**Cause**: User role doesn't match the required endpoint permission

**Example**: 
- Innovator trying to access `/api/ideas` (Admin only)
- Should use `/api/ideas/my` instead

**Fix**: Check which role you're logged in as and ensure you're accessing the correct endpoints.

### Issue 3: CORS Still Blocked
**Cause**: Server not restarted after configuration change

**Fix**:
1. Stop the server (`Ctrl + C`)
2. Clear the terminal
3. Start again: `npm run dev`

### Issue 4: Database Error
**Cause**: Database migrations not run or corrupted database

**Fix**:
```bash
cd E:\PCDP\Innovation-Tracking-System\server
npx prisma migrate reset
npx prisma db seed
npm run dev
```

---

## Checking Server Status

### Test Health Endpoint
Open browser or use curl:
```
http://localhost:5004/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-03-07T06:07:49.000Z"
}
```

### Test Authentication
Using Postman or Thunder Client:

**1. Login Request:**
```
POST http://localhost:5004/api/auth/login
Content-Type: application/json

{
  "email": "innovator@example.com",
  "password": "innovator123"
}
```

**2. Use Token in Subsequent Requests:**
```
GET http://localhost:5004/api/ideas/my
Authorization: Bearer <your_token_here>
```

---

## Frontend Debugging

### Check API Service Configuration
Verify the API base URL in the browser console:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

Should output: `http://localhost:5004`

### Check Token Interceptor
The Axios interceptor should automatically add the token. Verify in Network tab:
- Request Headers should include: `Authorization: Bearer eyJhbGc...`

### Common Frontend Errors

**Error: "Network Error"**
- Server is not running
- Wrong API URL in .env
- CORS not configured

**Error: "Request failed with status 401"**
- Not logged in
- Token expired
- Token not being sent

**Error: "Request failed with status 403"**
- Wrong role for endpoint
- User doesn't have permission

---

## Quick Test Sequence

### 1. Register a Test User
```bash
POST http://localhost:5004/api/auth/register
{
  "name": "Test Innovator",
  "email": "test@test.com",
  "password": "test123",
  "role": "innovator"
}
```

### 2. Login
```bash
POST http://localhost:5004/api/auth/login
{
  "email": "test@test.com",
  "password": "test123"
}
```

Save the token from the response.

### 3. Get My Ideas
```bash
GET http://localhost:5004/api/ideas/my
Authorization: Bearer <token>
```

Should return empty array initially: `{ "success": true, "data": [] }`

### 4. Submit an Idea
```bash
POST http://localhost:5004/api/ideas
Authorization: Bearer <token>
{
  "title": "Test Idea from Troubleshooting",
  "description": "This is a test idea to verify the system is working correctly.",
  "domain": "Testing"
}
```

Should return the created idea.

---

## Server Logs - What to Look For

### Good Logs (Working)
```
Server running on port 5004
Socket.IO server ready for real-time connections
User 3 (reviewer) authenticated and joined rooms
GET /api/ideas/my 200 45.678 ms - 1234
POST /api/ideas 201 78.901 ms - 567
```

### Bad Logs (Issues)
```
CORS Warning: Origin http://localhost:3000 not allowed  ❌ (Fixed now)
GET /api/ideas/my 401 12.345 ms - 89              ❌ (Not authenticated)
POST /api/ideas 403 23.456 ms - 67                ❌ (No permission)
Error: Invalid token                               ❌ (Token issue)
```

---

## Still Not Working?

### Check All Services Are Running

**Backend:**
```bash
# Should be running on port 5004
cd E:\PCDP\Innovation-Tracking-System\server
npm run dev
```

**Frontend:**
```bash
# Should be running on port 3000 or 5173
cd E:\PCDP\Innovation-Tracking-System\client
npm run dev
```

### Restart Everything
1. Stop both servers (`Ctrl + C` in each terminal)
2. Clear browser cache and local storage
3. Start backend first: `cd server && npm run dev`
4. Start frontend second: `cd client && npm run dev`
5. Open browser in incognito/private mode
6. Register a new user and test

### Check for Port Conflicts
```powershell
# Check if ports are in use
netstat -ano | findstr :5004
netstat -ano | findstr :5173
netstat -ano | findstr :3000
```

If ports are occupied by other processes, either:
- Kill those processes
- Change ports in .env files

---

## Need More Help?

### Enable Detailed Logging

In `server/src/index.js`, add more logging:
```javascript
// After CORS middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});
```

### Check Environment Variables
```bash
cd server
cat .env
```

Should show:
```env
PORT=5004
DATABASE_URL="file:./dev.db"
JWT_SECRET=innovation_tracking_super_secret_key_2026
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:5173
```

---

## Summary of Changes Made

✅ CORS now accepts multiple origins (3000, 5173, 5174)  
✅ Socket.IO CORS updated  
✅ Morgan logging changed to 'dev' mode  
✅ Detailed CORS error logging added  
✅ Methods and headers explicitly allowed  

**Next Step**: Restart your server and try again!
