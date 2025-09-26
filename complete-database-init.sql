-- Ministry of Health Uganda Inventory Management System
-- Complete Database Initialization Script
-- All 5 Modules: ICT/Assets, Fleet/Vehicles, Stores, Finance/Activities, Users

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

-- Temporarily disable foreign key checks
SET FOREIGN_KEY_CHECKS = 0;

-- ================================
-- USERS MODULE TABLES
-- ================================

-- Users table (main authentication)
CREATE TABLE IF NOT EXISTS `users` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `firstname` VARCHAR(255),
  `lastname` VARCHAR(255),
  `fullName` VARCHAR(255),
  `phoneNo` VARCHAR(20),
  `role` ENUM('admin', 'it', 'garage', 'store', 'finance', 'user') DEFAULT 'user',
  `module` VARCHAR(50),
  `depart` VARCHAR(255),
  `facilityId` INTEGER,
  `isActive` BOOLEAN DEFAULT TRUE,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Staff table
CREATE TABLE IF NOT EXISTS `staff` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `firstName` VARCHAR(255) NOT NULL,
  `lastName` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `phoneNumber` VARCHAR(20),
  `department` VARCHAR(255),
  `position` VARCHAR(255),
  `isActive` BOOLEAN DEFAULT TRUE,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- CATEGORIES/MASTER DATA TABLES
-- ================================

-- Departments
CREATE TABLE IF NOT EXISTS `departments` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Divisions
CREATE TABLE IF NOT EXISTS `divisions` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Facilities
CREATE TABLE IF NOT EXISTS `facilities` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255),
  `type` VARCHAR(100),
  `description` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Categories (for assets and items)
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `type` ENUM('asset', 'spare_part', 'consumable') DEFAULT 'asset',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Brands
CREATE TABLE IF NOT EXISTS `brands` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Models
CREATE TABLE IF NOT EXISTS `models` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `brandId` INTEGER,
  `description` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Types (ICT types)
CREATE TABLE IF NOT EXISTS `types` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- ICT/ASSETS MODULE TABLES
-- ================================

-- Assets (main assets table)
CREATE TABLE IF NOT EXISTS `assets` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `assetTag` VARCHAR(255) UNIQUE,
  `serialNumber` VARCHAR(255),
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `categoryId` INTEGER,
  `brandId` INTEGER,
  `modelId` INTEGER,
  `typeId` INTEGER,
  `status` ENUM('active', 'inactive', 'maintenance', 'disposed') DEFAULT 'active',
  `condition` ENUM('new', 'good', 'fair', 'poor') DEFAULT 'good',
  `purchaseDate` DATE,
  `purchasePrice` DECIMAL(15,2),
  `warrantyExpiry` DATE,
  `assignedTo` INTEGER,
  `location` VARCHAR(255),
  `facilityId` INTEGER,
  `departmentId` INTEGER,
  `supplier` VARCHAR(255),
  `notes` TEXT,
  `imageUrl` VARCHAR(500),
  `createdBy` INTEGER,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`brandId`) REFERENCES `brands`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`modelId`) REFERENCES `models`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`typeId`) REFERENCES `types`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`assignedTo`) REFERENCES `staff`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`facilityId`) REFERENCES `facilities`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Servers
CREATE TABLE IF NOT EXISTS `servers` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `serverName` VARCHAR(255) NOT NULL,
  `ipAddress` VARCHAR(45),
  `operatingSystem` VARCHAR(255),
  `specifications` TEXT,
  `location` VARCHAR(255),
  `status` ENUM('online', 'offline', 'maintenance') DEFAULT 'online',
  `purpose` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Asset Issues/Tickets
CREATE TABLE IF NOT EXISTS `issues` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `assetId` INTEGER,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `priority` ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
  `status` ENUM('open', 'in_progress', 'resolved', 'closed') DEFAULT 'open',
  `reportedBy` INTEGER,
  `assignedTo` INTEGER,
  `resolvedAt` DATETIME,
  `resolution` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`reportedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`assignedTo`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Asset Maintenance
CREATE TABLE IF NOT EXISTS `maintenance` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `assetId` INTEGER,
  `maintenanceType` ENUM('preventive', 'corrective', 'emergency') DEFAULT 'preventive',
  `description` TEXT,
  `scheduledDate` DATE,
  `completedDate` DATE,
  `cost` DECIMAL(15,2),
  `vendor` VARCHAR(255),
  `status` ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
  `notes` TEXT,
  `performedBy` INTEGER,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`performedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Asset Disposal
CREATE TABLE IF NOT EXISTS `disposals` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `assetId` INTEGER,
  `reason` TEXT,
  `disposalMethod` VARCHAR(255),
  `disposalDate` DATE,
  `approvedBy` INTEGER,
  `value` DECIMAL(15,2),
  `notes` TEXT,
  `status` ENUM('pending', 'approved', 'completed') DEFAULT 'pending',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`approvedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Asset Transfers
CREATE TABLE IF NOT EXISTS `transfers` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `assetId` INTEGER,
  `fromLocation` VARCHAR(255),
  `toLocation` VARCHAR(255),
  `fromFacilityId` INTEGER,
  `toFacilityId` INTEGER,
  `fromStaff` INTEGER,
  `toStaff` INTEGER,
  `transferDate` DATE,
  `reason` TEXT,
  `status` ENUM('pending', 'approved', 'completed', 'rejected') DEFAULT 'pending',
  `approvedBy` INTEGER,
  `notes` TEXT,
  `createdBy` INTEGER,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`fromFacilityId`) REFERENCES `facilities`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`toFacilityId`) REFERENCES `facilities`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`fromStaff`) REFERENCES `staff`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`toStaff`) REFERENCES `staff`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`approvedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- VEHICLES/FLEET MODULE TABLES
-- ================================

-- Vehicle Types
CREATE TABLE IF NOT EXISTS `vtypes` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vehicle Makes
CREATE TABLE IF NOT EXISTS `vmakes` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `country` VARCHAR(100),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vehicles
CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `plateNumber` VARCHAR(50) UNIQUE NOT NULL,
  `chassisNumber` VARCHAR(255),
  `engineNumber` VARCHAR(255),
  `make` VARCHAR(255),
  `model` VARCHAR(255),
  `year` INTEGER,
  `color` VARCHAR(100),
  `fuelType` ENUM('petrol', 'diesel', 'hybrid', 'electric') DEFAULT 'petrol',
  `capacity` VARCHAR(100),
  `typeId` INTEGER,
  `makeId` INTEGER,
  `status` ENUM('active', 'maintenance', 'disposed', 'accident') DEFAULT 'active',
  `purchaseDate` DATE,
  `purchasePrice` DECIMAL(15,2),
  `currentMileage` INTEGER DEFAULT 0,
  `lastServiceDate` DATE,
  `nextServiceDate` DATE,
  `insuranceExpiry` DATE,
  `permitExpiry` DATE,
  `assignedDriver` INTEGER,
  `assignedDepartment` INTEGER,
  `notes` TEXT,
  `imageUrl` VARCHAR(500),
  `createdBy` INTEGER,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`typeId`) REFERENCES `vtypes`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`makeId`) REFERENCES `vmakes`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`assignedDepartment`) REFERENCES `departments`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Drivers
CREATE TABLE IF NOT EXISTS `drivers` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `firstName` VARCHAR(255) NOT NULL,
  `lastName` VARCHAR(255) NOT NULL,
  `licenseNumber` VARCHAR(255) UNIQUE,
  `licenseExpiry` DATE,
  `phoneNumber` VARCHAR(20),
  `email` VARCHAR(255),
  `address` TEXT,
  `employeeId` VARCHAR(100),
  `departmentId` INTEGER,
  `status` ENUM('active', 'suspended', 'terminated') DEFAULT 'active',
  `dateHired` DATE,
  `emergencyContact` VARCHAR(255),
  `emergencyPhone` VARCHAR(20),
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`departmentId`) REFERENCES `departments`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add driver foreign key to vehicles
ALTER TABLE `vehicles` ADD FOREIGN KEY (`assignedDriver`) REFERENCES `drivers`(`id`) ON DELETE SET NULL;

-- Garages
CREATE TABLE IF NOT EXISTS `garages` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `location` VARCHAR(255),
  `contactPerson` VARCHAR(255),
  `phoneNumber` VARCHAR(20),
  `email` VARCHAR(255),
  `services` TEXT,
  `isActive` BOOLEAN DEFAULT TRUE,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Spare Parts Categories
CREATE TABLE IF NOT EXISTS `spare_categories` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Spare Parts
CREATE TABLE IF NOT EXISTS `spare_parts` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `partNumber` VARCHAR(255),
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `categoryId` INTEGER,
  `brand` VARCHAR(255),
  `unitPrice` DECIMAL(15,2),
  `quantityInStock` INTEGER DEFAULT 0,
  `minimumStock` INTEGER DEFAULT 0,
  `supplier` VARCHAR(255),
  `location` VARCHAR(255),
  `notes` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`categoryId`) REFERENCES `spare_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Cards
CREATE TABLE IF NOT EXISTS `job_cards` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `jobCardNumber` VARCHAR(255) UNIQUE,
  `vehicleId` INTEGER,
  `driverId` INTEGER,
  `garageId` INTEGER,
  `workType` ENUM('maintenance', 'repair', 'inspection', 'service') DEFAULT 'maintenance',
  `description` TEXT,
  `dateReceived` DATETIME,
  `dateCompleted` DATETIME,
  `mileageIn` INTEGER,
  `mileageOut` INTEGER,
  `laborCost` DECIMAL(15,2) DEFAULT 0,
  `partsCost` DECIMAL(15,2) DEFAULT 0,
  `totalCost` DECIMAL(15,2) DEFAULT 0,
  `status` ENUM('open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
  `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  `workDone` TEXT,
  `recommendations` TEXT,
  `approvedBy` INTEGER,
  `createdBy` INTEGER,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`driverId`) REFERENCES `drivers`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`garageId`) REFERENCES `garages`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`approvedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Card Spare Parts (parts used in job cards)
CREATE TABLE IF NOT EXISTS `job_card_spare_parts` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `jobCardId` INTEGER,
  `sparePartId` INTEGER,
  `quantityUsed` INTEGER NOT NULL,
  `unitPrice` DECIMAL(15,2),
  `totalPrice` DECIMAL(15,2),
  `notes` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`jobCardId`) REFERENCES `job_cards`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sparePartId`) REFERENCES `spare_parts`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vehicle Service Requests
CREATE TABLE IF NOT EXISTS `service_requests` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `vehicleId` INTEGER,
  `requestedBy` INTEGER,
  `serviceType` VARCHAR(255),
  `description` TEXT,
  `urgency` ENUM('low', 'medium', 'high', 'emergency') DEFAULT 'medium',
  `requestDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `approvedBy` INTEGER,
  `approvalDate` DATETIME,
  `status` ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
  `notes` TEXT,
  `jobCardId` INTEGER,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`requestedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`approvedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`jobCardId`) REFERENCES `job_cards`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Garage Receiving (parts received by garage)
CREATE TABLE IF NOT EXISTS `garage_receive` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `requisitionNumber` VARCHAR(255),
  `supplierName` VARCHAR(255),
  `receivedDate` DATE,
  `receivedBy` INTEGER,
  `totalValue` DECIMAL(15,2),
  `status` ENUM('pending', 'received', 'inspected', 'approved') DEFAULT 'pending',
  `notes` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`receivedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vehicle Disposal
CREATE TABLE IF NOT EXISTS `vehicle_disposals` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `vehicleId` INTEGER,
  `reason` TEXT,
  `disposalMethod` VARCHAR(255),
  `disposalDate` DATE,
  `approvedBy` INTEGER,
  `value` DECIMAL(15,2),
  `notes` TEXT,
  `status` ENUM('pending', 'approved', 'completed') DEFAULT 'pending',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`approvedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- STORES MODULE TABLES
-- ================================

-- Products/Inventory Items
CREATE TABLE IF NOT EXISTS `products` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `productCode` VARCHAR(255) UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `categoryId` INTEGER,
  `unitOfMeasure` VARCHAR(50),
  `unitPrice` DECIMAL(15,2),
  `quantityInStock` INTEGER DEFAULT 0,
  `minimumStock` INTEGER DEFAULT 0,
  `maximumStock` INTEGER,
  `reorderLevel` INTEGER,
  `supplier` VARCHAR(255),
  `location` VARCHAR(255),
  `isActive` BOOLEAN DEFAULT TRUE,
  `notes` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Goods Received
CREATE TABLE IF NOT EXISTS `goods_received` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `grNumber` VARCHAR(255) UNIQUE,
  `supplierName` VARCHAR(255),
  `deliveryDate` DATE,
  `receivedBy` INTEGER,
  `purchaseOrderNumber` VARCHAR(255),
  `invoiceNumber` VARCHAR(255),
  `totalValue` DECIMAL(15,2),
  `status` ENUM('pending', 'received', 'inspected', 'approved') DEFAULT 'pending',
  `notes` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`receivedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Goods Received Items
CREATE TABLE IF NOT EXISTS `goods_received_items` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `grId` INTEGER,
  `productId` INTEGER,
  `quantityOrdered` INTEGER,
  `quantityReceived` INTEGER,
  `unitPrice` DECIMAL(15,2),
  `totalPrice` DECIMAL(15,2),
  `condition` ENUM('good', 'damaged', 'expired') DEFAULT 'good',
  `expiryDate` DATE,
  `batchNumber` VARCHAR(255),
  `notes` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`grId`) REFERENCES `goods_received`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Requisitions (both ICT and Vehicle Parts)
CREATE TABLE IF NOT EXISTS `requisitions` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `requisitionNumber` VARCHAR(255) UNIQUE,
  `type` ENUM('ict', 'vehicle_parts', 'general') DEFAULT 'general',
  `requestedBy` INTEGER,
  `department` VARCHAR(255),
  `purpose` TEXT,
  `dateRequired` DATE,
  `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  `status` ENUM('pending', 'approved', 'partially_dispatched', 'dispatched', 'rejected') DEFAULT 'pending',
  `approvedBy` INTEGER,
  `approvalDate` DATETIME,
  `notes` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`requestedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`approvedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Requisition Items
CREATE TABLE IF NOT EXISTS `requisition_items` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `requisitionId` INTEGER,
  `productId` INTEGER,
  `quantityRequested` INTEGER,
  `quantityApproved` INTEGER,
  `quantityDispatched` INTEGER DEFAULT 0,
  `unitPrice` DECIMAL(15,2),
  `totalPrice` DECIMAL(15,2),
  `purpose` TEXT,
  `notes` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`requisitionId`) REFERENCES `requisitions`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dispatched Items
CREATE TABLE IF NOT EXISTS `dispatched_items` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `dispatchNumber` VARCHAR(255) UNIQUE,
  `requisitionId` INTEGER,
  `productId` INTEGER,
  `quantityDispatched` INTEGER,
  `dispatchedBy` INTEGER,
  `receivedBy` VARCHAR(255),
  `dispatchDate` DATETIME,
  `purpose` TEXT,
  `status` ENUM('dispatched', 'received', 'returned') DEFAULT 'dispatched',
  `notes` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`requisitionId`) REFERENCES `requisitions`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`dispatchedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Asset Register (for stores)
CREATE TABLE IF NOT EXISTS `asset_register` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `assetId` INTEGER,
  `registrationDate` DATE,
  `registeredBy` INTEGER,
  `condition` ENUM('new', 'good', 'fair', 'poor') DEFAULT 'new',
  `value` DECIMAL(15,2),
  `depreciation` DECIMAL(15,2),
  `currentValue` DECIMAL(15,2),
  `notes` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`registeredBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inventory Ledger (for tracking stock movements)
CREATE TABLE IF NOT EXISTS `inventory_ledger` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `productId` INTEGER,
  `transactionType` ENUM('receipt', 'issue', 'adjustment', 'transfer', 'disposal') NOT NULL,
  `quantity` INTEGER NOT NULL,
  `unitPrice` DECIMAL(15,2),
  `totalValue` DECIMAL(15,2),
  `runningBalance` INTEGER,
  `reference` VARCHAR(255),
  `description` TEXT,
  `performedBy` INTEGER,
  `transactionDate` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`performedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- FINANCE/ACTIVITIES MODULE TABLES
-- ================================

-- Activities (financial activities)
CREATE TABLE IF NOT EXISTS `activities` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `activityCode` VARCHAR(255) UNIQUE,
  `activityName` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `requested_by` VARCHAR(255),
  `requestedBy` INTEGER,
  `dept` VARCHAR(255),
  `department` VARCHAR(255),
  `funder` VARCHAR(255),
  `fundingSource` VARCHAR(255),
  `budget` DECIMAL(15,2),
  `actualCost` DECIMAL(15,2),
  `balance` DECIMAL(15,2),
  `status` ENUM('pending', 'approved', 'ongoing', 'completed', 'cancelled', 'pending_accountability') DEFAULT 'pending',
  `priority` ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  `startDate` DATE,
  `endDate` DATE,
  `actualStartDate` DATE,
  `actualEndDate` DATE,
  `invoiceDate` DATE,
  `days` INTEGER,
  `amt` DECIMAL(15,2),
  `location` VARCHAR(255),
  `participants` INTEGER DEFAULT 0,
  `reportPath` VARCHAR(500),
  `closedDate` DATE,
  `vocherno` VARCHAR(255),
  `approvedBy` INTEGER,
  `created_by` INTEGER,
  `createdBy` INTEGER,
  `notes` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`requestedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`approvedBy`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`createdBy`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Activity Participants
CREATE TABLE IF NOT EXISTS `activity_participants` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `activityId` INTEGER,
  `participantName` VARCHAR(255) NOT NULL,
  `participantId` VARCHAR(255),
  `position` VARCHAR(255),
  `department` VARCHAR(255),
  `phoneNumber` VARCHAR(20),
  `email` VARCHAR(255),
  `allowanceAmount` DECIMAL(15,2),
  `transportAmount` DECIMAL(15,2),
  `accommodationAmount` DECIMAL(15,2),
  `totalAmount` DECIMAL(15,2),
  `status` ENUM('registered', 'confirmed', 'attended', 'absent') DEFAULT 'registered',
  `attendanceDate` DATE,
  `paymentStatus` ENUM('pending', 'processed', 'paid') DEFAULT 'pending',
  `accountabilityStatus` ENUM('pending', 'submitted', 'approved') DEFAULT 'pending',
  `accountabilityDate` DATE,
  `notes` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- AUDIT/LOGGING TABLES
-- ================================

-- Audit Log (for tracking changes across all modules)
CREATE TABLE IF NOT EXISTS `audit_log` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `userId` INTEGER,
  `action` VARCHAR(255) NOT NULL,
  `tableName` VARCHAR(255),
  `recordId` INTEGER,
  `oldValues` JSON,
  `newValues` JSON,
  `ipAddress` VARCHAR(45),
  `userAgent` TEXT,
  `description` TEXT,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- System Logs
CREATE TABLE IF NOT EXISTS `system_logs` (
  `id` INTEGER AUTO_INCREMENT PRIMARY KEY,
  `level` ENUM('info', 'warning', 'error', 'critical') DEFAULT 'info',
  `message` TEXT NOT NULL,
  `module` VARCHAR(100),
  `userId` INTEGER,
  `ipAddress` VARCHAR(45),
  `context` JSON,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- SAMPLE DATA INSERTION
-- ================================

-- Enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO `users` (`username`, `email`, `password`, `firstname`, `lastname`, `fullName`, `role`, `module`, `isActive`) VALUES
('admin', 'admin@moh.gov.ug', '$2b$10$rLZJvV.z5I1V5xZH5A2MmeOW6EB1LnwGx7x6s7x6s7x6s7x6s7x6s', 'System', 'Administrator', 'System Administrator', 'admin', 'all', TRUE),
('it_manager', 'it@moh.gov.ug', '$2b$10$rLZJvV.z5I1V5xZH5A2MmeOW6EB1LnwGx7x6s7x6s7x6s7x6s7x6s', 'IT', 'Manager', 'IT Manager', 'it', 'ict', TRUE),
('fleet_manager', 'fleet@moh.gov.ug', '$2b$10$rLZJvV.z5I1V5xZH5A2MmeOW6EB1LnwGx7x6s7x6s7x6s7x6s7x6s', 'Fleet', 'Manager', 'Fleet Manager', 'garage', 'fleet', TRUE),
('store_manager', 'stores@moh.gov.ug', '$2b$10$rLZJvV.z5I1V5xZH5A2MmeOW6EB1LnwGx7x6s7x6s7x6s7x6s7x6s', 'Store', 'Manager', 'Store Manager', 'store', 'stores', TRUE),
('finance_manager', 'finance@moh.gov.ug', '$2b$10$rLZJvV.z5I1V5xZH5A2MmeOW6EB1LnwGx7x6s7x6s7x6s7x6s7x6s', 'Finance', 'Manager', 'Finance Manager', 'finance', 'finance', TRUE);

-- Insert sample departments
INSERT IGNORE INTO `departments` (`name`, `description`) VALUES
('Information Technology', 'IT Department responsible for technology infrastructure'),
('Fleet Management', 'Vehicle and transportation management'),
('Stores and Supplies', 'Inventory and procurement management'),
('Finance and Accounting', 'Financial management and accounting'),
('Administration', 'General administration and support'),
('Clinical Services', 'Medical and health services'),
('Human Resources', 'Staff management and development');

-- Insert sample facilities
INSERT IGNORE INTO `facilities` (`name`, `location`, `type`, `description`) VALUES
('Ministry of Health Headquarters', 'Kampala', 'Headquarters', 'Main administrative building'),
('Central Medical Stores', 'Kampala', 'Warehouse', 'Central storage and distribution facility'),
('Regional Health Office - Central', 'Kampala', 'Regional Office', 'Central region health coordination'),
('Regional Health Office - Eastern', 'Mbale', 'Regional Office', 'Eastern region health coordination'),
('Regional Health Office - Western', 'Mbarara', 'Regional Office', 'Western region health coordination'),
('Regional Health Office - Northern', 'Gulu', 'Regional Office', 'Northern region health coordination');

-- Insert sample categories
INSERT IGNORE INTO `categories` (`name`, `description`, `type`) VALUES
('Desktop Computers', 'Desktop computer systems', 'asset'),
('Laptops', 'Portable computer systems', 'asset'),
('Servers', 'Server hardware and systems', 'asset'),
('Network Equipment', 'Routers, switches, and network devices', 'asset'),
('Printers', 'Printing equipment and devices', 'asset'),
('Vehicle Spare Parts', 'Spare parts for vehicles', 'spare_part'),
('Engine Parts', 'Engine components and parts', 'spare_part'),
('Electrical Parts', 'Vehicle electrical components', 'spare_part'),
('Office Supplies', 'General office consumables', 'consumable'),
('Medical Supplies', 'Medical equipment and supplies', 'asset');

-- Insert sample brands
INSERT IGNORE INTO `brands` (`name`, `description`) VALUES
('Dell', 'Dell Computer Corporation'),
('HP', 'Hewlett-Packard'),
('Lenovo', 'Lenovo Group Limited'),
('Cisco', 'Cisco Systems'),
('Canon', 'Canon Inc.'),
('Toyota', 'Toyota Motor Corporation'),
('Mercedes', 'Mercedes-Benz'),
('Isuzu', 'Isuzu Motors'),
('Bosch', 'Robert Bosch GmbH'),
('Philips', 'Philips Electronics');

-- Insert sample vehicle types
INSERT IGNORE INTO `vtypes` (`name`, `description`) VALUES
('Sedan', 'Passenger sedan vehicles'),
('SUV', 'Sport Utility Vehicles'),
('Pickup', 'Pickup trucks'),
('Bus', 'Passenger buses'),
('Truck', 'Cargo trucks'),
('Ambulance', 'Emergency medical vehicles'),
('Motorcycle', 'Two-wheeled vehicles');

-- Insert sample vehicle makes
INSERT IGNORE INTO `vmakes` (`name`, `country`) VALUES
('Toyota', 'Japan'),
('Mercedes-Benz', 'Germany'),
('Isuzu', 'Japan'),
('Mitsubishi', 'Japan'),
('Ford', 'USA'),
('Volkswagen', 'Germany'),
('Hyundai', 'South Korea');

COMMIT;

-- Show completion message
SELECT 'Database initialization completed successfully!' as Status;
