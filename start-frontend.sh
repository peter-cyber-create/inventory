#!/bin/bash

# Start frontend server script
cd "$(dirname "$0")/frontend"

echo "Starting Frontend Server..."
echo ""

# Check if already running
if lsof -i :3000 > /dev/null 2>&1; then
    echo "⚠️  Port 3000 is already in use"
    echo "Stopping existing process..."
    pkill -f "react-scripts" || true
    sleep 2
fi

echo "Starting frontend on port 3000..."
echo "This will take 30-60 seconds to compile..."
echo ""

npm start
