# 🚀 Gandhi Bai CRM - Deployment Setup Guide

## 📋 Overview

This guide will help you deploy your CRM system with:
- **Frontend**: `https://gandhibaideaddictioncenter.com` (Main Domain)
- **Backend**: `https://gandhii-bai-crm.onrender.com` (Render.com)
- **Database**: Hostinger MySQL

## 🏗️ Architecture

```
Frontend (gandhibaideaddictioncenter.com)
    ↓ API Calls
Backend (gandhii-bai-crm.onrender.com) 
    ↓ Database Queries
MySQL Database (srv1639.hstgr.io)
```

## 🔧 Frontend Deployment (GitHub → Hostinger)

### Step 1: Configure GitHub Repository Secrets

Go to your GitHub repository: `https://github.com/aedentek/Gandhii-Bai-CRM-/settings/secrets/actions`

Add these secrets:

1. **FTP_HOST** = Your hosting FTP server (e.g., `ftp.gandhibaideaddictioncenter.com`)
2. **FTP_USERNAME** = Your cPanel/hosting FTP username
3. **FTP_PASSWORD** = Your cPanel/hosting FTP password
4. **FTP_LOCAL_DIR** = `./dist` (build output directory)
5. **FTP_SERVER_DIR** = `/public_html` or your domain's public folder

### Step 2: Domain Configuration

**In your hosting control panel:**

1. **Point Domain Root** to the CRM application
2. **Upload Files** to `/public_html/` (main domain root)
3. **Set Index File** to `index.html`

### Step 3: Automatic Deployment

The GitHub Action workflow will automatically:
1. ✅ Trigger on every push to `main` branch
2. ✅ Install dependencies and build the project
3. ✅ Upload built files to your hosting via FTP
4. ✅ Your site updates automatically

## 🎯 Backend Configuration (Already Set Up)

Your backend is already running on Render.com:
- ✅ **URL**: `https://gandhii-bai-crm.onrender.com`
- ✅ **Database**: Connected to Hostinger MySQL
- ✅ **CORS**: Configured for `gandhibaideaddictioncenter.com`

## 🔗 DNS & Domain Setup

### Required DNS Records

Make sure these are set in your domain DNS:

```
Type: A
Name: @
Value: [Your hosting server IP]

Type: CNAME  
Name: www
Value: gandhibaideaddictioncenter.com
```

### SSL Certificate

- ✅ Enable SSL in your hosting control panel
- ✅ Force HTTPS redirects
- ✅ Update security settings

## 🌐 Environment Configuration

### Current Setup (.env):
```env
# Production Configuration (Active)
VITE_API_URL=https://gandhii-bai-crm.onrender.com/api
VITE_BASE_URL=https://gandhibaideaddictioncenter.com

# Development (Commented Out)
# VITE_API_URL=http://localhost:4000/api  
# VITE_BASE_URL=http://localhost:8080
```

### To Switch to Development:
```bash
# Comment out production URLs
# VITE_API_URL=https://gandhii-bai-crm.onrender.com/api
# VITE_BASE_URL=https://gandhibaideaddictioncenter.com

# Uncomment development URLs
VITE_API_URL=http://localhost:4000/api  
VITE_BASE_URL=http://localhost:8080
```

## 📦 Manual Deployment Steps

### If GitHub Actions Don't Work:

1. **Build Locally**:
   ```bash
   npm run build
   ```

2. **Upload dist/ folder contents**:
   - Via FTP client (FileZilla, WinSCP)
   - Via cPanel File Manager
   - Upload to `/public_html/`

3. **Verify**:
   - Visit `https://gandhibaideaddictioncenter.com`
   - Check all functionality works

## 🔍 Troubleshooting

### Common Issues:

1. **Site Not Loading**:
   - Check DNS propagation (up to 24 hours)
   - Verify files uploaded to correct directory
   - Check hosting server status

2. **API Errors**:
   - Verify backend is running on Render.com
   - Check CORS settings allow your domain
   - Confirm database connection

3. **Build Failures**:
   - Check Node.js version (18+ required)
   - Verify all dependencies installed
   - Check build logs in GitHub Actions

### Support:
- **Repository**: https://github.com/aedentek/Gandhii-Bai-CRM-
- **Backend**: https://gandhii-bai-crm.onrender.com
- **Frontend**: https://gandhibaideaddictioncenter.com

## ✅ Final Checklist

- [ ] GitHub secrets configured
- [ ] Domain DNS pointing to hosting
- [ ] SSL certificate enabled
- [ ] GitHub Actions workflow running
- [ ] Backend API accessible
- [ ] Database connection working
- [ ] Frontend loading on main domain

Your CRM system is now ready for production deployment! 🎉
