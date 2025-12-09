# 🚀 Deployment Guide

This guide will help you deploy your full-stack Live Clock application to production using:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas

---

## 📋 Prerequisites

- GitHub account with your code pushed
- MongoDB Atlas account (free tier available)
- Vercel account
- Render account

---

## Step 1: 🍃 Setup MongoDB Atlas

### 1.1 Create Database Cluster

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign up or log in
3. Click **"Build a Database"**
4. Select **FREE** tier (M0 Sandbox)
5. Choose your preferred cloud provider and region
6. Click **"Create Cluster"** (takes 1-3 minutes)

### 1.2 Create Database User

1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username and password (save these!)
5. Set **"Built-in Role"** to **"Read and write to any database"**
6. Click **"Add User"**

### 1.3 Configure Network Access

1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for Render/Vercel)
4. Click **"Confirm"**

### 1.4 Get Connection String

1. Go back to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.mongodb.net/`)
5. Replace `<password>` with your actual database user password
6. Add database name: `mongodb+srv://username:password@cluster.mongodb.net/clock_app?retryWrites=true&w=majority`

**Save this connection string!** You'll need it for Render.

---

## Step 2: 🚀 Deploy Backend to Render

### 2.1 Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `https://github.com/areebailyas4321-lab/login_mongodb_liveclock-`
4. Configure the service:
   - **Name**: `live-clock-backend` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 2.2 Add Environment Variables

In the **Environment Variables** section, add:

| Key | Value |
|-----|-------|
| `MONGO_DETAILS` | Your MongoDB Atlas connection string from Step 1.4 |
| `SECRET_KEY` | Generate with: `openssl rand -hex 32` or use any random 64-character string |
| `ALLOWED_ORIGINS` | Leave empty for now (will update after Vercel deployment) |

### 2.3 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Once deployed, copy your backend URL (e.g., `https://live-clock-backend.onrender.com`)

### 2.4 Test Backend

Visit `https://your-backend-url.onrender.com/docs` to see the API documentation.

---

## Step 3: ⚡ Deploy Frontend to Vercel

### 3.1 Create New Project

1. Go to [Vercel](https://vercel.com/new)
2. Import your GitHub repository: `https://github.com/areebailyas4321-lab/login_mongodb_liveclock-`
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.2 Add Environment Variables

In the **Environment Variables** section, add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | Your Render backend URL from Step 2.3 (e.g., `https://live-clock-backend.onrender.com`) |

### 3.3 Deploy

1. Click **"Deploy"**
2. Wait for deployment (2-5 minutes)
3. Once deployed, copy your frontend URL (e.g., `https://your-app.vercel.app`)

---

## Step 4: 🔄 Update Backend CORS

Now that you have your Vercel frontend URL, update the backend:

1. Go back to your **Render Dashboard**
2. Select your backend service
3. Go to **"Environment"** tab
4. Update `ALLOWED_ORIGINS` to: `https://your-app.vercel.app`
5. Click **"Save Changes"**
6. Render will automatically redeploy

---

## Step 5: ✅ Test Your Application

1. Visit your Vercel frontend URL
2. Try registering a new user
3. Log in with your credentials
4. Verify the clock and all widgets work
5. Check that data persists in MongoDB Atlas

---

## 🔧 Troubleshooting

### Backend Issues
- **500 Error**: Check Render logs for MongoDB connection issues
- **CORS Error**: Verify `ALLOWED_ORIGINS` includes your Vercel URL

### Frontend Issues
- **API Connection Failed**: Verify `VITE_API_URL` is set correctly in Vercel
- **Build Failed**: Check that `frontend` is set as root directory

### Database Issues
- **Connection Timeout**: Verify Network Access allows all IPs (0.0.0.0/0)
- **Authentication Failed**: Double-check username/password in connection string

---

## 📝 Environment Variables Summary

### Backend (Render)
```
MONGO_DETAILS=mongodb+srv://username:password@cluster.mongodb.net/clock_app?retryWrites=true&w=majority
SECRET_KEY=your-64-character-random-string
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🎉 Congratulations!

Your full-stack application is now live! 

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Database**: MongoDB Atlas

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
