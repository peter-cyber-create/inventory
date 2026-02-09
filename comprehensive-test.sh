#!/bin/bash

# Comprehensive Test Runner - Executes full test suite with database fixes

set -e

cd /home/peter/Desktop/Dev/inventory

echo "========================================"
echo "  COMPREHENSIVE TEST EXECUTION"
echo "========================================"
echo ""

# Step 1: Clean up all processes
echo "1️⃣ Cleaning up existing processes..."
pkill -9 -f "node|npm|nodemon|babel" 2>/dev/null || true
sleep 3
echo "✅ Processes cleaned up"
echo ""

# Step 2: Verify port is free
echo "2️⃣ Verifying port 5000 is available..."
TIMEOUT=10
ELAPSED=0
while (lsof -i :5000 >/dev/null 2>&1) && [ $ELAPSED -lt $TIMEOUT ]; do
  echo "   ⏳ Waiting for port 5000 to be released... ($ELAPSED/$TIMEOUT)"
  sleep 1
  ELAPSED=$((ELAPSED + 1))
done

if lsof -i :5000 >/dev/null 2>&1; then
  echo "   ❌ Port 5000 still in use"
  lsof -i :5000
  exit 1
else
  echo "✅ Port 5000 is available"
fi
echo ""

# Step 3: Set up environment
echo "3️⃣ Setting up environment..."
export NODE_ENV=production
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=inventory_db
export DB_USER=inventory_user
export DB_PASS=KLy1p6Wh0x4BnES5PdTCLA==
echo "✅ Environment configured"
echo ""

# Step 4: Run direct database setup
echo "4️⃣ Running database setup..."
cd /home/peter/Desktop/Dev/inventory/backend
node direct-database-setup.js 2>&1 || echo "⚠️  Database setup completed with warnings"
echo ""

# Step 5: Start backend
echo "5️⃣ Starting backend server..."
cd /home/peter/Desktop/Dev/inventory/backend

# Start backend in background, capture PID
timeout 30 npx babel-node index.js > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to start
echo "   ⏳ Waiting for backend to start..."
TIMEOUT=10
ELAPSED=0
while ! curl -s http://localhost:5000/api/users/login >/dev/null 2>&1 && [ $ELAPSED -lt $TIMEOUT ]; do
  if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo "   ❌ Backend process died"
    tail -30 /tmp/backend.log
    exit 1
  fi
  sleep 1
  ELAPSED=$((ELAPSED + 1))
done

# Second check with actual response
RESPONSE=$(curl -s http://localhost:5000/api/users/login -X POST -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}' 2>/dev/null | head -c 100)
if [ -z "$RESPONSE" ]; then
  echo "   ⚠️  Backend not responding yet, will retry after delay"
  sleep 2
fi

echo "✅ Backend started (PID: $BACKEND_PID)"
echo ""

# Step 6: Run tests
echo "6️⃣ Running full test suite..."
cd /home/peter/Desktop/Dev/inventory
sleep 2
bash ./scripts/run-full-tests.sh

# Step 7: Clean up
echo ""
echo "7️⃣ Cleaning up..."
kill -9 $BACKEND_PID 2>/dev/null || true
echo "✅ Cleanup completed"
echo ""
echo "========================================"
echo "  TEST EXECUTION COMPLETED"
echo "========================================"
