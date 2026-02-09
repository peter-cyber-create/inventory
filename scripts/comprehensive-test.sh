#!/bin/bash

# Comprehensive System Test Suite
# Tests all modules, endpoints, and operations (GET, POST, PUT, DELETE)

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
BACKEND_URL="http://localhost:5000"
TEST_USER="admin"
TEST_PASS="admin123"
TOKEN=""
TEST_RESULTS=()
PASSED=0
FAILED=0

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Comprehensive System Test Suite${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Function to print test results
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        TEST_RESULTS+=("PASS: $2")
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2"
        TEST_RESULTS+=("FAIL: $2")
        ((FAILED++))
    fi
}

# Function to make API call
api_call() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=${4:-200}
    
    if [ -z "$TOKEN" ]; then
        echo "No token available"
        return 1
    fi
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" -H "Authorization: Bearer $TOKEN" "$BACKEND_URL$endpoint")
    elif [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" "$BACKEND_URL$endpoint")
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -w "\n%{http_code}" -X PUT -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "$data" "$BACKEND_URL$endpoint")
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\n%{http_code}" -X DELETE -H "Authorization: Bearer $TOKEN" "$BACKEND_URL$endpoint")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "$expected_status" ]; then
        echo "$body"
        return 0
    else
        echo "HTTP $http_code: $body" >&2
        return 1
    fi
}

# 1. Test Authentication
echo -e "${YELLOW}[1] Testing Authentication...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/users/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$TEST_USER\",\"password\":\"$TEST_PASS\"}")

if echo "$LOGIN_RESPONSE" | grep -q "accessToken"; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    test_result 0 "Authentication successful"
elif echo "$LOGIN_RESPONSE" | grep -q "token"; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    test_result 0 "Authentication successful"
else
    test_result 1 "Authentication failed"
    echo "Response: $LOGIN_RESPONSE"
    exit 1
fi

# 2. Test Health Endpoint
echo -e "\n${YELLOW}[2] Testing System Health...${NC}"
HEALTH=$(curl -s "$BACKEND_URL/api/system/health")
if echo "$HEALTH" | grep -q "status"; then
    test_result 0 "Health endpoint working"
else
    test_result 1 "Health endpoint failed"
fi

# 3. Test ICT Assets Module - GET Endpoints
echo -e "\n${YELLOW}[3] Testing ICT Assets Module - GET Endpoints...${NC}"

ENDPOINTS=(
    "/api/category"
    "/api/type"
    "/api/brand"
    "/api/model"
    "/api/assets"
    "/api/staff"
    "/api/department"
    "/api/division"
    "/api/facility"
)

for endpoint in "${ENDPOINTS[@]}"; do
    response=$(api_call "GET" "$endpoint" "" 200 2>&1)
    if [ $? -eq 0 ]; then
        test_result 0 "GET $endpoint"
    else
        test_result 1 "GET $endpoint - $response"
    fi
done

# 4. Test ICT Assets Module - POST (Data Entry)
echo -e "\n${YELLOW}[4] Testing ICT Assets Module - POST (Data Entry)...${NC}"

# Get first category ID for testing
CATEGORIES=$(api_call "GET" "/api/category" "" 200 2>&1)
CATEGORY_ID=$(echo "$CATEGORIES" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2 || echo "1")

# Test creating a category
TIMESTAMP=$(date +%s)
CATEGORY_DATA="{\"name\":\"Test Category $TIMESTAMP\",\"description\":\"Test category for testing\"}"
response=$(api_call "POST" "/api/category" "$CATEGORY_DATA" "200\|201" 2>&1)
if [ $? -eq 0 ]; then
    NEW_CATEGORY_ID=$(echo "$response" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2 || echo "")
    test_result 0 "POST /api/category - Create category"
else
    test_result 1 "POST /api/category - $response"
fi

# Test creating a brand
BRAND_DATA="{\"name\":\"Test Brand $TIMESTAMP\",\"description\":\"Test brand\"}"
response=$(api_call "POST" "/api/brand" "$BRAND_DATA" "200\|201" 2>&1)
if [ $? -eq 0 ]; then
    NEW_BRAND_ID=$(echo "$response" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2 || echo "")
    test_result 0 "POST /api/brand - Create brand"
else
    test_result 1 "POST /api/brand - $response"
fi

# Test creating staff
STAFF_DATA="{\"firstname\":\"Test\",\"lastname\":\"User $TIMESTAMP\",\"email\":\"test$TIMESTAMP@test.com\",\"phone\":\"1234567890\",\"department\":\"IT\"}"
response=$(api_call "POST" "/api/staff" "$STAFF_DATA" "200\|201" 2>&1)
if [ $? -eq 0 ]; then
    NEW_STAFF_ID=$(echo "$response" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2 || echo "")
    test_result 0 "POST /api/staff - Create staff"
else
    test_result 1 "POST /api/staff - $response"
fi

# 5. Test Stores Module - GET Endpoints
echo -e "\n${YELLOW}[5] Testing Stores Module - GET Endpoints...${NC}"

STORES_ENDPOINTS=(
    "/api/stores/grn"
    "/api/stores/ledger"
    "/api/stores/form76a"
)

for endpoint in "${STORES_ENDPOINTS[@]}"; do
    response=$(api_call "GET" "$endpoint" "" "200\|404" 2>&1)
    if [ $? -eq 0 ]; then
        test_result 0 "GET $endpoint"
    else
        test_result 1 "GET $endpoint - $response"
    fi
done

# 6. Test Stores Module - POST (Data Entry)
echo -e "\n${YELLOW}[6] Testing Stores Module - POST (Data Entry)...${NC}"

# Test creating a GRN (simplified)
GRN_DATA="{\"grn_no\":\"GRN-TEST-$TIMESTAMP\",\"date\":\"$(date +%Y-%m-%d)\",\"supplier\":\"Test Supplier\",\"items\":[]}"
response=$(api_call "POST" "/api/stores/grn" "$GRN_DATA" "200\|201\|400" 2>&1)
if [ $? -eq 0 ]; then
    test_result 0 "POST /api/stores/grn - Create GRN"
else
    test_result 1 "POST /api/stores/grn - $response"
fi

# 7. Test Fleet Module - GET Endpoints
echo -e "\n${YELLOW}[7] Testing Fleet Module - GET Endpoints...${NC}"

FLEET_ENDPOINTS=(
    "/api/vehicles"
    "/api/vehicles/types"
)

for endpoint in "${FLEET_ENDPOINTS[@]}"; do
    response=$(api_call "GET" "$endpoint" "" "200\|404" 2>&1)
    if [ $? -eq 0 ]; then
        test_result 0 "GET $endpoint"
    else
        test_result 1 "GET $endpoint - $response"
    fi
done

# 8. Test Finance Module - GET Endpoints
echo -e "\n${YELLOW}[8] Testing Finance Module - GET Endpoints...${NC}"

FINANCE_ENDPOINTS=(
    "/api/activity"
    "/api/reports/accountability"
)

for endpoint in "${FINANCE_ENDPOINTS[@]}"; do
    response=$(api_call "GET" "$endpoint" "" "200\|404" 2>&1)
    if [ $? -eq 0 ]; then
        test_result 0 "GET $endpoint"
    else
        test_result 1 "GET $endpoint - $response"
    fi
done

# 9. Test Servers Module - GET Endpoints
echo -e "\n${YELLOW}[9] Testing Servers Module - GET Endpoints...${NC}"

SERVER_ENDPOINTS=(
    "/api/servers"
    "/api/servers/virtual"
)

for endpoint in "${SERVER_ENDPOINTS[@]}"; do
    response=$(api_call "GET" "$endpoint" "" "200\|404" 2>&1)
    if [ $? -eq 0 ]; then
        test_result 0 "GET $endpoint"
    else
        test_result 1 "GET $endpoint - $response"
    fi
done

# 10. Test Servers Module - POST (Data Entry)
echo -e "\n${YELLOW}[10] Testing Servers Module - POST (Data Entry)...${NC}"

# Test creating a server
SERVER_DATA="{\"serverName\":\"Test Server $TIMESTAMP\",\"IP\":\"192.168.1.100\",\"brand\":\"Dell\",\"memory\":\"16GB\",\"processor\":\"Intel i7\"}"
response=$(api_call "POST" "/api/servers" "$SERVER_DATA" "200\|201\|400" 2>&1)
if [ $? -eq 0 ]; then
    NEW_SERVER_ID=$(echo "$response" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4 || echo "")
    test_result 0 "POST /api/servers - Create server"
else
    test_result 1 "POST /api/servers - $response"
fi

# 11. Test Data Retrieval After Creation
echo -e "\n${YELLOW}[11] Testing Data Retrieval After Creation...${NC}"

if [ ! -z "$NEW_CATEGORY_ID" ]; then
    response=$(api_call "GET" "/api/category/$NEW_CATEGORY_ID" "" "200\|404" 2>&1)
    if [ $? -eq 0 ]; then
        test_result 0 "GET /api/category/$NEW_CATEGORY_ID - Retrieve created category"
    else
        test_result 1 "GET /api/category/$NEW_CATEGORY_ID - $response"
    fi
fi

# 12. Test PUT (Update) Operations
echo -e "\n${YELLOW}[12] Testing PUT (Update) Operations...${NC}"

if [ ! -z "$NEW_CATEGORY_ID" ]; then
    UPDATE_DATA="{\"name\":\"Updated Category $TIMESTAMP\",\"description\":\"Updated description\"}"
    response=$(api_call "PUT" "/api/category/$NEW_CATEGORY_ID" "$UPDATE_DATA" "200\|404" 2>&1)
    if [ $? -eq 0 ]; then
        test_result 0 "PUT /api/category/$NEW_CATEGORY_ID - Update category"
    else
        test_result 1 "PUT /api/category/$NEW_CATEGORY_ID - $response"
    fi
fi

# 13. Test DELETE Operations
echo -e "\n${YELLOW}[13] Testing DELETE Operations...${NC}"

if [ ! -z "$NEW_CATEGORY_ID" ]; then
    response=$(api_call "DELETE" "/api/category/$NEW_CATEGORY_ID" "" "200\|204\|404" 2>&1)
    if [ $? -eq 0 ]; then
        test_result 0 "DELETE /api/category/$NEW_CATEGORY_ID - Delete category"
    else
        test_result 1 "DELETE /api/category/$NEW_CATEGORY_ID - $response"
    fi
fi

# 14. Test Error Handling
echo -e "\n${YELLOW}[14] Testing Error Handling...${NC}"

# Test 404
response=$(api_call "GET" "/api/category/999999" "" "404" 2>&1)
if [ $? -eq 0 ]; then
    test_result 0 "Error handling - 404 for non-existent resource"
else
    test_result 1 "Error handling - 404"
fi

# Test invalid data
INVALID_DATA="{\"invalid\":\"data\"}"
response=$(api_call "POST" "/api/category" "$INVALID_DATA" "400\|422" 2>&1)
if [ $? -eq 0 ]; then
    test_result 0 "Error handling - 400 for invalid data"
else
    test_result 1 "Error handling - 400"
fi

# Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${BLUE}  Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "${BLUE}Total:  $((PASSED + FAILED))${NC}\n"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed! System is working correctly.${NC}\n"
    exit 0
else
    echo -e "${YELLOW}⚠ Some tests failed. Review the output above.${NC}\n"
    echo -e "${YELLOW}Failed tests:${NC}"
    for result in "${TEST_RESULTS[@]}"; do
        if [[ $result == FAIL:* ]]; then
            echo "  - ${result#FAIL: }"
        fi
    done
    exit 1
fi
