-- Ministry of Health Uganda Inventory Management System
-- MySQL Database Setup Script

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS inventory_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Create test database if it doesn't exist
CREATE DATABASE IF NOT EXISTS inventory_db_test
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Switch to the main database
USE inventory_db;

-- Optional: Create dedicated user (if not using root)
-- CREATE USER IF NOT EXISTS 'inventory_user'@'localhost' IDENTIFIED BY 'secure_password';
-- GRANT ALL PRIVILEGES ON inventory_db.* TO 'inventory_user'@'localhost';
-- GRANT ALL PRIVILEGES ON inventory_db_test.* TO 'inventory_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Show success message
SELECT 'MySQL database setup completed successfully!' as message;

