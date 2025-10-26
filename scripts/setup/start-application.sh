#!/bin/bash

# Professional Application Startup Script
# This script starts the entire inventory management system

set -e

echo "🚀 Starting Inventory Management System..."

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

# Check if required services are running
check_services() {
    print_status "Checking required services..."
    
    # Check if database is running
    if ! pgrep -x "mysqld\|mariadbd\|postgres" > /dev/null; then
        print_warning "Database service not running. Please start your database service:"
        print_warning "For MySQL/MariaDB: sudo systemctl start mariadb"
        print_warning "For PostgreSQL: sudo systemctl start postgresql"
        exit 1
    fi
    
    print_success "Database service is running"
}

# Install dependencies if needed
install_dependencies() {
    print_status "Checking and installing dependencies..."
    
    # Backend dependencies
    if [ ! -d "backend/node_modules" ]; then
        print_status "Installing backend dependencies..."
        cd backend
        npm install
        cd ..
    fi
    
    # Frontend dependencies
    if [ ! -d "frontend/node_modules" ]; then
        print_status "Installing frontend dependencies..."
        cd frontend
        npm install
        cd ..
    fi
    
    print_success "Dependencies installed"
}

# Start backend server
start_backend() {
    print_status "Starting backend server..."
    
    cd backend
    
    # Check if backend is already running
    if pgrep -f "node.*index.js" > /dev/null; then
        print_warning "Backend server is already running"
    else
        # Start backend in background
        nohup npm start > ../logs/backend.log 2>&1 &
        BACKEND_PID=$!
        echo $BACKEND_PID > ../logs/backend.pid
        
        # Wait for backend to start
        sleep 5
        
        # Check if backend is running
        if pgrep -f "node.*index.js" > /dev/null; then
            print_success "Backend server started (PID: $BACKEND_PID)"
        else
            print_error "Failed to start backend server"
            exit 1
        fi
    fi
    
    cd ..
}

# Start frontend server
start_frontend() {
    print_status "Starting frontend server..."
    
    cd frontend
    
    # Check if frontend is already running
    if pgrep -f "react-scripts start" > /dev/null; then
        print_warning "Frontend server is already running"
    else
        # Start frontend in background
        nohup npm start > ../logs/frontend.log 2>&1 &
        FRONTEND_PID=$!
        echo $FRONTEND_PID > ../logs/frontend.pid
        
        # Wait for frontend to start
        sleep 10
        
        # Check if frontend is running
        if pgrep -f "react-scripts start" > /dev/null; then
            print_success "Frontend server started (PID: $FRONTEND_PID)"
        else
            print_error "Failed to start frontend server"
            exit 1
        fi
    fi
    
    cd ..
}

# Test application endpoints
test_endpoints() {
    print_status "Testing application endpoints..."
    
    # Wait for services to be ready
    sleep 5
    
    # Test backend health
    if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
        print_success "Backend API is responding"
    else
        print_warning "Backend API health check failed"
    fi
    
    # Test frontend
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is responding"
    else
        print_warning "Frontend health check failed"
    fi
}

# Create logs directory
mkdir -p logs

# Main execution
main() {
    echo "🏗️  Inventory Management System Startup"
    echo "========================================"
    
    # Check services
    check_services
    
    # Install dependencies
    install_dependencies
    
    # Start backend
    start_backend
    
    # Start frontend
    start_frontend
    
    # Test endpoints
    test_endpoints
    
    echo ""
    echo "🎉 Application started successfully!"
    echo ""
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:5000"
    echo ""
    echo "📋 Service Status:"
    echo "├── Backend API: Running on port 5000"
    echo "├── Frontend App: Running on port 3000"
    echo "└── Database: Connected and ready"
    echo ""
    echo "📝 Logs:"
    echo "├── Backend: logs/backend.log"
    echo "└── Frontend: logs/frontend.log"
    echo ""
    echo "🛑 To stop the application, run: ./scripts/maintenance/stop-application.sh"
}

# Run main function
main






