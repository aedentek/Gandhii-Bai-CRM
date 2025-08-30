import express from 'express';
import db from '../db/config.js'; // Assuming you have a db.js file for database connection
import multer from 'multer';
import path  from 'path';
import fs  from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router()


// Send OTP for password reset
router.post('/send-otp', async (req, res) => {
  console.log('✅ Send OTP requested:', req.body);
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  try {
    // Check if user exists in management_users database
    const [rows] = await db.execute(
      'SELECT * FROM management_users WHERE username = ? AND user_status = ?', 
      [email, 'Active']
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found or inactive' });
    }
    
    const user = rows[0];
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiration (5 minutes)
    const otpData = {
      otp,
      email,
      userId: user.id,
      userRole: user.user_role,
      expires: Date.now() + (5 * 60 * 1000) // 5 minutes from now
    };
    
    otpStore.set(email, otpData);
    
    // Send OTP to aedentek@gmail.com
    const emailResult = await sendOTPEmail('aedentek@gmail.com', otp, email);
    
    if (emailResult.success) {
      console.log(`✅ OTP sent successfully to aedentek@gmail.com for user: ${email}`);
      
      // Auto-cleanup expired OTP after 5 minutes
      setTimeout(() => {
        otpStore.delete(email);
        console.log(`🗑️ OTP expired and removed for: ${email}`);
      }, 5 * 60 * 1000);
      
      res.json({ 
        message: 'OTP sent successfully',
        sentTo: 'aedentek@gmail.com',
        expiresIn: 300 // 5 minutes in seconds
      });
    } else {
      console.error('❌ Failed to send OTP email:', emailResult.error);
      res.status(500).json({ 
        error: 'Failed to send OTP email',
        details: emailResult.error 
      });
    }
    
  } catch (error) {
    console.error('❌ Error sending OTP:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
  console.log('✅ Verify OTP requested:', req.body);
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }
  
  const otpData = otpStore.get(email);
  
  if (!otpData) {
    return res.status(404).json({ error: 'No OTP found for this email' });
  }
  
  if (Date.now() > otpData.expires) {
    otpStore.delete(email);
    return res.status(410).json({ error: 'OTP has expired' });
  }
  
  if (otpData.otp !== otp) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }
  
  console.log('✅ OTP verified successfully for:', email);
  res.json({ 
    message: 'OTP verified successfully',
    userId: otpData.userId,
    userRole: otpData.userRole
  });
});
// ================================
// BACKUP ENDPOINT
// ================================
router.post('/backup-database', async (req, res) => {
  try {
    // Simple backup simulation - in production, implement proper backup
    res.json({ message: 'Database backup initiated', timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('Error creating backup:', err);
    res.status(500).json({ error: err.message });
  }
});

// ================================
// HEALTH CHECK
// ================================
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Unified CRM server is running', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

router.get('/settings', async (req, res) => {
  console.log('🔍 All settings requested');
  try {
    const [rows] = await db.execute('SELECT * FROM app_settings ORDER BY setting_key');
    console.log('✅ Settings fetched successfully:', rows.length, 'settings');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error fetching settings:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch settings',
      details: error.message 
    });
  }
});


router.get('/settings/:key', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM app_settings WHERE setting_key = ?', [req.params.key]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json({ key: rows[0].setting_key, value: rows[0].setting_value });
  } catch (err) {
    console.error('Error fetching setting:', err);
    res.status(500).json({ error: err.message });
  }
});

router.put('/settings/:key', async (req, res) => {
  try {
    const { value } = req.body;
    const [result] = await db.execute(
      'INSERT INTO app_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
      [req.params.key, value]
    );
    res.json({ key: req.params.key, value: value, message: 'Setting updated successfully' });
  } catch (err) {
    console.error('Error updating setting:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/settings', async (req, res) => {
  try {
    const { key, value, setting_type = 'text', description = '' } = req.body;
    
    if (!key) {
      return res.status(400).json({ error: 'Setting key is required' });
    }
    
    const [result] = await db.execute(
      `INSERT INTO app_settings (setting_key, setting_value, setting_type, description) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       setting_value = VALUES(setting_value), 
       setting_type = VALUES(setting_type), 
       description = VALUES(description),
       updated_at = CURRENT_TIMESTAMP`,
      [key, value || '', setting_type, description]
    );
    
    res.json({ 
      key, 
      value: value || '', 
      setting_type, 
      description, 
      message: 'Setting created/updated successfully' 
    });
  } catch (err) {
    console.error('Error creating setting:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete setting
router.delete('/settings/:key', async (req, res) => {
  try {
    const settingKey = req.params.key;
    
    // Check if setting exists
    const [existingRows] = await db.execute(
      'SELECT * FROM app_settings WHERE setting_key = ?', 
      [settingKey]
    );
    
    if (existingRows.length === 0) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    // Delete the setting
    const [result] = await db.execute(
      'DELETE FROM app_settings WHERE setting_key = ?', 
      [settingKey]
    );
    
    if (result.affectedRows > 0) {
      res.json({ 
        message: 'Setting deleted successfully', 
        key: settingKey,
        deleted: true
      });
    } else {
      res.status(500).json({ error: 'Failed to delete setting' });
    }
  } catch (err) {
    console.error('Error deleting setting:', err);
    res.status(500).json({ error: err.message });
  }
});

// Bulk operations for settings
router.post('/settings/bulk-update', async (req, res) => {
  try {
    const { settings } = req.body;
    
    if (!Array.isArray(settings) || settings.length === 0) {
      return res.status(400).json({ error: 'Settings array is required' });
    }
    
    const results = [];
    
    for (const setting of settings) {
      const { key, value, setting_type = 'text', description = '' } = setting;
      
      if (!key) {
        results.push({ key: 'unknown', error: 'Setting key is required' });
        continue;
      }
      
      try {
        const [result] = await db.execute(
          `INSERT INTO app_settings (setting_key, setting_value, setting_type, description) 
           VALUES (?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE 
           setting_value = VALUES(setting_value), 
           setting_type = VALUES(setting_type), 
           description = VALUES(description),
           updated_at = CURRENT_TIMESTAMP`,
          [key, value || '', setting_type, description]
        );
        
        results.push({ key, success: true, message: 'Updated successfully' });
      } catch (error) {
        results.push({ key, error: error.message });
      }
    }
    
    res.json({ 
      message: 'Bulk update completed', 
      results,
      total: settings.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => r.error).length
    });
  } catch (err) {
    console.error('Error in bulk update:', err);
    res.status(500).json({ error: err.message });
  }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'settings');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalName = file.originalname;
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    
    // Create a clean filename for settings
    const cleanBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filename = `${cleanBaseName}_${timestamp}${extension}`;
    
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow images and some other common file types
    const allowedMimes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
      'text/plain',
      'application/json',
      'text/css',
      'application/javascript'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and text files are allowed.'));
    }
  }
});

// Settings file upload endpoint
router.post('/settings/upload-file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { setting_key, description = '' } = req.body;
    
    if (!setting_key) {
      // Clean up uploaded file if setting_key is missing
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Setting key is required' });
    }

    const fileUrl = `/uploads/settings/${req.file.filename}`;
    
    // Save the setting to database
    const [result] = await db.execute(
      `INSERT INTO app_settings (setting_key, setting_value, setting_type, description, file_path) 
       VALUES (?, ?, 'file', ?, ?) 
       ON DUPLICATE KEY UPDATE 
       setting_value = VALUES(setting_value), 
       setting_type = 'file', 
       description = VALUES(description),
       file_path = VALUES(file_path),
       updated_at = CURRENT_TIMESTAMP`,
      [setting_key, req.file.originalname, description, req.file.path]
    );

    res.json({
      message: 'File uploaded and setting saved successfully',
      setting_key,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileUrl: fileUrl,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });
    
  } catch (err) {
    console.error('Error uploading settings file:', err);
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: err.message });
  }
});

// Get settings file (serve files)
router.get('/settings/files/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', 'settings', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.sendFile(filePath);
  } catch (err) {
    console.error('Error serving settings file:', err);
    res.status(500).json({ error: err.message });
  }
});

// Delete settings file
router.delete('/settings/files/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'uploads', 'settings', filename);
    
    // Find and update the setting that references this file
    const [settingRows] = await db.execute(
      'SELECT * FROM app_settings WHERE file_path LIKE ?',
      [`%${filename}%`]
    );
    
    if (settingRows.length > 0) {
      // Clear the file reference from the setting
      await db.execute(
        'UPDATE app_settings SET setting_value = "", file_path = NULL WHERE file_path LIKE ?',
        [`%${filename}%`]
      );
    }
    
    // Delete the physical file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ 
        message: 'File deleted successfully',
        filename,
        settingsUpdated: settingRows.length
      });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (err) {
    console.error('Error deleting settings file:', err);
    res.status(500).json({ error: err.message });
  }
});

// Original multer setup for backward compatibility
const legacyStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads', 'patients');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'new_file_' + uniqueSuffix + path.extname(file.originalname));
  }
});
const legacyUpload = multer({ storage: legacyStorage });

router.post('/upload-settings-file', legacyUpload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ 
      message: 'Settings file uploaded successfully', 
      filename: req.file.filename,
      filePath: req.file.path,
      url: `/uploads/patients/${req.file.filename}`
    });
  } catch (err) {
    console.error('Error uploading settings file:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload-medical-history-file', legacyUpload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ 
      message: 'Medical history file uploaded successfully', 
      filename: req.file.filename,
      filePath: req.file.path,
      url: `/uploads/patients/${req.file.filename}`
    });
  } catch (err) {
    console.error('Error uploading medical history file:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/delete-patient-file', async (req, res) => {
  try {
    const { filename } = req.body;
    const filePath = path.join(__dirname, 'uploads', 'patients', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (err) {
    console.error('Error deleting file:', err);
    res.status(500).json({ error: err.message });
  }
});


export default router;