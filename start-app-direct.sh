#!/bin/bash

# Direct Application Startup
# This script starts the application components directly

set -e

echo "🚀 Starting Inventory Management System Directly..."

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

# Create logs directory
mkdir -p logs

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
            print_status "Check logs/backend.log for details"
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
        print_warning "Backend API health check failed - may need database connection"
    fi
    
    # Test frontend
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        print_success "Frontend is responding"
    else
        print_warning "Frontend health check failed"
    fi
}

# Main execution
main() {
    echo "🏗️  Inventory Management System Direct Startup"
    echo "==============================================="
    
    # Start backend
    start_backend
    
    # Start frontend
    start_frontend
    
    # Test endpoints
    test_endpoints
    
    echo ""
    echo "🎉 Application startup completed!"
    echo ""
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:5000"
    echo ""
    echo "📋 Service Status:"
    echo "├── Backend API: $(pgrep -f "node.*index.js" > /dev/null && echo "Running" || echo "Not running")"
    echo "├── Frontend App: $(pgrep -f "react-scripts start" > /dev/null && echo "Running" || echo "Not running")"
    echo "└── Database: $(pgrep -x "mysqld\|mariadbd\|postgres" > /dev/null && echo "Running" || echo "Not running - may need manual start")"
    echo ""
    echo "📝 Logs:"
    echo "├── Backend: logs/backend.log"
    echo "└── Frontend: logs/frontend.log"
    echo ""
    if ! pgrep -x "mysqld\|mariadbd\|postgres" > /dev/null; then
        print_warning "Database service is not running. To start it:"
        print_warning "sudo systemctl start mariadb"
        print_warning "or"
        print_warning "sudo systemctl start postgresql"
    fi
    echo ""
    echo "🛑 To stop the application, run: npm stop"
}

# Run main function
main










