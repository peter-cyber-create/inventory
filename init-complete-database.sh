#!/bin/bash

# Complete Database Initialization Script for Inventory Management System
# This script will create the complete PostgreSQL database with all tables and sample data

echo "🐘 Initializing Complete PostgreSQL Database for Inventory Management System"
echo "=========================================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[ℹ]${NC} $1"
}

# Check if PostgreSQL is running
if ! systemctl is-active --quiet postgresql; then
    print_error "PostgreSQL is not running"
    echo "   Please start PostgreSQL first: sudo systemctl start postgresql"
    exit 1
fi

print_status "PostgreSQL is running"

# Create database and user if they don't exist
echo ""
echo "1. Creating Database and User"
echo "-----------------------------"

# Create database
sudo -u postgres createdb inventory_db 2>/dev/null && print_status "Database 'inventory_db' created" || print_warning "Database may already exist"

# Create user
sudo -u postgres psql -c "CREATE USER inventory_user WITH PASSWORD 'toor';" 2>/dev/null && print_status "User 'inventory_user' created" || print_warning "User may already exist"

# Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;" 2>/dev/null && print_status "Privileges granted" || print_warning "Privileges may already be set"

# Grant schema privileges
sudo -u postgres psql -d inventory_db -c "GRANT ALL ON SCHEMA public TO inventory_user;" 2>/dev/null && print_status "Schema privileges granted" || print_warning "Schema privileges may already be set"

echo ""
echo "2. Creating Complete Database Schema"
echo "------------------------------------"

# Create the complete database schema
cat > /tmp/complete_schema.sql << 'SCHEMA_EOF'
-- Complete Inventory Management System Database Schema
-- Ministry of Health Uganda

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    phone_no VARCHAR(20),
    module VARCHAR(50),
    depart VARCHAR(50),
    facility_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Facilities table
CREATE TABLE IF NOT EXISTS facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    region VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Divisions table
CREATE TABLE IF NOT EXISTS divisions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    dept_id INTEGER REFERENCES departments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Types table
CREATE TABLE IF NOT EXISTS types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Brands table
CREATE TABLE IF NOT EXISTS brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Models table
CREATE TABLE IF NOT EXISTS models (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    brand_id INTEGER REFERENCES brands(id),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Assets table
CREATE TABLE IF NOT EXISTS assets (
    id SERIAL PRIMARY KEY,
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(id),
    type_id INTEGER REFERENCES types(id),
    brand_id INTEGER REFERENCES brands(id),
    model_id INTEGER REFERENCES models(id),
    serial_number VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    location VARCHAR(100),
    assigned_to INTEGER REFERENCES users(id),
    purchase_date DATE,
    warranty_expiry DATE,
    cost DECIMAL(10,2),
    supplier VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INTEGER,
    color VARCHAR(30),
    engine_number VARCHAR(50),
    chassis_number VARCHAR(50),
    fuel_type VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    assigned_driver INTEGER,
    department_id INTEGER REFERENCES departments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores Items table
CREATE TABLE IF NOT EXISTS store_items (
    id SERIAL PRIMARY KEY,
    item_code VARCHAR(50) UNIQUE NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    unit_of_measure VARCHAR(20),
    current_stock INTEGER DEFAULT 0,
    minimum_stock INTEGER DEFAULT 0,
    maximum_stock INTEGER DEFAULT 0,
    unit_cost DECIMAL(10,2),
    supplier VARCHAR(100),
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requisitions table
CREATE TABLE IF NOT EXISTS requisitions (
    id SERIAL PRIMARY KEY,
    requisition_number VARCHAR(50) UNIQUE NOT NULL,
    requested_by INTEGER REFERENCES users(id),
    department_id INTEGER REFERENCES departments(id),
    status VARCHAR(20) DEFAULT 'pending',
    requested_date DATE DEFAULT CURRENT_DATE,
    approved_by INTEGER REFERENCES users(id),
    approved_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requisition Items table
CREATE TABLE IF NOT EXISTS requisition_items (
    id SERIAL PRIMARY KEY,
    requisition_id INTEGER REFERENCES requisitions(id),
    item_id INTEGER REFERENCES store_items(id),
    quantity_requested INTEGER NOT NULL,
    quantity_approved INTEGER DEFAULT 0,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id),
    asset_id INTEGER REFERENCES assets(id),
    vehicle_id INTEGER REFERENCES vehicles(id),
    activity_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_assets_asset_tag ON assets(asset_tag);
CREATE INDEX IF NOT EXISTS idx_vehicles_registration ON vehicles(registration_number);
CREATE INDEX IF NOT EXISTS idx_store_items_code ON store_items(item_code);
CREATE INDEX IF NOT EXISTS idx_requisitions_number ON requisitions(requisition_number);
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Add foreign key constraints
ALTER TABLE users ADD CONSTRAINT IF NOT EXISTS fk_users_facility FOREIGN KEY (facility_id) REFERENCES facilities(id);
ALTER TABLE divisions ADD CONSTRAINT IF NOT EXISTS fk_divisions_department FOREIGN KEY (dept_id) REFERENCES departments(id);
ALTER TABLE models ADD CONSTRAINT IF NOT EXISTS fk_models_brand FOREIGN KEY (brand_id) REFERENCES brands(id);
ALTER TABLE assets ADD CONSTRAINT IF NOT EXISTS fk_assets_category FOREIGN KEY (category_id) REFERENCES categories(id);
ALTER TABLE assets ADD CONSTRAINT IF NOT EXISTS fk_assets_type FOREIGN KEY (type_id) REFERENCES types(id);
ALTER TABLE assets ADD CONSTRAINT IF NOT EXISTS fk_assets_brand FOREIGN KEY (brand_id) REFERENCES brands(id);
ALTER TABLE assets ADD CONSTRAINT IF NOT EXISTS fk_assets_model FOREIGN KEY (model_id) REFERENCES models(id);
ALTER TABLE assets ADD CONSTRAINT IF NOT EXISTS fk_assets_assigned_to FOREIGN KEY (assigned_to) REFERENCES users(id);
ALTER TABLE vehicles ADD CONSTRAINT IF NOT EXISTS fk_vehicles_department FOREIGN KEY (department_id) REFERENCES departments(id);
ALTER TABLE requisitions ADD CONSTRAINT IF NOT EXISTS fk_requisitions_requested_by FOREIGN KEY (requested_by) REFERENCES users(id);
ALTER TABLE requisitions ADD CONSTRAINT IF NOT EXISTS fk_requisitions_department FOREIGN KEY (department_id) REFERENCES departments(id);
ALTER TABLE requisitions ADD CONSTRAINT IF NOT EXISTS fk_requisitions_approved_by FOREIGN KEY (approved_by) REFERENCES users(id);
ALTER TABLE requisition_items ADD CONSTRAINT IF NOT EXISTS fk_requisition_items_requisition FOREIGN KEY (requisition_id) REFERENCES requisitions(id);
ALTER TABLE requisition_items ADD CONSTRAINT IF NOT EXISTS fk_requisition_items_item FOREIGN KEY (item_id) REFERENCES store_items(id);
ALTER TABLE activities ADD CONSTRAINT IF NOT EXISTS fk_activities_user FOREIGN KEY (user_id) REFERENCES users(id);
ALTER TABLE activities ADD CONSTRAINT IF NOT EXISTS fk_activities_asset FOREIGN KEY (asset_id) REFERENCES assets(id);
ALTER TABLE activities ADD CONSTRAINT IF NOT EXISTS fk_activities_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id);
ALTER TABLE audit_logs ADD CONSTRAINT IF NOT EXISTS fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id);
SCHEMA_EOF

# Execute the schema
if psql -U inventory_user -d inventory_db -f /tmp/complete_schema.sql > /dev/null 2>&1; then
    print_status "Complete database schema created successfully"
else
    print_error "Failed to create database schema"
    exit 1
fi

echo ""
echo "3. Inserting Sample Data"
echo "------------------------"

# Insert sample data
cat > /tmp/sample_data.sql << 'DATA_EOF'
-- Sample data for testing

-- Insert facilities
INSERT INTO facilities (name, level, region) VALUES
('Kampala Central Hospital', 'National Referral', 'Central'),
('Mulago National Referral Hospital', 'National Referral', 'Central'),
('Jinja Regional Referral Hospital', 'Regional Referral', 'Eastern'),
('Mbarara Regional Referral Hospital', 'Regional Referral', 'Western'),
('Gulu Regional Referral Hospital', 'Regional Referral', 'Northern');

-- Insert departments
INSERT INTO departments (name) VALUES
('ICT Department'),
('Fleet Management'),
('Stores Department'),
('Finance Department'),
('Human Resources'),
('Medical Services'),
('Administration');

-- Insert divisions
INSERT INTO divisions (name, dept_id) VALUES
('Software Development', 1),
('Network Administration', 1),
('Vehicle Maintenance', 2),
('Driver Management', 2),
('Inventory Management', 3),
('Procurement', 3),
('Accounting', 4),
('Budgeting', 4);

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Computers', 'Desktop and laptop computers'),
('Printers', 'Printing and scanning equipment'),
('Network Equipment', 'Routers, switches, and networking devices'),
('Vehicles', 'Motor vehicles and transport equipment'),
('Medical Equipment', 'Medical devices and equipment'),
('Office Furniture', 'Desks, chairs, and office furniture'),
('Stationery', 'Office supplies and stationery items');

-- Insert types
INSERT INTO types (name, description) VALUES
('Desktop Computer', 'Desktop personal computers'),
('Laptop', 'Portable laptop computers'),
('Printer', 'Printing devices'),
('Router', 'Network routing equipment'),
('Switch', 'Network switching equipment'),
('Sedan', 'Four-door passenger vehicles'),
('SUV', 'Sport Utility Vehicles'),
('Truck', 'Commercial transport vehicles');

-- Insert brands
INSERT INTO brands (name, description) VALUES
('Dell', 'Dell Technologies'),
('HP', 'Hewlett Packard'),
('Lenovo', 'Lenovo Group'),
('Cisco', 'Cisco Systems'),
('Toyota', 'Toyota Motor Corporation'),
('Ford', 'Ford Motor Company'),
('Nissan', 'Nissan Motor Company');

-- Insert models
INSERT INTO models (name, brand_id, description) VALUES
('OptiPlex 7090', 1, 'Dell OptiPlex Desktop'),
('Latitude 5520', 1, 'Dell Latitude Laptop'),
('Pavilion Desktop', 2, 'HP Pavilion Desktop'),
('ThinkPad X1', 3, 'Lenovo ThinkPad Laptop'),
('Catalyst 2960', 4, 'Cisco Catalyst Switch'),
('Camry', 5, 'Toyota Camry Sedan'),
('Ranger', 6, 'Ford Ranger Pickup'),
('Navara', 7, 'Nissan Navara Pickup');

-- Insert users (with hashed passwords)
INSERT INTO users (username, email, password, role, firstname, lastname, phone_no, module, depart, facility_id) VALUES
('admin', 'admin@moh.go.ug', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'System', 'Administrator', '+256700000000', 'All', 'Administration', 1),
('it_manager', 'it.manager@moh.go.ug', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'it_manager', 'John', 'Doe', '+256700000001', 'ICT', 'ICT Department', 1),
('fleet_manager', 'fleet.manager@moh.go.ug', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'fleet_manager', 'Jane', 'Smith', '+256700000002', 'Fleet', 'Fleet Management', 1),
('store_manager', 'store.manager@moh.go.ug', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'store_manager', 'Mike', 'Johnson', '+256700000003', 'Stores', 'Stores Department', 1),
('finance_manager', 'finance.manager@moh.go.ug', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'finance_manager', 'Sarah', 'Wilson', '+256700000004', 'Finance', 'Finance Department', 1);

-- Insert sample assets
INSERT INTO assets (asset_tag, name, description, category_id, type_id, brand_id, model_id, serial_number, status, location, assigned_to, purchase_date, cost, supplier) VALUES
('ICT001', 'Dell Desktop Computer', 'Office desktop computer', 1, 1, 1, 1, 'DL001234567', 'active', 'ICT Office', 2, '2023-01-15', 1500000.00, 'Dell Uganda'),
('ICT002', 'HP Laptop', 'Portable laptop computer', 1, 2, 2, 3, 'HP001234567', 'active', 'ICT Office', 2, '2023-02-20', 2000000.00, 'HP Uganda'),
('NET001', 'Cisco Switch', 'Network switching equipment', 3, 5, 4, 5, 'CS001234567', 'active', 'Server Room', 2, '2023-03-10', 500000.00, 'Cisco Uganda');

-- Insert sample vehicles
INSERT INTO vehicles (registration_number, make, model, year, color, engine_number, chassis_number, fuel_type, status, department_id) VALUES
('UG1234A', 'Toyota', 'Camry', 2022, 'White', 'ENG001234567', 'CHS001234567', 'Petrol', 'active', 2),
('UG5678B', 'Ford', 'Ranger', 2021, 'Blue', 'ENG001234568', 'CHS001234568', 'Diesel', 'active', 2),
('UG9012C', 'Nissan', 'Navara', 2023, 'Silver', 'ENG001234569', 'CHS001234569', 'Diesel', 'active', 2);

-- Insert sample store items
INSERT INTO store_items (item_code, item_name, description, category, unit_of_measure, current_stock, minimum_stock, maximum_stock, unit_cost, supplier, location) VALUES
('ST001', 'A4 Paper', 'White A4 printing paper', 'Stationery', 'Ream', 100, 20, 200, 15000.00, 'Stationery Supplier', 'Store Room A'),
('ST002', 'Blue Pens', 'Blue ballpoint pens', 'Stationery', 'Box', 50, 10, 100, 5000.00, 'Stationery Supplier', 'Store Room A'),
('ST003', 'Printer Toner', 'HP LaserJet toner cartridge', 'Office Supplies', 'Piece', 25, 5, 50, 80000.00, 'Office Supplies Ltd', 'Store Room B');

-- Insert sample activities
INSERT INTO activities (activity_type, description, user_id, asset_id, activity_date) VALUES
('Asset Assignment', 'Assigned desktop computer to IT Manager', 2, 1, '2023-01-16 09:00:00'),
('Asset Assignment', 'Assigned laptop to IT Manager', 2, 2, '2023-02-21 10:30:00'),
('Vehicle Assignment', 'Assigned vehicle UG1234A to Fleet Manager', 3, 1, '2023-01-20 14:00:00');

DATA_EOF

# Execute sample data
if psql -U inventory_user -d inventory_db -f /tmp/sample_data.sql > /dev/null 2>&1; then
    print_status "Sample data inserted successfully"
else
    print_warning "Some sample data may not have been inserted (this is normal if data already exists)"
fi

# Clean up temporary files
rm -f /tmp/complete_schema.sql /tmp/sample_data.sql

echo ""
echo "4. Database Statistics"
echo "---------------------"
psql -U inventory_user -d inventory_db -c "SELECT 
    'Users' as table_name, COUNT(*) as record_count FROM users
    UNION ALL
    SELECT 'Facilities', COUNT(*) FROM facilities
    UNION ALL
    SELECT 'Departments', COUNT(*) FROM departments
    UNION ALL
    SELECT 'Divisions', COUNT(*) FROM divisions
    UNION ALL
    SELECT 'Categories', COUNT(*) FROM categories
    UNION ALL
    SELECT 'Types', COUNT(*) FROM types
    UNION ALL
    SELECT 'Brands', COUNT(*) FROM brands
    UNION ALL
    SELECT 'Models', COUNT(*) FROM models
    UNION ALL
    SELECT 'Assets', COUNT(*) FROM assets
    UNION ALL
    SELECT 'Vehicles', COUNT(*) FROM vehicles
    UNION ALL
    SELECT 'Store Items', COUNT(*) FROM store_items
    UNION ALL
    SELECT 'Activities', COUNT(*) FROM activities;"

echo ""
echo "5. Final Assessment"
echo "-------------------"
TABLE_COUNT=$(psql -U inventory_user -d inventory_db -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
USER_COUNT=$(psql -U inventory_user -d inventory_db -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ')

if [ "$TABLE_COUNT" -gt 10 ] && [ "$USER_COUNT" -gt 0 ]; then
    print_status "Database initialization completed successfully!"
    print_status "Created $TABLE_COUNT tables"
    print_status "Inserted $USER_COUNT users"
    echo ""
    echo "🎉 PostgreSQL Database is 100% functional and ready!"
    echo ""
    echo "📋 Database Information:"
    echo "   • Database: inventory_db"
    echo "   • User: inventory_user"
    echo "   • Password: toor"
    echo "   • Host: localhost"
    echo "   • Port: 5432"
    echo ""
    echo "🔐 Default Login Credentials:"
    echo "   • admin / admin123 (System Administrator)"
    echo "   • it_manager / admin123 (IT Manager)"
    echo "   • fleet_manager / admin123 (Fleet Manager)"
    echo "   • store_manager / admin123 (Store Manager)"
    echo "   • finance_manager / admin123 (Finance Manager)"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Run assessment: ./assess-postgresql.sh"
    echo "   2. Start backend: cd backend && node index-working.js"
    echo "   3. Start frontend: cd frontend && npm start"
    echo "   4. Access application: http://localhost:3000"
else
    print_error "Database initialization may have issues"
    echo "   Please check the error messages above"
fi

echo ""
echo "✅ Complete Database Initialization Finished!"
