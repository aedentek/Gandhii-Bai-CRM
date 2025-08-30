import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('Creating patients table...');

await db.execute('DROP TABLE IF EXISTS patients');
console.log('Dropped existing table');

const createSQL = `
CREATE TABLE patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT,
  gender VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(255),
  address TEXT,
  emergencyContact VARCHAR(20),
  medicalHistory TEXT,
  admissionDate DATE,
  status VARCHAR(20) DEFAULT 'Active',
  attenderName VARCHAR(255),
  attenderPhone VARCHAR(20),
  attenderRelationship VARCHAR(100),
  photo TEXT,
  fees DECIMAL(10,2) DEFAULT 0,
  bloodTest DECIMAL(10,2) DEFAULT 0,
  pickupCharge DECIMAL(10,2) DEFAULT 0,
  totalAmount DECIMAL(10,2) DEFAULT 0,
  payAmount DECIMAL(10,2) DEFAULT 0,
  balance DECIMAL(10,2) DEFAULT 0,
  paymentType VARCHAR(50),
  fatherName VARCHAR(255),
  motherName VARCHAR(255),
  dateOfBirth DATE,
  marriageStatus VARCHAR(20),
  employeeStatus VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  is_deleted BOOLEAN DEFAULT FALSE
)`;

await db.execute(createSQL);
console.log('✅ Patients table created successfully!');

await db.end();
process.exit(0);
