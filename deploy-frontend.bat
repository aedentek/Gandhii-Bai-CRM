@echo off
echo 🚀 Deploying Frontend to Custom Domain...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Make sure you're in the project root.
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Build the frontend
echo 🔨 Building frontend...
npm run build

REM Check if build was successful
if not exist "dist" (
    echo ❌ Error: Build failed. No dist directory found.
    exit /b 1
)

echo ✅ Frontend built successfully!
echo.
echo 📋 Next Steps:
echo 1. Create a new Web Service on Render
echo 2. Use the render-frontend.yaml file for configuration
echo 3. Connect your GitHub repository
echo 4. Add the custom domain: crm.gandhibaideaddictioncenter.com
echo 5. Update DNS to point to the new frontend service
echo.
echo 🌐 Your setup will be:
echo    Frontend: https://crm.gandhibaideaddictioncenter.com
echo    Backend:  https://gandhii-bai-crm.onrender.com/api

pause
