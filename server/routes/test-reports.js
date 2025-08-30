import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const router = express.Router();

// Use the same database connection pattern as main server
const createDbConnection = async () => {
  try {
    return await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  } catch (error) {
    console.error('❌ Database connection failed in test-reports:', error.message);
    return null;
  }
};

const db = await createDbConnection();

// Create test_reports table if it doesn't exist (only if db connection is available)
if (db) {
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

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS test_reports (
      id INT AUTO_INCREMENT PRIMARY KEY,
      patient_id VARCHAR(20) NOT NULL,
      patient_name VARCHAR(255) NOT NULL,
      test_type VARCHAR(100) NOT NULL,
      test_date DATE NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      notes TEXT,
      status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      
      INDEX idx_patient_id (patient_id),
      INDEX idx_test_date (test_date),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;

  // Initialize table gracefully
  await createTableIfNotExists('test_reports', createTableQuery, 'Test reports');
} else {
  console.log('⚠️ Test reports: Database connection not available, skipping table creation');
}

// GET all test reports
router.get('/test-reports', async (req, res) => {
  try {
    console.log('🔍 GET /api/test-reports called');
    
    const [rows] = await db.execute(`
      SELECT * FROM test_reports 
      ORDER BY created_at DESC
    `);
    
    console.log(`✅ Retrieved ${rows.length} test reports from database`);
    
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('❌ Error fetching test reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch test reports',
      error: error.message
    });
  }
});

// GET test reports for specific patient
router.get('/test-reports/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    console.log(`🔍 GET test reports for patient: ${patientId}`);
    
    const [rows] = await db.execute(`
      SELECT * FROM test_reports 
      WHERE patient_id = ?
      ORDER BY test_date DESC
    `, [patientId]);
    
    console.log(`✅ Retrieved ${rows.length} test reports for patient ${patientId}`);
    
    res.json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('❌ Error fetching patient test reports:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient test reports',
      error: error.message
    });
  }
});

// POST new test report
router.post('/test-reports', async (req, res) => {
  try {
    console.log('✏️ POST /api/test-reports called');
    console.log('Request body:', req.body);
    
    const { patient_id, patient_name, test_type, test_date, amount, notes, status } = req.body;
    
    // Validation
    if (!patient_id || !patient_name || !test_type || !test_date || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: patient_id, patient_name, test_type, test_date, amount'
      });
    }
    
    const [result] = await db.execute(`
      INSERT INTO test_reports (patient_id, patient_name, test_type, test_date, amount, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [patient_id, patient_name, test_type, test_date, amount, notes || '', status || 'Pending']);
    
    // Fetch the created record
    const [newRecord] = await db.execute(`
      SELECT * FROM test_reports WHERE id = ?
    `, [result.insertId]);
    
    console.log(`✅ Test report created with ID: ${result.insertId}`);
    
    res.status(201).json({
      success: true,
      message: 'Test report created successfully',
      data: newRecord[0]
    });
  } catch (error) {
    console.error('❌ Error creating test report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create test report',
      error: error.message
    });
  }
});

// PUT update test report
router.put('/test-reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`✏️ PUT /api/test-reports/${id} called`);
    console.log('Request body:', req.body);
    
    const { test_type, test_date, amount, notes, status } = req.body;
    
    // Check if record exists
    const [existing] = await db.execute(`
      SELECT id FROM test_reports WHERE id = ?
    `, [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Test report not found'
      });
    }
    
    await db.execute(`
      UPDATE test_reports 
      SET test_type = ?, test_date = ?, amount = ?, notes = ?, status = ?
      WHERE id = ?
    `, [test_type, test_date, amount, notes || '', status || 'Pending', id]);
    
    // Fetch updated record
    const [updatedRecord] = await db.execute(`
      SELECT * FROM test_reports WHERE id = ?
    `, [id]);
    
    console.log(`✅ Test report ${id} updated successfully`);
    
    res.json({
      success: true,
      message: 'Test report updated successfully',
      data: updatedRecord[0]
    });
  } catch (error) {
    console.error('❌ Error updating test report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update test report',
      error: error.message
    });
  }
});

// DELETE test report
router.delete('/test-reports/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🗑️ DELETE /api/test-reports/${id} called`);
    
    // Check if record exists
    const [existing] = await db.execute(`
      SELECT id FROM test_reports WHERE id = ?
    `, [id]);
    
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Test report not found'
      });
    }
    
    await db.execute(`
      DELETE FROM test_reports WHERE id = ?
    `, [id]);
    
    console.log(`✅ Test report ${id} deleted successfully`);
    
    res.json({
      success: true,
      message: 'Test report deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting test report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete test report',
      error: error.message
    });
  }
});

console.log('📋 Test Reports router loaded with full CRUD operations');

export default router;
