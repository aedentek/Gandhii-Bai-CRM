import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupStaffTable() {
  let connection;
  try {
    // Create connection without database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });

    // Create database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS healthcare');
    await connection.query('USE healthcare');

    // Read and execute the SQL file
    const sqlPath = path.join(__dirname, 'setup-staff.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL file into separate statements and execute each one
    const statements = sql.split(';').filter(stmt => stmt.trim());
    for (let statement of statements) {
      if (statement.trim()) {
        await connection.query(statement);
        console.log('Executed SQL statement successfully');
      }
    }

    console.log('Staff table setup completed successfully');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupStaffTable();
