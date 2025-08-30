# 🌐 RENDER CUSTOM DOMAIN SETUP GUIDE

## Current Status:
- Backend URL: https://gandhii-bai-crm.onrender.com ✅
- Frontend Domain: crm.gandhibaideaddictioncenter.com ❌ (not configured)

## Step 1: Add Custom Domain in Render
1. Go to your Render Dashboard: https://dashboard.render.com
2. Select your "Gandhii-Bai-CRM" service
3. Go to "Settings" tab (you're already there)
4. Click "Add Custom Domain" button
5. Enter: crm.gandhibaideaddictioncenter.com
6. Click "Save"

## Step 2: Update DNS in Hostinger
1. Login to Hostinger Control Panel
2. Go to "DNS/Nameservers" 
3. Add CNAME record:
   - Type: CNAME
   - Name: crm
   - Points to: gandhii-bai-crm.onrender.com
   - TTL: 3600

## Step 3: Update Environment Variables (CRITICAL!)
Your backend needs to accept requests from your custom domain:

Current CORS settings should include:
- https://crm.gandhibaideaddictioncenter.com
- https://gandhii-bai-crm.onrender.com

## Why This Matters:
Without proper domain configuration:
- API calls from frontend will fail due to CORS
- Authentication cookies won't work
- Backend will reject requests from undefined origins

## Expected Result:
- Frontend: https://crm.gandhibaideaddictioncenter.com
- Backend API: https://gandhii-bai-crm.onrender.com/api
- Both domains working together seamlessly
