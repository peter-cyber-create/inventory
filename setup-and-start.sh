#!/bin/bash

# Setup Database and Start Application
# This script ensures the database is set up with all migrations and initial data before starting

set -e

echo "🚀 Setting up database and starting application..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Load environment variables
if [ -f "config/environments/backend.env" ]; then
    echo -e "${GREEN}Loading environment variables...${NC}"
    export $(cat config/environments/backend.env | grep -v '^#' | xargs)
else
    echo -e "${YELLOW}Warning: backend.env not found${NC}"
fi

# Check if PostgreSQL is running
echo -e "${GREEN}Checking PostgreSQL...${NC}"
if ! systemctl is-active --quiet postgresql 2>/dev/null && ! pg_isready -h localhost 2>/dev/null; then
    echo -e "${RED}PostgreSQL is not running. Please start PostgreSQL first.${NC}"
    exit 1
fi

# Check if database exists, create if not
echo -e "${GREEN}Checking database...${NC}"
DB_NAME="${DB_NAME:-inventory_db}"
DB_USER="${DB_USER:-inventory_user}"

if ! PGPASSWORD="${DB_PASS}" psql -h "${DB_HOST:-localhost}" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
    echo -e "${YELLOW}Database does not exist. Creating...${NC}"
    
    # Create database (requires postgres user)
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || echo "Database may already exist"
    
    # Create user if doesn't exist
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '${DB_PASS}';" 2>/dev/null || echo "User may already exist"
    
    # Grant privileges
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
    sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO $DB_USER;"
    
    echo -e "${GREEN}Database created!${NC}"
fi

# Run migrations
echo -e "${GREEN}Running database migrations...${NC}"
cd backend
chmod +x run-migrations.sh
./run-migrations.sh
cd ..

# Check if migrations created users
echo -e "${GREEN}Verifying initial data...${NC}"
USER_COUNT=$(PGPASSWORD="${DB_PASS}" psql -h "${DB_HOST:-localhost}" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | tr -d ' ' || echo "0")

if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
    echo -e "${YELLOW}No users found. Running migration to create default users...${NC}"
    cd backend
    npx sequelize-cli db:migrate --to 20250120000004-fix-users-table.js
    cd ..
fi

echo -e "${GREEN}✅ Database setup complete!${NC}"
echo ""
echo -e "${GREEN}Default users created:${NC}"
echo "  • admin / admin123 (System Administrator)"
echo "  • it_manager / admin123 (IT Manager)"
echo "  • store_manager / admin123 (Store Manager)"
echo "  • fleet_manager / admin123 (Fleet Manager)"
echo "  • finance_manager / admin123 (Finance Manager)"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Change all default passwords immediately after first login!${NC}"
echo ""

# Start the application
echo -e "${GREEN}Starting application...${NC}"
npm run dev



