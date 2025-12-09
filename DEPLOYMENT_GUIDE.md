# 🚀 Live Clock Deployment Guide

Complete guide for deploying the Live Clock application to production.

## 📋 Overview

- **Backend**: FastAPI (Python) → Render
- **Frontend**: React + Vite → Vercel  
- **Database**: MongoDB Atlas (Cluster0)
- **Authentication**: JWT-based with bcrypt password hashing

---

## 🔧 Prerequisites

✅ MongoDB Atlas cluster configured (Cluster0)  
✅ GitHub repository: https://github.com/areebailyas4321-lab/login_mongodb_liveclock-  
✅ Render account  
✅ Vercel account  

---

## 🎯 Deployment Steps

### Step 1: Deploy Backend to Render

#### Option A: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `areebailyas4321-lab/login_mongodb_liveclock-`
   - Configure the service:

**Service Configuration:**
```
Name: login-backend-api
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
Instance Type: Free (512 MB RAM, 0.1 CPU)
```

**Environment Variables:**
```
MONGO_DETAILS=mongodb+srv://areebailyas4321_db_user:KtzA8iTX94fEXDUN@cluster0.xyz.mongodb.net/?retryWrites=true&w=majority

SECRET_KEY=KUZTfth6hZ7lol5MQ5fGZ4TRTiCLfxhCR0c5vE35o4M

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30
```

3. **Deploy**: Click "Create Web Service"
4. **Wait for deployment** (5-10 minutes for first deploy)
5. **Copy your backend URL**: `https://login-backend-api.onrender.com`

#### Option B: Using render.yaml (Infrastructure as Code)

1. Push `render.yaml` to your repository
2. In Render Dashboard, click "New +" → "Blueprint"
3. Connect repository and select `render.yaml`
4. Update `ALLOWED_ORIGINS` environment variable after frontend deployment

---

### Step 2: Deploy Frontend to Vercel

#### Using Vercel Dashboard

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Import Project**:
   - Click "Add New..." → "Project"
   - Import from GitHub: `areebailyas4321-lab/login_mongodb_liveclock-`
   - Configure the project:

**Project Configuration:**
```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Environment Variables:**
```
VITE_API_URL=https://login-backend-api.onrender.com
```
*(Replace with your actual Render backend URL)*

3. **Deploy**: Click "Deploy"
4. **Wait for deployment** (2-5 minutes)
5. **Copy your frontend URL**: e.g., `https://login-mongodb-liveclock.vercel.app`

---

### Step 3: Update Backend CORS

**Critical Step**: Update backend to allow frontend origin

1. Go to Render Dashboard → Your backend service
2. Navigate to "Environment" tab
3. Update `ALLOWED_ORIGINS` variable:
   ```
   ALLOWED_ORIGINS=https://login-mongodb-liveclock.vercel.app
   ```
   *(Replace with your actual Vercel URL)*
4. Click "Save Changes"
5. Backend will automatically redeploy (~2-3 minutes)

---

## ✅ Testing & Verification

### Backend Health Check
```bash
curl https://login-backend-api.onrender.com/
```
**Expected Response:**
```json
{"message": "Welcome to the Digital Clock Authentication API"}
```

### Test Registration
```bash
curl -X POST https://login-backend-api.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123!@#"}'
```

### Test Login
```bash
curl -X POST https://login-backend-api.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"Test123!@#"}'
```

### Frontend Testing

1. **Navigate to your frontend URL**
2. **Test Signup**:
   - Enter username (3+ characters)
   - Enter password (6+ chars, uppercase, lowercase, number, special char)
   - Click "Sign Up"
   - Verify success message and redirect to clock

3. **Test Login**:
   - Log out
   - Enter credentials
   - Click "Login"
   - Verify successful login

4. **Test Google Demo Login**:
   - Click "Continue with Google"
   - Verify automatic login

5. **Check Browser Console**:
   - Open DevTools (F12)
   - Verify no CORS errors
   - Verify API requests succeed

---

## 🔐 Security Notes

- ✅ MongoDB IP whitelist set to `0.0.0.0/0` (allows Render's dynamic IPs)
- ✅ SECRET_KEY is cryptographically secure (32 bytes)
- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens expire after 30 minutes
- ✅ CORS restricted to frontend domain only

---

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Backend not starting  
**Solution**: Check Render logs for Python errors, verify `requirements.txt` is correct

**Problem**: MongoDB connection failed  
**Solution**: Verify `MONGO_DETAILS` connection string, check MongoDB Atlas IP whitelist

**Problem**: 500 Internal Server Error  
**Solution**: Check Render logs, verify all environment variables are set

### Frontend Issues

**Problem**: API calls failing  
**Solution**: Verify `VITE_API_URL` is set correctly in Vercel environment variables

**Problem**: CORS errors  
**Solution**: Update `ALLOWED_ORIGINS` in Render backend to include Vercel URL

**Problem**: Blank page  
**Solution**: Check Vercel build logs, verify build command and output directory

### Authentication Issues

**Problem**: Login returns "Invalid credentials"  
**Solution**: Ensure user is registered first, verify password meets requirements

**Problem**: Token not persisting  
**Solution**: Check browser localStorage, verify JWT token is being saved

---

## 📝 Live URLs

**Backend API**: `https://login-backend-api.onrender.com`  
**Frontend App**: `https://login-mongodb-liveclock.vercel.app`  
*(Update these after deployment)*

---

## 🔄 Redeployment

### Backend
- Push changes to GitHub `main` branch
- Render auto-deploys on push
- Or manually redeploy from Render dashboard

### Frontend
- Push changes to GitHub `main` branch
- Vercel auto-deploys on push
- Or manually redeploy from Vercel dashboard

---

## 📞 Support

If you encounter issues:
1. Check Render/Vercel deployment logs
2. Verify environment variables
3. Test API endpoints individually
4. Check browser console for errors
5. Verify MongoDB Atlas connection

---

**Deployment completed successfully! 🎉**
