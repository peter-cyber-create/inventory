#!/bin/bash

# Ministry of Health Uganda Inventory Management System
# Frontend Startup Script

echo "🇺🇬 Ministry of Health Uganda - Inventory Management System"
echo "============================================================="
echo "Starting Frontend Application..."
echo ""

# Check if we're in the right directory
if [ ! -f "inventory-frontend-master/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Navigate to frontend directory
cd inventory-frontend-master

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if backend is running
echo "🔍 Checking backend connection..."
if curl -s http://localhost:5001 > /dev/null 2>&1; then
    echo "✅ Backend server is running"
else
    echo "⚠️  Backend server not detected at http://localhost:5001"
    echo "💡 Make sure to start the backend server first:"
    echo "   ./start-backend.sh"
    echo ""
fi

echo ""
echo "🚀 Starting React development server..."
echo "📍 Application will be available at: http://localhost:3000"
echo ""
echo "🎨 Features:"
echo "  • Professional MoH Uganda branding"
echo "  • Responsive design"
echo "  • Asset management"
echo "  • Vehicle tracking"
echo "  • Inventory management"
echo "  • Reports and analytics"
echo ""
echo "Press Ctrl+C to stop the server"
echo "============================================================="

# Start the React development server
npm start
