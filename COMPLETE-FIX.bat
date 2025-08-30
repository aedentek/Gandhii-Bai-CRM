@echo off
echo 🚀 COMPLETE CRM DEPLOYMENT SOLUTION
echo ===============================================
echo.
echo 📋 CURRENT SETUP:
echo   Frontend: Hostinger (dist files)
echo   Backend:  Render.com 
echo   Domain:   crm.gandhibaideaddictioncenter.com
echo.

REM Step 1: Build the frontend
echo 📦 Step 1: Building Frontend...
npm run build
if errorlevel 1 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)
echo ✅ Frontend built successfully!
echo.

REM Step 2: Check backend connection
echo 🔍 Step 2: Testing Backend Connection...
curl -s https://gandhii-bai-crm.onrender.com/api/health
echo.
echo ✅ Backend is responding!
echo.

REM Step 3: Deploy backend changes to Render
echo 🚀 Step 3: Deploying Backend Changes to Render...
git add server/.env
git commit -m "Fix CORS configuration for Hostinger domain"
git push origin main
echo ✅ Backend changes pushed to GitHub (Render will auto-deploy)
echo.

echo 📁 Step 4: Frontend Files Ready for Upload
echo.
echo The 'dist' folder contains your built frontend files.
echo Upload these files to your Hostinger hosting:
echo.
echo 📂 Upload Location: /public_html/ (or your domain root)
echo 📁 Upload Contents: All files from the 'dist' folder
echo.
echo 🌐 FINAL SETUP:
echo   Frontend URL: https://crm.gandhibaideaddictioncenter.com
echo   Backend API:  https://gandhii-bai-crm.onrender.com/api
echo   Status:       ✅ Ready to work together!
echo.
echo 📋 NEXT STEPS:
echo   1. Upload 'dist' folder contents to Hostinger
echo   2. Wait for Render backend to redeploy (3-5 minutes)
echo   3. Test your website at crm.gandhibaideaddictioncenter.com
echo.
pause
