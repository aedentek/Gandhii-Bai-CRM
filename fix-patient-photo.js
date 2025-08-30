// Fix patient photo path in database
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database connection
const db = await mysql.createPool({
  host: process.env.DB_HOST || 'srv1639.hstgr.io',
  user: process.env.DB_USER || 'u745362362_crmusername',
  password: process.env.DB_PASSWORD || 'Aedentek@123#',
  database: process.env.DB_NAME || 'u745362362_crm',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

try {
  console.log('🔍 Checking patient P0113 photo issue...');
  
  // Get current patient data
  const [patients] = await db.query(`
    SELECT id, name, photo 
    FROM patients 
    WHERE id = 113
  `);
  
  if (patients.length === 0) {
    console.log('❌ Patient not found');
    process.exit(1);
  }
  
  const patient = patients[0];
  console.log(`👤 Patient: ${patient.name}`);
  console.log(`📸 Current photo path: ${patient.photo}`);
  
  // Update to the available photo file
  const correctPhotoPath = 'Photos/patient Admission/P0113/general_1755821371749.jpg';
  
  const [result] = await db.query(`
    UPDATE patients 
    SET photo = ? 
    WHERE id = 113
  `, [correctPhotoPath]);
  
  console.log(`✅ Updated photo path to: ${correctPhotoPath}`);
  console.log(`📊 Rows affected: ${result.affectedRows}`);
  
  // Verify the change
  const [updatedPatients] = await db.query(`
    SELECT id, name, photo 
    FROM patients 
    WHERE id = 113
  `);
  
  console.log(`🔍 Verification - Updated photo path: ${updatedPatients[0].photo}`);
  
} catch (error) {
  console.error('❌ Error:', error);
} finally {
  await db.end();
}
