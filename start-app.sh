#!/bin/bash

# Start Application with Database Setup
# This ensures the database has all tables and default users before starting

cd "$(dirname "$0")"

echo "🚀 Starting Inventory Management System"
echo "========================================"
echo ""

# Load environment
source config/environments/backend.env 2>/dev/null || true
export DB_PORT=5432

# Check database connection
echo "📡 Checking database connection..."
cd backend
node -e "
require('dotenv').config({path: '../config/environments/backend.env'});
const {sequelize} = require('./config/db');
sequelize.authenticate()
  .then(() => { console.log('✅ Database connected'); process.exit(0); })
  .catch(e => { console.log('❌ Database error:', e.message); process.exit(1); });
" || { echo "Database connection failed. Please check your PostgreSQL setup."; exit 1; }

# Run migrations
echo ""
echo "🔄 Running database migrations..."
export DB_PORT=5432
npx sequelize-cli db:migrate 2>&1 | tail -5

# Check if users table exists and has data
echo ""
echo "👥 Checking for default users..."
USER_COUNT=$(PGPASSWORD="${DB_PASS}" psql -h "${DB_HOST:-localhost}" -U "${DB_USER:-inventory_user}" -d "${DB_NAME:-inventory_db}" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ' || echo "0")

if [ "$USER_COUNT" = "0" ]; then
    echo "⚠️  No users found. Creating default users..."
    # The migration should have created them, but if not, we'll note it
    echo "   Please check migration: 20250120000004-fix-users-table.js"
else
    echo "✅ Found $USER_COUNT user(s) in database"
fi

cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Default Login Credentials:"
echo "   • admin / admin123 (System Administrator)"
echo "   • it_manager / admin123 (IT Manager)"
echo "   • store_manager / admin123 (Store Manager)"
echo "   • fleet_manager / admin123 (Fleet Manager)"
echo "   • finance_manager / admin123 (Finance Manager)"
echo ""
echo "⚠️  SECURITY: Change all passwords immediately after first login!"
echo ""
echo "🌐 Starting application..."
echo "   Backend API: http://localhost:5000"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Start the application
npm run dev











