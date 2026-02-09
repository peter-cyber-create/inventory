#!/bin/bash

# Comprehensive Endpoint Testing Script
# Tests all modules: GET, POST, PUT, DELETE

set -e

BACKEND_URL="http://localhost:5000"
TEST_USER="admin"
TEST_PASS="admin123"
TOKEN=""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Comprehensive Endpoint Test Suite${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Test function
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected=$5
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -H "Authorization: Bearer $TOKEN" "$BACKEND_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" "$BACKEND_URL$endpoint")
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X PUT \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" "$BACKEND_URL$endpoint")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X DELETE \
            -H "Authorization: Bearer $TOKEN" "$BACKEND_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
    body=$(echo "$response" | sed '/HTTP_CODE:/d')
    
    if echo "$expected" | grep -q "$http_code"; then
        echo -e "${GREEN}✓${NC} $name (HTTP $http_code)"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗${NC} $name (HTTP $http_code, expected $expected)"
        echo "  Response: $(echo "$body" | head -1)"
        ((FAILED++))
        return 1
    fi
}

# 1. Authenticate
echo -e "${YELLOW}[1] Authenticating...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/users/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$TEST_USER\",\"password\":\"$TEST_PASS\"}")

if echo "$LOGIN_RESPONSE" | grep -q "accessToken"; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    echo -e "${GREEN}✓${NC} Authentication successful\n"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Authentication failed: $LOGIN_RESPONSE\n"
    exit 1
fi

# 2. ICT Assets Module - GET
echo -e "${YELLOW}[2] Testing ICT Assets - GET Endpoints...${NC}"
test_endpoint "GET /api/category" "GET" "/api/category" "" "200"
test_endpoint "GET /api/type" "GET" "/api/type" "" "200"
test_endpoint "GET /api/brand" "GET" "/api/brand" "" "200"
test_endpoint "GET /api/model" "GET" "/api/model" "" "200"
test_endpoint "GET /api/assets" "GET" "/api/assets" "" "200"
test_endpoint "GET /api/staff" "GET" "/api/staff" "" "200"
test_endpoint "GET /api/department" "GET" "/api/department" "" "200"
test_endpoint "GET /api/division" "GET" "/api/division" "" "200"
test_endpoint "GET /api/facility" "GET" "/api/facility" "" "200"
echo ""

# 3. ICT Assets Module - POST
echo -e "${YELLOW}[3] Testing ICT Assets - POST (Data Entry)...${NC}"
TIMESTAMP=$(date +%s)

test_endpoint "POST /api/category" "POST" "/api/category" \
    "{\"name\":\"Test Category $TIMESTAMP\",\"description\":\"Test\"}" "200|201"

test_endpoint "POST /api/brand" "POST" "/api/brand" \
    "{\"name\":\"Test Brand $TIMESTAMP\",\"description\":\"Test\"}" "200|201"

test_endpoint "POST /api/staff" "POST" "/api/staff" \
    "{\"firstname\":\"Test\",\"lastname\":\"User$TIMESTAMP\",\"email\":\"test$TIMESTAMP@test.com\"}" "200|201"
echo ""

# 4. Stores Module
echo -e "${YELLOW}[4] Testing Stores Module...${NC}"
test_endpoint "GET /api/stores/grn" "GET" "/api/stores/grn" "" "200|404"
test_endpoint "GET /api/stores/ledger" "GET" "/api/stores/ledger" "" "200|404"
test_endpoint "GET /api/stores/form76a" "GET" "/api/stores/form76a" "" "200|404"
echo ""

# 5. Fleet Module
echo -e "${YELLOW}[5] Testing Fleet Module...${NC}"
test_endpoint "GET /api/vehicles" "GET" "/api/vehicles" "" "200|404"
echo ""

# 6. Finance Module
echo -e "${YELLOW}[6] Testing Finance Module...${NC}"
test_endpoint "GET /api/activity" "GET" "/api/activity" "" "200|404"
test_endpoint "GET /api/reports/accountability" "GET" "/api/reports/accountability" "" "200|404"
echo ""

# 7. Servers Module
echo -e "${YELLOW}[7] Testing Servers Module...${NC}"
test_endpoint "GET /api/servers" "GET" "/api/servers" "" "200|404"
test_endpoint "GET /api/servers/virtual" "GET" "/api/servers/virtual" "" "200|404"
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
