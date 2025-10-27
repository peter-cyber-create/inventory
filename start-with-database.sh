#!/bin/bash

# Start Application with Database
# This script starts the database and then the application

set -e

echo "🚀 Starting Inventory Management System with Database..."

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

# Check if database is running
check_database() {
    print_status "Checking database status..."
    
    if pgrep -x "mysqld\|mariadbd\|postgres" > /dev/null; then
        print_success "Database service is already running"
        return 0
    else
        print_warning "Database service not running"
        return 1
    fi
}

# Start database service
start_database() {
    print_status "Attempting to start database service..."
    
    # Try to start MariaDB/MySQL
    if command -v systemctl > /dev/null; then
        print_status "Trying to start MariaDB/MySQL..."
        if sudo systemctl start mariadb 2>/dev/null; then
            print_success "MariaDB started successfully"
            return 0
        elif sudo systemctl start mysql 2>/dev/null; then
            print_success "MySQL started successfully"
            return 0
        elif sudo systemctl start postgresql 2>/dev/null; then
            print_success "PostgreSQL started successfully"
            return 0
        fi
    fi
    
    # Try alternative methods
    print_status "Trying alternative database startup methods..."
    
    # Try starting MariaDB directly
    if command -v mysqld > /dev/null; then
        print_status "Starting MariaDB directly..."
        nohup mysqld --user=mysql --datadir=/var/lib/mysql > /dev/null 2>&1 &
        sleep 3
        if pgrep -x "mysqld" > /dev/null; then
            print_success "MariaDB started directly"
            return 0
        fi
    fi
    
    print_error "Could not start database service automatically"
    print_warning "Please start your database service manually:"
    print_warning "For MariaDB: sudo systemctl start mariadb"
    print_warning "For MySQL: sudo systemctl start mysql"
    print_warning "For PostgreSQL: sudo systemctl start postgresql"
    return 1
}

# Start the application
start_application() {
    print_status "Starting the application..."
    
    # Run the main startup script
    ./scripts/setup/start-application.sh
}

# Main execution
main() {
    echo "🏗️  Inventory Management System with Database"
    echo "============================================="
    
    # Check if database is already running
    if check_database; then
        print_success "Database is ready"
    else
        # Try to start database
        if start_database; then
            print_success "Database started successfully"
        else
            print_error "Failed to start database service"
            print_warning "Please start your database service manually and try again"
            exit 1
        fi
    fi
    
    # Start the application
    start_application
}

# Run main function
main










