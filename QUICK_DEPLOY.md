# 🚀 Quick Deployment Instructions

## Step 1: Deploy Backend to Render

### You are currently on: https://dashboard.render.com/login

**Please follow these steps:**

1. **Log in to Render** using your credentials

2. **After login, click "New +" button** (top right) → Select **"Web Service"**

3. **Connect GitHub Repository:**
   - Click "Build and deploy from a Git repository"
   - Select repository: `areebailyas4321-lab/login_mongodb_liveclock-`
   - If not visible, click "Configure account" to authorize Render

4. **Configure Service Settings:**

```
Name: login-backend-api
Region: Oregon (US West)
Branch: main
Root Directory: backend
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
Instance Type: Free
```

5. **Add Environment Variables** (click "Add Environment Variable" for each):

```
MONGO_DETAILS
mongodb+srv://areebailyas4321_db_user:KtzA8iTX94fEXDUN@cluster0.xyz.mongodb.net/?retryWrites=true&w=majority

SECRET_KEY
KUZTfth6hZ7lol5MQ5fGZ4TRTiCLfxhCR0c5vE35o4M

ALLOWED_ORIGINS
http://localhost:5173,http://localhost:3000

ALGORITHM
HS256

ACCESS_TOKEN_EXPIRE_MINUTES
30
```

6. **Click "Create Web Service"** to start deployment

7. **Wait for deployment** (5-10 minutes) - Status will show "Live" when ready

8. **Copy your backend URL** from the top of the page (e.g., `https://login-backend-api.onrender.com`)

---

## Step 2: Deploy Frontend to Vercel

**After backend is deployed:**

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import from GitHub: `areebailyas4321-lab/login_mongodb_liveclock-`
4. Configure:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://login-backend-api.onrender.com` (your actual backend URL)
6. Click "Deploy"
7. Copy your frontend URL when deployment completes

---

## Step 3: Update Backend CORS

1. Go back to Render Dashboard → Your backend service
2. Click "Environment" tab
3. Edit `ALLOWED_ORIGINS` to: `https://your-frontend-url.vercel.app`
4. Save changes (backend will auto-redeploy)

---

## ✅ Test Your Deployment

Visit your frontend URL and test:
- Sign up with a new account
- Log in with credentials
- Try "Continue with Google" demo login

---

**Let me know when you complete each step and I'll help verify everything is working!**
