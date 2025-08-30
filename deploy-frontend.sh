#!/bin/bash

echo "🚀 Deploying Frontend to Custom Domain..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Make sure you're in the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the frontend
echo "🔨 Building frontend..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. No dist directory found."
    exit 1
fi

echo "✅ Frontend built successfully!"
echo ""
echo "📋 Next Steps:"
echo "1. Create a new Web Service on Render"
echo "2. Use the render-frontend.yaml file for configuration"
echo "3. Connect your GitHub repository"
echo "4. Add the custom domain: crm.gandhibaideaddictioncenter.com"
echo "5. Update DNS to point to the new frontend service"
echo ""
echo "🌐 Your setup will be:"
echo "   Frontend: https://crm.gandhibaideaddictioncenter.com"
echo "   Backend:  https://gandhii-bai-crm.onrender.com/api"
