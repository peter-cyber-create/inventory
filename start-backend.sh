#!/bin/bash

# Start backend server script
cd "$(dirname "$0")"

echo "Starting Backend Server..."
echo ""

# Check if already running
if lsof -i :5000 > /dev/null 2>&1; then
    echo "⚠️  Port 5000 is already in use"
    echo "Stopping existing process..."
    pkill -f "babel-node.*index.js" || true
    pkill -f "nodemon.*backend" || true
    sleep 2
fi

# Check environment file
if [ ! -f "config/environments/backend.env" ]; then
    echo "❌ Error: config/environments/backend.env not found"
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Start backend
cd backend
echo "Starting backend on port 5000..."
echo "Logs will be displayed below. Press Ctrl+C to stop."
echo ""

npm run dev
