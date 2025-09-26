-- Ministry of Health Uganda Inventory Management System
-- Database Initialization Script

USE inventory_db;

-- Temporarily disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- Create users table first (referenced by other tables)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `fullName` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'user',
  `isActive` BOOLEAN DEFAULT TRUE,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create activities table
CREATE TABLE IF NOT EXISTS `activities` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `activityName` VARCHAR(255),
  `requested_by` VARCHAR(255),
  `dept` VARCHAR(255),
  `funder` VARCHAR(255),
  `status` VARCHAR(255) NOT NULL DEFAULT 'pending_accountability',
  `startDate` DATETIME,
  `endDate` DATETIME,
  `invoiceDate` DATETIME,
  `days` INTEGER,
  `amt` FLOAT,
  `reportPath` VARCHAR(255),
  `closedDate` DATETIME,
  `vocherno` VARCHAR(255),
  `created_by` INTEGER,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create other tables without foreign key constraints for now
CREATE TABLE IF NOT EXISTS `vtypes` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `vmakes` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `vgarages` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `vdrivers` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `names` VARCHAR(255) NOT NULL,
  `phoneNo` VARCHAR(255) NOT NULL,
  `employment` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `vsparecategories` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insert default admin user
INSERT IGNORE INTO `users` (`username`, `email`, `password`, `fullName`, `role`) VALUES
('admin', 'admin@moh.go.ug', '$2b$10$rQJ8N5vK8N5vK8N5vK8N5u', 'System Administrator', 'admin');

-- Show created tables
SHOW TABLES;

SELECT 'Database initialization completed successfully!' as message;
