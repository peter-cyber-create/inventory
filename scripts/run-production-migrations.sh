#!/bin/bash

# Production Database Migration Runner
# Ministry of Health Uganda - Inventory Management System

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔄 Running Production Database Migrations"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ]; then
    echo -e "${RED}❌${NC} Error: Must run from project root directory"
    exit 1
fi

# Load environment variables
if [ -f "config/environments/backend.env" ]; then
    echo "📋 Loading environment variables from backend.env..."
    export $(cat config/environments/backend.env | grep -v '^#' | xargs)
    echo -e "${GREEN}✅${NC} Environment variables loaded"
else
    echo -e "${RED}❌${NC} Error: backend.env not found"
    echo "   Create it from: config/environments/backend.env.example"
    exit 1
fi

# Verify required environment variables
echo ""
echo "🔍 Verifying required environment variables..."
REQUIRED_VARS=("DB_NAME" "DB_USER" "DB_PASS")
MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${RED}❌${NC} Missing required environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "Please set these in config/environments/backend.env"
    exit 1
fi

echo -e "${GREEN}✅${NC} All required environment variables set"
echo ""

# Test database connection
echo "🔌 Testing database connection..."
cd backend

# Use node to test connection
node -e "
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection successful');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
" || {
    echo -e "${RED}❌${NC} Database connection failed"
    echo "   Please check your database credentials in backend.env"
    exit 1
}

echo ""

# Run migrations
echo "🔄 Running Sequelize migrations..."
if command -v npx &> /dev/null; then
    if npx sequelize-cli db:migrate; then
        echo ""
        echo -e "${GREEN}✅${NC} Migrations completed successfully!"
    else
        echo ""
        echo -e "${RED}❌${NC} Migration failed"
        exit 1
    fi
else
    echo -e "${RED}❌${NC} npx not found. Please install Node.js and npm"
    exit 1
fi

echo ""
echo "📊 Migration Status:"
npx sequelize-cli db:migrate:status 2>/dev/null || echo "   (Status check unavailable)"

echo ""
echo -e "${GREEN}✅${NC} Production migrations completed!"











