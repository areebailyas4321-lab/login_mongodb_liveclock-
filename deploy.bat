@echo off
echo ========================================
echo   LIVE CLOCK DEPLOYMENT AUTOMATION
echo ========================================
echo.

echo Step 1: Opening Render Dashboard...
echo Please log in to Render when the browser opens.
echo.
start https://dashboard.render.com/select-repo?type=web

timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo RENDER BACKEND CONFIGURATION
echo ========================================
echo.
echo Please configure your backend service with these settings:
echo.
echo Repository: areebailyas4321-lab/login_mongodb_liveclock-
echo.
echo SERVICE SETTINGS:
echo   Name: login-backend-api
echo   Region: Oregon (US West)
echo   Branch: main
echo   Root Directory: backend
echo   Runtime: Python 3
echo   Build Command: pip install -r requirements.txt
echo   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
echo   Instance Type: Free
echo.
echo ENVIRONMENT VARIABLES (copy these):
echo.
echo MONGO_DETAILS
echo mongodb+srv://areebailyas4321_db_user:KtzA8iTX94fEXDUN@cluster0.xyz.mongodb.net/?retryWrites=true^&w=majority
echo.
echo SECRET_KEY
echo KUZTfth6hZ7lol5MQ5fGZ4TRTiCLfxhCR0c5vE35o4M
echo.
echo ALLOWED_ORIGINS
echo http://localhost:5173,http://localhost:3000
echo.
echo ALGORITHM
echo HS256
echo.
echo ACCESS_TOKEN_EXPIRE_MINUTES
echo 30
echo.
echo ========================================
echo.
echo Press any key after backend deployment completes...
pause >nul

echo.
echo Step 2: Opening Vercel Dashboard...
timeout /t 2 /nobreak >nul
start https://vercel.com/new

echo.
echo ========================================
echo VERCEL FRONTEND CONFIGURATION
echo ========================================
echo.
echo Please configure your frontend with these settings:
echo.
echo Repository: areebailyas4321-lab/login_mongodb_liveclock-
echo.
echo PROJECT SETTINGS:
echo   Framework Preset: Vite
echo   Root Directory: frontend
echo   Build Command: npm run build
echo   Output Directory: dist
echo.
echo ENVIRONMENT VARIABLE:
echo   VITE_API_URL = [YOUR RENDER BACKEND URL]
echo   (Example: https://login-backend-api.onrender.com)
echo.
echo ========================================
echo.
echo Press any key after frontend deployment completes...
pause >nul

echo.
echo Step 3: Update Backend CORS...
echo.
echo Now go back to Render Dashboard and update ALLOWED_ORIGINS:
echo   1. Go to your backend service
echo   2. Click "Environment" tab
echo   3. Edit ALLOWED_ORIGINS to include your Vercel URL
echo   4. Save changes
echo.
start https://dashboard.render.com/

echo.
echo ========================================
echo   DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your application should now be live!
echo Test the authentication flow on your frontend URL.
echo.
pause
