#!/bin/bash

# Full System Test - All Modules, All Operations
BACKEND_URL="http://localhost:5000"
TEST_USER="admin"
TEST_PASS="admin123"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Full System Test Suite${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Get token
echo -e "${YELLOW}[1] Authenticating...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/users/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$TEST_USER\",\"password\":\"$TEST_PASS\"}")

if echo "$LOGIN_RESPONSE" | grep -q "accessToken"; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    echo -e "${GREEN}✓ Authentication successful${NC}\n"
    ((PASSED++))
else
    echo -e "${RED}✗ Authentication failed${NC}\n"
    exit 1
fi

# Test function
test_get() {
    local name=$1
    local endpoint=$2
    local response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN" "$BACKEND_URL$endpoint")
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ]; then
        echo -e "${GREEN}✓${NC} $name"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $name (HTTP $http_code)"
        ((FAILED++))
        return 1
    fi
}

test_post() {
    local name=$1
    local endpoint=$2
    local data=$3
    local response=$(curl -s -w "\n%{http_code}" -X POST \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d "$data" "$BACKEND_URL$endpoint")
    local http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo -e "${GREEN}✓${NC} $name"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $name (HTTP $http_code)"
        ((FAILED++))
        return 1
    fi
}

# Test all GET endpoints
echo -e "${YELLOW}[2] Testing GET Endpoints (Data Retrieval)...${NC}"

# ICT Assets
test_get "GET /api/category" "/api/category"
test_get "GET /api/type" "/api/type"
test_get "GET /api/brand" "/api/brand"
test_get "GET /api/model" "/api/model"
test_get "GET /api/assets" "/api/assets"
test_get "GET /api/staff" "/api/staff"
test_get "GET /api/department" "/api/department"
test_get "GET /api/division" "/api/division"
test_get "GET /api/facility" "/api/facility"

# Stores
test_get "GET /api/stores/grn" "/api/stores/grn"
test_get "GET /api/stores/ledger" "/api/stores/ledger"
test_get "GET /api/stores/form76a" "/api/stores/form76a"

# Fleet
test_get "GET /api/vehicles" "/api/vehicles"

# Finance
test_get "GET /api/activity" "/api/activity"
test_get "GET /api/reports/accountability" "/api/reports/accountability"

# Servers
test_get "GET /api/servers" "/api/servers"
test_get "GET /api/servers/virtual" "/api/servers/virtual"

echo ""

# Test POST endpoints (Data Entry)
echo -e "${YELLOW}[3] Testing POST Endpoints (Data Entry)...${NC}"

TIMESTAMP=$(date +%s)

test_post "POST /api/category" "/api/category" \
    "{\"name\":\"Test Category $TIMESTAMP\",\"description\":\"Test\"}"

test_post "POST /api/brand" "/api/brand" \
    "{\"name\":\"Test Brand $TIMESTAMP\",\"description\":\"Test\"}"

test_post "POST /api/staff" "/api/staff" \
    "{\"firstname\":\"Test\",\"lastname\":\"User$TIMESTAMP\",\"email\":\"test$TIMESTAMP@test.com\"}"

echo ""

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${BLUE}Total:  $((PASSED + FAILED))${NC}\n"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}\n"
    exit 0
else
    echo -e "${YELLOW}⚠ Some tests failed.${NC}\n"
    exit 1
fi
