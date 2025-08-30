# 🏥 Gandhi Bai CRM - Complete Healthcare Management System

A comprehensive healthcare Customer Relationship Management system built with modern web technologies, specifically designed for healthcare institutions and addiction treatment centers.

## ✨ Features

### 🔐 Authentication & Security
- Secure login system with role-based permissions
- User management with custom roles
- Protected routes and access control

### 👥 Patient Management
- Complete patient registration and management
- Patient biodata with photo support
- Medical records and history tracking
- Patient attendance management
- Payment and fees tracking
- Test report amount management

### 👨‍⚕️ Staff & Doctor Management
- Doctor profile management with photos
- Staff member registration and tracking
- Attendance management system
- Salary and advance payment tracking
- Role-based categorization

### 💊 Inventory Management
- Medicine inventory and stock management
- Grocery and supplies management
- Category and supplier management
- Stock tracking and accounts

### 🎛️ Settings & Configuration
- Complete CRUD operations for system settings
- File upload support (logos, favicons, etc.)
- Dynamic favicon and branding
- Environment-based configuration

### 📊 Dashboard & Analytics
- Comprehensive dashboard with key metrics
- Financial tracking and reporting
- Real-time data visualization

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
