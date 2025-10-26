#!/bin/bash

echo "🛑 Stopping all Ministry of Health Uganda Inventory services..."

# Stop backend
if [ -f "backend.pid" ]; then
    BACKEND_PID=$(cat backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo "✅ Backend service stopped (PID: $BACKEND_PID)"
    fi
    rm -f backend.pid
fi

# Stop frontend
if [ -f "frontend.pid" ]; then
    FRONTEND_PID=$(cat frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo "✅ Frontend service stopped (PID: $FRONTEND_PID)"
    fi
    rm -f frontend.pid
fi

# Stop Next.js
if [ -f "nextjs.pid" ]; then
    NEXTJS_PID=$(cat nextjs.pid)
    if kill -0 $NEXTJS_PID 2>/dev/null; then
        kill $NEXTJS_PID
        echo "✅ Next.js service stopped (PID: $NEXTJS_PID)"
    fi
    rm -f nextjs.pid
fi

echo "🛑 All services stopped successfully!"
