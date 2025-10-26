#!/bin/bash

# Professional Application Stop Script
# This script stops the entire inventory management system

set -e

echo "🛑 Stopping Inventory Management System..."

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

# Stop backend server
stop_backend() {
    print_status "Stopping backend server..."
    
    # Check if PID file exists
    if [ -f "logs/backend.pid" ]; then
        BACKEND_PID=$(cat logs/backend.pid)
        
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            print_success "Backend server stopped (PID: $BACKEND_PID)"
        else
            print_warning "Backend server was not running"
        fi
        
        rm -f logs/backend.pid
    else
        # Try to find and kill backend process
        if pgrep -f "node.*index.js" > /dev/null; then
            pkill -f "node.*index.js"
            print_success "Backend server stopped"
        else
            print_warning "Backend server was not running"
        fi
    fi
}

# Stop frontend server
stop_frontend() {
    print_status "Stopping frontend server..."
    
    # Check if PID file exists
    if [ -f "logs/frontend.pid" ]; then
        FRONTEND_PID=$(cat logs/frontend.pid)
        
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            print_success "Frontend server stopped (PID: $FRONTEND_PID)"
        else
            print_warning "Frontend server was not running"
        fi
        
        rm -f logs/frontend.pid
    else
        # Try to find and kill frontend process
        if pgrep -f "react-scripts start" > /dev/null; then
            pkill -f "react-scripts start"
            print_success "Frontend server stopped"
        else
            print_warning "Frontend server was not running"
        fi
    fi
}

# Clean up any remaining processes
cleanup_processes() {
    print_status "Cleaning up any remaining processes..."
    
    # Kill any remaining Node.js processes related to the application
    pkill -f "node.*backend" 2>/dev/null || true
    pkill -f "node.*frontend" 2>/dev/null || true
    
    print_success "Process cleanup completed"
}

# Main execution
main() {
    echo "🛑 Inventory Management System Shutdown"
    echo "======================================"
    
    # Stop backend
    stop_backend
    
    # Stop frontend
    stop_frontend
    
    # Cleanup
    cleanup_processes
    
    echo ""
    echo "✅ Application stopped successfully!"
    echo ""
    echo "📋 Services Status:"
    echo "├── Backend API: Stopped"
    echo "├── Frontend App: Stopped"
    echo "└── Database: Still running (use systemctl to stop if needed)"
    echo ""
    echo "📝 Logs are preserved in the logs/ directory"
}

# Run main function
main









