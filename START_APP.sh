#!/bin/bash

# Start both backend and frontend
cd "$(dirname "$0")"

echo "=========================================="
echo "  Starting Inventory Management System"
echo "=========================================="
echo ""

# Kill any existing processes
echo "Clearing existing processes..."
pkill -f "babel-node.*index.js" 2>/dev/null
pkill -f "react-scripts" 2>/dev/null
pkill -f "nodemon" 2>/dev/null
sleep 2

# Check environment file
if [ ! -f "config/environments/backend.env" ]; then
    echo "❌ Error: config/environments/backend.env not found"
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Start backend in background
echo "Starting backend on port 5000..."
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"
cd ..

# Wait for backend to start
sleep 5

# Start frontend in background
echo "Starting frontend on port 3000..."
cd frontend
PORT=3000 npm start > ../logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started (PID: $FRONTEND_PID)"
cd ..

echo ""
echo "=========================================="
echo "  Services Starting..."
echo "=========================================="
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Logs:"
echo "  Backend: tail -f logs/backend.log"
echo "  Frontend: tail -f logs/frontend.log"
echo ""
echo "To stop: pkill -f 'babel-node' && pkill -f 'react-scripts'"
echo ""

# Wait a bit and check status
sleep 10
echo "Checking status..."
if curl -s http://localhost:5000/api/system/health > /dev/null 2>&1; then
    echo "✅ Backend is running"
else
    echo "⏳ Backend is still starting..."
fi

if lsof -ti:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running"
else
    echo "⏳ Frontend is still compiling (30-60 seconds)..."
fi
