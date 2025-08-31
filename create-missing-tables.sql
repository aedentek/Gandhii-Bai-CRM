-- SQL script to create missing tables for Gandhi Bai CRM
-- Run this in your MySQL database to create the missing tables

-- 1. Test Reports Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Staff Attendance Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Patient Monthly Records Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Patient Payment History Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verify tables were created
SHOW TABLES LIKE '%test_reports%';
SHOW TABLES LIKE '%staff_attendance%';
SHOW TABLES LIKE '%patient_monthly_records%';
SHOW TABLES LIKE '%patient_payment_history%';
