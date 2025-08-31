
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import medicine from './routes/medicine.js'; 
import stock from './routes/general-stock.js'; 
import leads from './routes/leads.js';
import users from './routes/users.js';
import grocery from './routes/grocery-categories.js';
import patients from './routes/patients.js';
import staff from './routes/staff.js';
import management from './routes/management.js';
import doctor from './routes/doctor.js';
import general from './routes/general-categories.js';
import settings from './routes/settings.js'; 
import payment from './routes/settlement.js'; 
import roles from './routes/roles.js';
import fees from './routes/Fees.js';
import medicalRecords from './routes/medical-records.js';
import testReports from './routes/test-reports.js';
import doctorAdvance from './api/doctor-advance.js';
import staffAdvance from './api/staff-advance.js';
import doctorSalary from './api/doctor-salary.js';
import staffSalary from './api/staff-salary.js';
import patientPayments from './api/patient-payments.js';
// import uploads from './routes/uploads.js';
import uploads from './routes/uploads.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || process.env.API_PORT || 4000;

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://crm.gandhibaideaddictioncenter.com']
    : ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});


// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from Photos directory (new staff photos location)
app.use('/Photos', express.static(path.join(__dirname, 'Photos')));

// Serve static frontend files from dist folder with proper MIME types
const frontendPath = path.join(__dirname, '..', 'dist');
console.log(`📁 Serving frontend from: ${frontendPath}`);

// Check if dist folder exists and log its contents
import fs from 'fs';
if (fs.existsSync(frontendPath)) {
  console.log('✅ Frontend dist folder exists');
  const files = fs.readdirSync(frontendPath);
  console.log(`📂 Dist folder contents: ${files.join(', ')}`);
  
  // Check for index.html specifically
  const indexPath = path.join(frontendPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('✅ index.html found');
  } else {
    console.log('❌ index.html NOT found');
  }
} else {
  console.log('❌ Frontend dist folder does NOT exist');
  console.log(`❌ Expected path: ${frontendPath}`);
  
  // Try to find where the build files might be
  console.log('🔍 Checking current directory contents:');
  const currentDir = process.cwd();
  console.log(`📍 Current working directory: ${currentDir}`);
  if (fs.existsSync(currentDir)) {
    const currentFiles = fs.readdirSync(currentDir);
    console.log(`📂 Current directory contents: ${currentFiles.join(', ')}`);
  }
}

// Serve static files with proper MIME types and caching
app.use(express.static(frontendPath, {
  setHeaders: (res, path) => {
    // Set proper MIME types for different file types
    if (path.endsWith('.js') || path.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript');
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (path.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/json');
    } else if (path.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml');
    } else if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
    
    // Add cache headers for static assets
    if (path.includes('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 hour
    }
  }
}));

// Specific middleware for JavaScript files to ensure proper MIME type
app.get('*.js', (req, res, next) => {
  res.setHeader('Content-Type', 'application/javascript');
  next();
});

// Specific middleware for CSS files
app.get('*.css', (req, res, next) => {
  res.setHeader('Content-Type', 'text/css');
  next();
});

// API Health Check Route (only for /api/health)
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '🏥 Gandhi Bai CRM API Server', 
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      patients: '/api/patients',
      staff: '/api/staff',
      doctors: '/api/doctor',
      settings: '/api/settings'
    },
    timestamp: new Date().toISOString()
  });
});

// API Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'Gandhi Bai CRM API is running',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// MySQL connection config (now using environment variables)
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log(`Connected to MySQL database at ${process.env.DB_HOST}`);



app.use('/api', stock); 
app.use('/api', medicine); 
app.use('/api', leads); 
app.use('/api', users);
app.use('/api', grocery);
app.use('/api', uploads); // MOVED BEFORE PATIENTS TO TAKE PRIORITY
console.log('📁 Uploads middleware registered at /api');
app.use('/api', patients);
app.use('/api', staff);
app.use('/api', management);
app.use('/api', doctor);
app.use('/api', general);
app.use('/api', settings); 
app.use('/api', payment); 
app.use('/api', roles);
app.use('/api', medicalRecords);
app.use('/api', fees);
app.use('/api', testReports);
app.use('/api', doctorAdvance);
app.use('/api', staffAdvance);
app.use('/api', doctorSalary);
app.use('/api', staffSalary);
app.use('/api', patientPayments);
console.log('🧪 Test Reports middleware registered at /api');
console.log('👨‍⚕️ Staff Advance middleware registered at /api');
console.log('💰 Doctor Salary middleware registered at /api');
console.log('💼 Staff Salary middleware registered at /api');
console.log('🏥 Patient Payments middleware registered at /api');

// Utility function to handle table creation gracefully
const createTableIfNotExists = async (tableName, createQuery, description) => {
  try {
    // First check if table exists
    const [tables] = await db.execute(`SHOW TABLES LIKE '${tableName}'`);
    
    if (tables.length > 0) {
      console.log(`✅ ${description} table already exists`);
      return;
    }
    
    // Table doesn't exist, try to create it
    await db.execute(createQuery);
    console.log(`✅ ${description} table created successfully`);
    
  } catch (err) {
    if (err.message.includes('Access denied')) {
      console.log(`ℹ️ ${description} table: CREATE permission not available (expected in production)`);
      
      // Check if table exists anyway (might have been created by admin)
      try {
        const [tables] = await db.execute(`SHOW TABLES LIKE '${tableName}'`);
        if (tables.length > 0) {
          console.log(`✅ ${description} table exists (created by admin)`);
        } else {
          console.log(`⚠️ ${description} table missing and cannot be created - please contact database admin`);
        }
      } catch (checkErr) {
        console.log(`⚠️ Cannot verify ${description} table existence:`, checkErr.message);
      }
    } else {
      console.log(`⚠️ ${description} table setup error:`, err.message);
    }
  }
};

// Create staff attendance table
await createTableIfNotExists('staff_attendance', `
  CREATE TABLE IF NOT EXISTS staff_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id VARCHAR(20) NOT NULL,
    staff_name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    check_in TIME DEFAULT NULL,
    check_out TIME DEFAULT NULL,
    status ENUM('Present', 'Absent', 'Late', 'Half Day') NOT NULL DEFAULT 'Present',
    working_hours VARCHAR(20) DEFAULT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_staff_id (staff_id),
    INDEX idx_date (date),
    INDEX idx_staff_date (staff_id, date),
    INDEX idx_status (status),
    
    UNIQUE KEY unique_staff_date (staff_id, date)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`, 'Staff attendance');

// Create patient monthly records table for carry forward functionality
await createTableIfNotExists('patient_monthly_records', `
  CREATE TABLE IF NOT EXISTS patient_monthly_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(20) NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    monthly_fees DECIMAL(10,2) DEFAULT 0.00,
    other_fees DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    amount_paid DECIMAL(10,2) DEFAULT 0.00,
    amount_pending DECIMAL(10,2) DEFAULT 0.00,
    carry_forward_from_previous DECIMAL(10,2) DEFAULT 0.00,
    carry_forward_to_next DECIMAL(10,2) DEFAULT 0.00,
    net_balance DECIMAL(10,2) DEFAULT 0.00,
    payment_status ENUM('pending', 'completed', 'partial') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_month_year (month, year),
    INDEX idx_patient_month_year (patient_id, month, year),
    INDEX idx_payment_status (payment_status),
    
    UNIQUE KEY unique_patient_month_year (patient_id, month, year)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`, 'Patient monthly records');

// Create patient payment history table
await createTableIfNotExists('patient_payment_history', `
  CREATE TABLE IF NOT EXISTS patient_payment_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(20) NOT NULL,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_mode ENUM('Cash', 'Card', 'Bank Transfer', 'UPI', 'Cheque') DEFAULT 'Bank Transfer',
    type ENUM('fee_payment', 'advance_payment', 'partial_payment') DEFAULT 'fee_payment',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_patient_id (patient_id),
    INDEX idx_payment_date (payment_date),
    INDEX idx_patient_payment_date (patient_id, payment_date),
    INDEX idx_type (type)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
`, 'Patient payment history');

// Catch-all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  // Don't serve React app for API routes
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  console.log(`📄 Serving React app from: ${indexPath} for route: ${req.path}`);
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('❌ Error serving React app:', err);
      res.status(500).send('Error loading application');
    }
  });
});

// Bind server to all interfaces so external checks can detect the service
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📝 CRM API endpoints are ready`);
  console.log(`💾 Database connection established`);
  console.log(`🔧 Effective PORT env value: ${process.env.API_PORT ?? 'not set'}\n`);
});


