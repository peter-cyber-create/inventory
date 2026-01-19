#!/bin/bash
# Quick start script for local development

echo "🚀 Starting MoH Uganda IMS..."
echo ""

# Check if database exists
DB_CHECK=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='inventory_db'" 2>/dev/null || echo "0")

if [ "$DB_CHECK" != "1" ]; then
    echo "⚠️  Database not found. Please run:"
    echo "   ./setup-database.sh"
    echo ""
    read -p "Do you want to set up the database now? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ./setup-database.sh
    else
        echo "Exiting. Please set up the database first."
        exit 1
    fi
fi

echo "Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

sleep 3

echo "Starting frontend server..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Servers starting..."
echo ""
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM
wait
