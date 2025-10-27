#!/bin/bash

# Start Application with PostgreSQL
# This script starts PostgreSQL and then the application

set -e

echo "🚀 Starting Inventory Management System with PostgreSQL..."

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

# Check if PostgreSQL is running
check_postgresql() {
    print_status "Checking PostgreSQL status..."
    
    if pgrep -x "postgres" > /dev/null; then
        print_success "PostgreSQL is running"
        return 0
    else
        print_warning "PostgreSQL is not running"
        return 1
    fi
}

# Start PostgreSQL
start_postgresql() {
    print_status "Starting PostgreSQL..."
    
    if sudo systemctl start postgresql 2>/dev/null; then
        print_success "PostgreSQL started successfully"
        sleep 3
        return 0
    else
        print_error "Failed to start PostgreSQL"
        print_warning "Please start PostgreSQL manually:"
        print_warning "sudo systemctl start postgresql"
        print_warning "sudo systemctl enable postgresql"
        return 1
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Create database and user
    ./create-postgresql-db.sh
    
    print_success "Database setup completed"
}

# Start backend
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
            print_status "Check logs/backend.log for details"
        fi
    fi
    
    cd ..
}

# Start frontend
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
            print_status "Check logs/frontend.log for details"
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
    echo "🏗️  Inventory Management System with PostgreSQL"
    echo "=============================================="
    
    # Check PostgreSQL
    if ! check_postgresql; then
        if start_postgresql; then
            print_success "PostgreSQL started"
        else
            print_error "Could not start PostgreSQL"
            exit 1
        fi
    fi
    
    # Setup database
    setup_database
    
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
    echo "├── Backend API: $(pgrep -f "node.*index.js" > /dev/null && echo "Running" || echo "Not running")"
    echo "├── Frontend App: $(pgrep -f "react-scripts start" > /dev/null && echo "Running" || echo "Not running")"
    echo "└── PostgreSQL: $(pgrep -x "postgres" > /dev/null && echo "Running" || echo "Not running")"
    echo ""
    echo "📝 Logs:"
    echo "├── Backend: logs/backend.log"
    echo "└── Frontend: logs/frontend.log"
    echo ""
    echo "🛑 To stop the application, run: npm stop"
}

# Run main function
main










