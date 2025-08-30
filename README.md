# 🏥 Gandhi Bai CRM System

## 🎯 **Complete Healthcare Management System**

A comprehensive Customer Relationship Management system designed specifically for **Gandhi Bai De-addiction Center** with modern React frontend and Node.js backend.

---

## 🚀 **Live System**

- **Frontend**: `https://crm.gandhibaideaddictioncenter.com`
- **Backend**: `https://gandhii-bai-crm.onrender.com/api`
- **Repository**: `https://github.com/aedentek/Gandhi-Bai`

---

## ✨ **Key Features**

### **� Patient Management**
- Complete patient registration and profiles
- Medical history tracking with file uploads
- Attendance management
- Payment and fee tracking

### **� Staff & Doctor Management**  
- Staff and doctor registration
- Attendance tracking
- Salary management with advance payments
- Role-based access control

### **💰 Financial Management**
- Patient fee collection
- Staff/doctor salary processing
- Advance payment tracking
- Financial reporting

### **⚙️ Settings & Configuration**
- System settings with file upload
- Logo and branding customization
- User role management
- Database configuration

---

## �️ **Technology Stack**

### **Frontend:**
- **React 18** with TypeScript
- **Vite** for fast development
- **shadcn/ui** components
- **Tailwind CSS** for styling
- **TanStack Query** for data management

### **Backend:**
- **Node.js** with Express
- **MySQL** database (Hostinger)
- **Multer** for file uploads
- **RESTful APIs**

### **Deployment:**
- **Frontend**: Direct domain deployment via GitHub Actions
- **Backend**: Render.com
- **Database**: Hostinger MySQL
- **Storage**: File system with organized directory structure

---

## 📁 **Project Structure**

```
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/             # Application pages
│   ├── services/          # API services
│   └── styles/            # CSS and styling
├── server/                # Node.js backend  
│   ├── routes/            # API routes
│   ├── db/                # Database configuration
│   └── Photos/            # File storage
├── .github/workflows/     # CI/CD automation
└── docs/                  # Documentation
```

---

## 🔧 **Development Setup**

### **Prerequisites:**
- Node.js 18+
- MySQL database
- Git

### **Installation:**
```bash
# Clone repository
git clone https://github.com/aedentek/Gandhi-Bai.git
cd Gandhi-Bai

# Install dependencies  
npm install

# Setup environment
cp .env.example .env
# Configure your database credentials in .env

# Start development server
npm run dev

# Start backend (separate terminal)
cd server
npm install
node index.js
```

---

## 🚀 **Deployment**

### **Automatic Deployment:**
1. Push code to main branch
2. GitHub Actions builds automatically
3. Download build artifacts
4. Upload to hosting provider

### **Manual Deployment:**
```bash
# Build for production
npm run build

# Deploy dist/ folder to web server
```

---

## 📊 **System Status**

- ✅ **Production Ready**
- ✅ **Full CRUD Operations** 
- ✅ **File Upload System**
- ✅ **Role-based Security**
- ✅ **Mobile Responsive**
- ✅ **Database Optimized**
- ✅ **Auto-deployment Ready**

---

## 👥 **Team**

**Developed by**: AedenTek Solutions  
**Client**: Gandhi Bai De-addiction Center  
**Project Type**: Healthcare CRM System

---

## 📞 **Support**

For technical support or feature requests:
- **Repository**: [GitHub Issues](https://github.com/aedentek/Gandhi-Bai/issues)
- **Documentation**: Available in `/docs` folder
- **Live System**: Contact system administrator

---

**🎉 System is live and operational!** 🚀

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for modern UI components
- **React Router** for navigation
- **TanStack Query** for data management

### Backend
- **Node.js** with Express
- **MySQL** database with connection pooling
- **Multer** for file upload handling
- **CORS** enabled for cross-origin requests

### Database
- **MySQL** hosted on Hostinger
- Structured with proper relationships
- Environment variable configuration

## 🚀 Deployment Ready

### Environment Configuration
The system supports both development and production environments with easy switching:

```env
# Development URLs (default)
VITE_API_URL=http://localhost:4000/api  
VITE_BASE_URL=http://localhost:8080

# Production URLs (uncomment for deployment)
# VITE_API_URL=https://gandhii-bai-crm.onrender.com/api
# VITE_BASE_URL=https://gandhibaideaddictioncenter.com
```

### Database Configuration
```env
DB_HOST=srv1639.hstgr.io
DB_USER=u745362362_crmusername  
DB_PASSWORD=Aedentek@123#
DB_NAME=u745362362_crm
```

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/aedentek/Gandhii-Bai-CRM-.git
   cd Gandhii-Bai-CRM-
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd server && npm install
   ```

3. **Configure environment**
   - Copy `.env.example` to `.env`
   - Update database credentials
   - Configure API URLs

4. **Start the application**
   
   **Development:**
   ```bash
   # Terminal 1 - Frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd server && node index.js
   ```
   
   **Production:**
   ```bash
   npm run build
   npm run preview
   ```

## 🌐 Live Demo

- **Frontend:** https://gandhibaideaddictioncenter.com
- **Backend API:** https://gandhii-bai-crm.onrender.com

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/        # Reusable UI components
├── pages/            # Page components  
├── services/         # API service layers
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
└── styles/           # Global styles and CSS
```

### Backend Structure
```
server/
├── routes/           # API route definitions
├── db/              # Database configuration
├── dbmodels/        # Database models
├── migrations/      # Database migrations
└── Photos/          # File upload storage
```

## 🔧 Key Features Implemented

### ✅ Complete CRUD Operations
- All entities support Create, Read, Update, Delete operations
- File upload system for images and documents
- Dynamic data management

### ✅ Environment Integration
- All hardcoded URLs replaced with environment variables
- Seamless switching between development and production
- Database configuration via environment variables

### ✅ Modern UI/UX
- Responsive design for all screen sizes
- Modern card-based layouts
- Intuitive navigation and user experience
- Toast notifications for user feedback

### ✅ Production Ready
- Error handling and validation
- CORS configuration for deployment
- Optimized build process
- Clean code structure

## 👨‍💻 Development Team

**Lead Developer:** AedenTek  
**Repository:** https://github.com/aedentek/Gandhii-Bai-CRM-

## 📄 License

This project is proprietary software developed for Gandhi Bai Deaddiction Center.

## 🤝 Contributing

This is a private project. For any issues or feature requests, please contact the development team.

---

**Built with ❤️ for healthcare management excellence**
