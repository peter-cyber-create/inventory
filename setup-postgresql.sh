#!/bin/bash

# PostgreSQL Setup Script for Inventory Management System
# This script sets up PostgreSQL database for the application

set -e

echo "🐘 Setting up PostgreSQL for Inventory Management System..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if PostgreSQL is installed
check_postgresql() {
    print_status "Checking PostgreSQL installation..."
    
    if command -v psql > /dev/null; then
        print_success "PostgreSQL is installed"
        return 0
    else
        print_error "PostgreSQL is not installed"
        print_warning "Please install PostgreSQL first:"
        print_warning "sudo apt update && sudo apt install postgresql postgresql-contrib"
        return 1
    fi
}

# Start PostgreSQL service
start_postgresql() {
    print_status "Starting PostgreSQL service..."
    
    if sudo systemctl start postgresql 2>/dev/null; then
        print_success "PostgreSQL started successfully"
    else
        print_warning "Could not start PostgreSQL automatically"
        print_warning "Please start PostgreSQL manually:"
        print_warning "sudo systemctl start postgresql"
        print_warning "sudo systemctl enable postgresql"
        return 1
    fi
}

# Create database and user
setup_database() {
    print_status "Setting up database and user..."
    
    # Create database
    sudo -u postgres createdb inventory_db 2>/dev/null || print_warning "Database may already exist"
    
    # Create user
    sudo -u postgres psql -c "CREATE USER inventory_user WITH PASSWORD 'inventory_pass';" 2>/dev/null || print_warning "User may already exist"
    
    # Grant privileges
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;" 2>/dev/null || true
    
    print_success "Database and user created"
}

# Update backend configuration
update_backend_config() {
    print_status "Updating backend configuration for PostgreSQL..."
    
    # Create .env file for backend
    cat > backend/.env << 'EOF'
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=inventory_user
DB_PASS=inventory_pass
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
PORT=5000
NODE_ENV=development
EOF

    print_success "Backend configuration updated for PostgreSQL"
}

# Install PostgreSQL dependencies
install_dependencies() {
    print_status "Installing PostgreSQL dependencies..."
    
    cd backend
    
    # Install pg (PostgreSQL driver)
    npm install pg
    
    # Install sequelize PostgreSQL dialect
    npm install sequelize
    
    print_success "PostgreSQL dependencies installed"
    
    cd ..
}

# Update database configuration
update_db_config() {
    print_status "Updating database configuration..."
    
    # Update db.js for PostgreSQL
    cat > backend/config/db.js << 'EOF'
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'inventory_db',
  process.env.DB_USER || 'inventory_user',
  process.env.DB_PASS || 'inventory_pass',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
EOF

    print_success "Database configuration updated for PostgreSQL"
}

# Test database connection
test_connection() {
    print_status "Testing database connection..."
    
    cd backend
    
    # Create a simple test script
    cat > test-db.js << 'EOF'
const sequelize = require('./config/db');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();
EOF

    if node test-db.js; then
        print_success "Database connection test passed"
        rm test-db.js
    else
        print_error "Database connection test failed"
        rm test-db.js
        return 1
    fi
    
    cd ..
}

# Main execution
main() {
    echo "🐘 PostgreSQL Setup for Inventory Management System"
    echo "=================================================="
    
    # Check PostgreSQL installation
    if ! check_postgresql; then
        exit 1
    fi
    
    # Start PostgreSQL
    if ! start_postgresql; then
        print_warning "Please start PostgreSQL manually and run this script again"
        exit 1
    fi
    
    # Setup database
    setup_database
    
    # Update backend configuration
    update_backend_config
    
    # Install dependencies
    install_dependencies
    
    # Update database configuration
    update_db_config
    
    # Test connection
    if test_connection; then
        print_success "PostgreSQL setup completed successfully!"
        echo ""
        echo "🚀 Next steps:"
        echo "1. Start the backend: cd backend && npm start"
        echo "2. Access the application: http://localhost:3000"
        echo ""
        echo "📋 Database Information:"
        echo "├── Host: localhost"
        echo "├── Port: 5432"
        echo "├── Database: inventory_db"
        echo "├── User: inventory_user"
        echo "└── Password: inventory_pass"
    else
        print_error "PostgreSQL setup failed"
        exit 1
    fi
}

# Run main function
main











