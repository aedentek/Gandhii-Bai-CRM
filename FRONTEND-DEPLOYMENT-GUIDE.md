# Frontend Deployment Guide

## 🎯 Deployment Strategy

### Backend: Render.com (Node.js)
- **URL**: https://gandhii-bai-crm.onrender.com
- **Status**: ✅ Already deployed and working

### Frontend: GitHub → Hostinger (Static Files)
- **Domain**: https://crm.gandhibaideaddictioncenter.com
- **Method**: GitHub webhook → Auto-deploy to hosting

## 🔧 Configuration Changes Needed

### 1. Environment Configuration
Create production environment file:
```env
# Production Environment
VITE_API_URL=https://gandhii-bai-crm.onrender.com/api
VITE_BASE_URL=https://crm.gandhibaideaddictioncenter.com
NODE_ENV=production
```

### 2. Build Configuration
The project is already configured with:
- `npm run build` - Builds for production
- `dist/` folder - Contains production files
- Vite configuration optimized for production

### 3. GitHub Actions for Auto-Deployment

#### Option A: FTP Deployment (Recommended for Hostinger)
Use GitHub Actions to automatically deploy to your hosting via FTP when you push to main branch.

#### Option B: Manual Upload
Build locally and upload `dist/` folder contents to your hosting.

## 📁 File Structure for Deployment

After building, upload these files to your domain's public folder:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── [other static files]
```

## 🎛️ Hostinger Setup Steps

1. **File Manager**: Access your domain's file manager
2. **Upload**: Upload `dist/` folder contents to `public_html/`
3. **Environment**: Ensure production URLs are active
4. **Test**: Verify frontend connects to Render backend

## 🔄 Auto-Deployment Workflow

1. Code changes pushed to GitHub main branch
2. GitHub Actions triggers build
3. Built files uploaded to Hostinger via FTP
4. Website updates automatically

## 🌐 Final URLs
- **Frontend**: https://crm.gandhibaideaddictioncenter.com
- **Backend**: https://gandhii-bai-crm.onrender.com/api
- **Database**: Hostinger MySQL (srv1639.hstgr.io)
