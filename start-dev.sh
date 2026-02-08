#!/bin/bash

# Development startup script
# Starts backend and frontend in separate processes

cd "$(dirname "$0")"

echo "Starting Inventory Management System..."
echo ""

# Check if processes are already running
if pgrep -f "node.*backend.*index.js" > /dev/null; then
    echo "⚠️  Backend is already running"
else
    echo "Starting backend on port 5000..."
    cd backend
    npm run dev > ../logs/backend-dev.log 2>&1 &
    BACKEND_PID=$!
    echo "Backend started (PID: $BACKEND_PID)"
    cd ..
fi

# Wait a bit for backend to start
sleep 3

# Check if frontend is already running
if pgrep -f "react-scripts start" > /dev/null; then
    echo "⚠️  Frontend is already running"
else
    echo "Starting frontend on port 3000..."
    cd frontend
    npm start > ../logs/frontend-dev.log 2>&1 &
    FRONTEND_PID=$!
    echo "Frontend started (PID: $FRONTEND_PID)"
    cd ..
fi

echo ""
echo "✅ System starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Logs:"
echo "  Backend: tail -f logs/backend-dev.log"
echo "  Frontend: tail -f logs/frontend-dev.log"
echo ""
echo "To stop: pkill -f 'node.*backend' && pkill -f 'react-scripts'"
