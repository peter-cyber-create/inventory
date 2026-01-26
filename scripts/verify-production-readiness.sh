#!/bin/bash

# Production Readiness Verification Script
# Ministry of Health Uganda - Inventory Management System

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "🔍 Production Readiness Verification"
echo "===================================="
echo ""

PASSED=0
FAILED=0
WARNINGS=0

# Function to check and report
check_item() {
    local name=$1
    local command=$2
    local required=${3:-true}
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} $name"
        ((PASSED++))
        return 0
    else
        if [ "$required" = "true" ]; then
            echo -e "${RED}❌${NC} $name (REQUIRED)"
            ((FAILED++))
            return 1
        else
            echo -e "${YELLOW}⚠️${NC} $name (OPTIONAL)"
            ((WARNINGS++))
            return 0
        fi
    fi
}

# 1. Check environment files
echo "📋 Environment Configuration"
echo "---------------------------"
check_item "Backend .env exists" "[ -f config/environments/backend.env ]"
check_item "Frontend .env.production exists" "[ -f frontend/.env.production ]"
check_item "Production.env exists" "[ -f production.env ]"
echo ""

# 2. Check database configuration
echo "🗄️  Database Configuration"
echo "---------------------------"
check_item "DB_NAME set in backend.env" "grep -q '^DB_NAME=' config/environments/backend.env"
check_item "DB_USER set in backend.env" "grep -q '^DB_USER=' config/environments/backend.env"
check_item "DB_PASS set in backend.env" "grep -q '^DB_PASS=' config/environments/backend.env && grep -vq 'CHANGE_THIS' config/environments/backend.env"
echo ""

# 3. Check frontend build
echo "🏗️  Frontend Build"
echo "-----------------"
if [ -d "frontend/build" ]; then
    check_item "Frontend build directory exists" "true"
    check_item "Frontend build has index.html" "[ -f frontend/build/index.html ]"
else
    echo -e "${YELLOW}⚠️${NC} Frontend build directory not found"
    echo "   Run: cd frontend && npm run build"
    ((WARNINGS++))
fi
echo ""

# 4. Check backend dependencies
echo "📦 Backend Dependencies"
echo "----------------------"
check_item "Backend node_modules exists" "[ -d backend/node_modules ]"
check_item "Backend package.json exists" "[ -f backend/package.json ]"
echo ""

# 5. Check frontend dependencies
echo "📦 Frontend Dependencies"
echo "-----------------------"
check_item "Frontend node_modules exists" "[ -d frontend/node_modules ]"
check_item "Frontend package.json exists" "[ -f frontend/package.json ]"
echo ""

# 6. Check deployment scripts
echo "🚀 Deployment Scripts"
echo "--------------------"
check_item "deploy-production.sh exists" "[ -f deploy-production.sh ]"
check_item "ecosystem.config.js exists" "[ -f ecosystem.config.js ]"
check_item "run-migrations.sh exists" "[ -f backend/run-migrations.sh ]"
echo ""

# 7. Check migrations
echo "🔄 Database Migrations"
echo "--------------------"
if [ -d "backend/migrations" ]; then
    MIGRATION_COUNT=$(ls -1 backend/migrations/*.js 2>/dev/null | wc -l)
    echo -e "${GREEN}✅${NC} Found $MIGRATION_COUNT migration files"
    ((PASSED++))
else
    echo -e "${RED}❌${NC} Migrations directory not found"
    ((FAILED++))
fi
echo ""

# 8. Check upload directories
echo "📁 Upload Directories"
echo "--------------------"
check_item "Backend uploads directory exists" "[ -d backend/uploads ]" false
check_item "Uploads directory is writable" "[ -w backend/uploads ]" false
echo ""

# 9. Check log directories
echo "📝 Log Directories"
echo "-----------------"
check_item "Logs directory exists" "[ -d logs ]" false
echo ""

# 10. Run database migration verification
echo "🔍 Database Migration Verification"
echo "----------------------------------"
if command -v node &> /dev/null; then
    if node scripts/verify-database-migrations.js 2>/dev/null; then
        echo -e "${GREEN}✅${NC} Database migrations verified"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠️${NC} Database migration verification failed"
        echo "   This may be normal if database is not set up yet"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠️${NC} Node.js not found, skipping database verification"
    ((WARNINGS++))
fi
echo ""

# Summary
echo "📊 Summary"
echo "---------"
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Production readiness check passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Review security hardening checklist"
    echo "2. Run database migrations on production server"
    echo "3. Build frontend: cd frontend && npm run build"
    echo "4. Deploy using: ./deploy-production.sh"
    exit 0
else
    echo -e "${RED}❌ Production readiness check failed!${NC}"
    echo ""
    echo "Please resolve the failed items above before deploying."
    exit 1
fi











