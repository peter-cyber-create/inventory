#!/bin/bash

# Comprehensive System Test Script
# Tests frontend, backend, database, and all major workflows

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test configuration
BACKEND_URL="http://localhost:5000"
FRONTEND_URL="http://localhost:3000"
TEST_USER="admin"
TEST_PASS="admin123"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  System Comprehensive Test Suite${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# Function to check if service is running
check_service() {
    curl -s -f "$1" > /dev/null 2>&1
    return $?
}

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# 1. Check Backend Health
echo -e "\n${YELLOW}[1/10] Testing Backend Health...${NC}"
if check_service "$BACKEND_URL/api/system/health"; then
    print_result 0 "Backend is running and healthy"
    ((TESTS_PASSED++))
else
    print_result 1 "Backend is not responding"
    ((TESTS_FAILED++))
    echo -e "${RED}Error: Backend must be running on port 5000${NC}"
    exit 1
fi

# 2. Check Database Connection
echo -e "\n${YELLOW}[2/10] Testing Database Connection...${NC}"
DB_CHECK=$(curl -s "$BACKEND_URL/api/system/health" | grep -o '"database":"connected"' || echo "")
if [ ! -z "$DB_CHECK" ]; then
    print_result 0 "Database connection successful"
    ((TESTS_PASSED++))
else
    print_result 1 "Database connection failed"
    ((TESTS_FAILED++))
fi

# 3. Test Authentication
echo -e "\n${YELLOW}[3/10] Testing Authentication...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$TEST_USER\",\"password\":\"$TEST_PASS\"}")

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    print_result 0 "Authentication successful"
    ((TESTS_PASSED++))
else
    print_result 1 "Authentication failed"
    echo -e "${RED}Response: $LOGIN_RESPONSE${NC}"
    ((TESTS_FAILED++))
    TOKEN=""
fi

# 4. Test API Endpoints (with auth)
if [ ! -z "$TOKEN" ]; then
    echo -e "\n${YELLOW}[4/10] Testing Protected API Endpoints...${NC}"
    
    # Test Staff endpoint
    STAFF_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/api/staff")
    if echo "$STAFF_RESPONSE" | grep -q "staff\|\[\]"; then
        print_result 0 "Staff API endpoint working"
        ((TESTS_PASSED++))
    else
        print_result 1 "Staff API endpoint failed"
        ((TESTS_FAILED++))
    fi
    
    # Test Assets endpoint
    ASSETS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/api/assets")
    if echo "$ASSETS_RESPONSE" | grep -q "assets\|\[\]"; then
        print_result 0 "Assets API endpoint working"
        ((TESTS_PASSED++))
    else
        print_result 1 "Assets API endpoint failed"
        ((TESTS_FAILED++))
    fi
    
    # Test Categories endpoint
    CATEGORIES_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/api/category")
    if echo "$CATEGORIES_RESPONSE" | grep -q "category\|\[\]"; then
        print_result 0 "Categories API endpoint working"
        ((TESTS_PASSED++))
    else
        print_result 1 "Categories API endpoint failed"
        ((TESTS_FAILED++))
    fi
else
    echo -e "\n${YELLOW}[4/10] Skipping Protected Endpoints (no auth token)${NC}"
    ((TESTS_FAILED++))
fi

# 5. Test Data Creation (POST)
if [ ! -z "$TOKEN" ]; then
    echo -e "\n${YELLOW}[5/10] Testing Data Creation (POST)...${NC}"
    
    # Test creating a category (if endpoint exists)
    CREATE_TEST=$(curl -s -X POST "$BACKEND_URL/api/category" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"name":"Test Category '$(date +%s)'","description":"Test"}' || echo "ERROR")
    
    if echo "$CREATE_TEST" | grep -q "category\|id\|success"; then
        print_result 0 "Data creation (POST) working"
        ((TESTS_PASSED++))
    else
        print_result 1 "Data creation (POST) may have issues"
        echo -e "${YELLOW}Note: This may be expected if validation fails or endpoint requires more fields${NC}"
        ((TESTS_FAILED++))
    fi
else
    echo -e "\n${YELLOW}[5/10] Skipping Data Creation (no auth token)${NC}"
    ((TESTS_FAILED++))
fi

# 6. Test Data Retrieval (GET)
if [ ! -z "$TOKEN" ]; then
    echo -e "\n${YELLOW}[6/10] Testing Data Retrieval (GET)...${NC}"
    
    # Test multiple GET endpoints
    ENDPOINTS=("brand" "model" "department" "division" "facility")
    GET_SUCCESS=0
    GET_TOTAL=${#ENDPOINTS[@]}
    
    for endpoint in "${ENDPOINTS[@]}"; do
        RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BACKEND_URL/api/$endpoint")
        if echo "$RESPONSE" | grep -q "\[\]\|$endpoint\|id"; then
            ((GET_SUCCESS++))
        fi
    done
    
    if [ $GET_SUCCESS -eq $GET_TOTAL ]; then
        print_result 0 "All GET endpoints working ($GET_SUCCESS/$GET_TOTAL)"
        ((TESTS_PASSED++))
    else
        print_result 1 "Some GET endpoints failed ($GET_SUCCESS/$GET_TOTAL working)"
        ((TESTS_FAILED++))
    fi
else
    echo -e "\n${YELLOW}[6/10] Skipping Data Retrieval (no auth token)${NC}"
    ((TESTS_FAILED++))
fi

# 7. Test Frontend Build
echo -e "\n${YELLOW}[7/10] Testing Frontend Build...${NC}"
if [ -d "frontend/build" ]; then
    print_result 0 "Frontend build directory exists"
    ((TESTS_PASSED++))
else
    print_result 1 "Frontend build directory not found"
    echo -e "${YELLOW}Run: cd frontend && npm run build${NC}"
    ((TESTS_FAILED++))
fi

# 8. Check Frontend Service (if running)
echo -e "\n${YELLOW}[8/10] Testing Frontend Service...${NC}"
if check_service "$FRONTEND_URL"; then
    print_result 0 "Frontend is running"
    ((TESTS_PASSED++))
else
    print_result 1 "Frontend is not running (expected if not started)"
    echo -e "${YELLOW}Start with: npm run dev or npm run frontend:dev${NC}"
    ((TESTS_FAILED++))
fi

# 9. Test File Upload Directory
echo -e "\n${YELLOW}[9/10] Testing File Upload Configuration...${NC}"
if [ -d "backend/uploads" ]; then
    print_result 0 "Uploads directory exists"
    ((TESTS_PASSED++))
else
    print_result 1 "Uploads directory missing"
    echo -e "${YELLOW}Creating uploads directory...${NC}"
    mkdir -p backend/uploads
    ((TESTS_PASSED++))
fi

# 10. Test Environment Configuration
echo -e "\n${YELLOW}[10/10] Testing Environment Configuration...${NC}"
if [ -f "config/environments/backend.env" ]; then
    # Check required env vars
    source config/environments/backend.env 2>/dev/null || true
    REQUIRED_VARS=("DB_HOST" "DB_NAME" "DB_USER" "DB_PASS" "SECRETKEY" "PORT")
    MISSING_VARS=()
    
    for var in "${REQUIRED_VARS[@]}"; do
        if [ -z "${!var}" ]; then
            MISSING_VARS+=("$var")
        fi
    done
    
    if [ ${#MISSING_VARS[@]} -eq 0 ]; then
        print_result 0 "All required environment variables are set"
        ((TESTS_PASSED++))
    else
        print_result 1 "Missing environment variables: ${MISSING_VARS[*]}"
        ((TESTS_FAILED++))
    fi
else
    print_result 1 "backend.env file not found"
    ((TESTS_FAILED++))
fi

# Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}  Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo -e "${BLUE}Total:  $((TESTS_PASSED + TESTS_FAILED))${NC}\n"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! System is ready.${NC}\n"
    exit 0
else
    echo -e "${YELLOW}⚠ Some tests failed. Review the output above.${NC}\n"
    exit 1
fi
