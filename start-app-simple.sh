#!/bin/bash

echo "🚀 Starting Inventory Management System..."
echo "=========================================="

# Check if PostgreSQL is running
if ! systemctl is-active --quiet postgresql; then
    echo "⚠️  PostgreSQL is not running. Please start it manually:"
    echo "   sudo systemctl start postgresql"
    echo "   sudo systemctl enable postgresql"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ PostgreSQL is running"

# Create database if it doesn't exist
echo "🔧 Setting up database..."
sudo -u postgres createdb inventory_db 2>/dev/null || echo "Database may already exist"
sudo -u postgres psql -c "CREATE USER inventory_user WITH PASSWORD 'toor';" 2>/dev/null || echo "User may already exist"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;" 2>/dev/null || true

echo "✅ Database setup complete"

# Start backend
echo "🚀 Starting backend..."
cd backend
npm start &
BACKEND_PID=$!
echo $BACKEND_PID > ../backend.pid
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🚀 Starting frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
echo $FRONTEND_PID > ../frontend.pid
cd ..

echo ""
echo "🎉 Application started successfully!"
echo "🌐 Frontend: http://localhost:3000"
echo "🌐 Backend: http://localhost:5000"
echo ""
echo "🔐 Default Login Credentials:"
echo "  • System Admin: admin / admin123"
echo "  • IT Manager: it_manager / admin123"
echo "  • Fleet Manager: fleet_manager / admin123"
echo "  • Store Manager: store_manager / admin123"
echo "  • Finance Manager: finance_manager / admin123"
echo ""
echo "🛑 To stop: kill \$(cat backend.pid frontend.pid)"
