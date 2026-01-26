#!/bin/bash
# Quick start script - runs migrations and starts app

cd "$(dirname "$0")"

echo "🚀 Quick Start - Inventory Management System"
echo "============================================"
echo ""

# Load env vars
if [ -f "config/environments/backend.env" ]; then
    export $(cat config/environments/backend.env | grep -v '^#' | xargs)
fi

# Run migrations in background, then start app
echo "📦 Step 1: Running database migrations..."
cd backend
export DB_PORT=5432
npx sequelize-cli db:migrate 2>&1 | grep -E "(migrated|Error|error)" || echo "Migrations check complete"
cd ..

echo ""
echo "✅ Step 2: Starting application..."
echo "   Backend: http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "   Default login: admin / admin123"
echo "   ⚠️  Change password after first login!"
echo ""

# Start app
npm run dev










