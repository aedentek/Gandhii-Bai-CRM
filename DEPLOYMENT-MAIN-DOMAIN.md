# 🚀 Deployment Guide - Main Domain Setup

## 🎯 **Deployment Strategy**

### **Architecture:**
- **Frontend**: `https://crm.gandhibaideaddictioncenter.com` (Main Domain)
- **Backend**: `https://gandhii-bai-crm.onrender.com` (Render.com)
- **Database**: Hostinger MySQL
- **Auto-Deploy**: GitHub Actions → Main Domain

---

## 📋 **Setup Checklist**

### ✅ **1. Domain Configuration**
**Main Domain Setup:**
- Domain: `crm.gandhibaideaddictioncenter.com`
- DNS A Record: Points to your hosting server IP
- No subdomain needed - direct main domain deployment

### ✅ **2. Hosting FTP Configuration**
**Required GitHub Secrets:**
```
FTP_SERVER=ftp.yourhostingprovider.com
FTP_USERNAME=your-ftp-username
FTP_PASSWORD=your-ftp-password
```

**Add these secrets in GitHub:**
1. Go to: `https://github.com/aedentek/Gandhii-Bai-CRM-/settings/secrets/actions`
2. Click "New repository secret"
3. Add each secret above

### ✅ **3. Backend Configuration (Render.com)**
**Current Setup:**
- Service: `https://gandhii-bai-crm.onrender.com`
- Environment Variables already configured
- Auto-deploy from GitHub enabled

**Required Environment Variables on Render:**
```
DB_HOST=srv1639.hstgr.io
DB_USER=u745362362_crmusername
DB_PASSWORD=Aedentek@123#
DB_NAME=u745362362_crm
NODE_ENV=production
ALLOWED_ORIGINS=https://crm.gandhibaideaddictioncenter.com
```

---

## 🔄 **Deployment Process**

### **Automatic Deployment:**
1. **Push to GitHub main branch**
2. **GitHub Actions triggers automatically**
3. **Builds with production config**
4. **Deploys via FTP to main domain**

### **Manual Deployment Commands:**
```bash
# 1. Set production environment
cp .env.production .env.local

# 2. Build for production
npm run build

# 3. Deploy (manual FTP upload of dist/ folder to public_html/)
```

---

## ⚙️ **Environment Configuration**

### **Current .env (Development):**
```bash
# Development URLs (current active)
# VITE_API_URL=http://localhost:4000/api  
# VITE_BASE_URL=http://localhost:8080

# Production URLs (current active)
VITE_API_URL=https://gandhii-bai-crm.onrender.com/api
VITE_BASE_URL=https://crm.gandhibaideaddictioncenter.com
```

### **For Local Development:**
Switch the comments to use localhost URLs.

---

## 🌐 **DNS Configuration**

### **Required DNS Records:**
```
Type: A Record
Name: crm
Value: [Your hosting server IP]
TTL: 300 (or auto)
```

### **Verification:**
```bash
# Test domain resolution
nslookup crm.gandhibaideaddictioncenter.com

# Test HTTPS
curl -I https://crm.gandhibaideaddictioncenter.com
```

---

## 📂 **File Structure for Deployment**

### **Build Output (dist/):**
```
dist/
├── index.html          # Main entry point
├── assets/             # CSS, JS, images
├── favicon.ico         # Site icon
└── robots.txt          # SEO file
```

### **Upload Target:**
```
public_html/            # Main domain root
├── index.html          # Your app
├── assets/             # App assets
└── [other files]       # App files
```

---

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **CORS Errors:**
   - Ensure Render backend has correct ALLOWED_ORIGINS
   - Check both HTTP and HTTPS URLs

2. **Build Failures:**
   - Verify all dependencies in package.json
   - Check Node.js version compatibility

3. **FTP Upload Issues:**
   - Verify FTP credentials in GitHub secrets
   - Check server-dir path (/public_html/)

4. **API Connection Issues:**
   - Verify backend URL in .env.production
   - Test backend API directly: https://gandhii-bai-crm.onrender.com/api/health

### **Testing Commands:**
```bash
# Test backend API
curl https://gandhii-bai-crm.onrender.com/api/settings

# Test frontend
curl -I https://crm.gandhibaideaddictioncenter.com

# Local build test
npm run build && npm run preview
```

---

## 📞 **Next Steps**

1. **Configure FTP secrets in GitHub**
2. **Push any code changes to main branch**
3. **Monitor GitHub Actions for deployment**
4. **Test live site functionality**
5. **Update DNS if needed**

**Your site will be live at:** `https://crm.gandhibaideaddictioncenter.com` 🚀
