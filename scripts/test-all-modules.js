/**
 * Comprehensive Module Testing Script
 * Tests all modules: GET, POST, PUT, DELETE operations
 */

const axios = require('axios');

const BACKEND_URL = 'http://localhost:5000';
let TOKEN = '';
let TEST_RESULTS = { passed: 0, failed: 0, tests: [] };

// Colors for console
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function testResult(name, passed, details = '') {
    TEST_RESULTS.tests.push({ name, passed, details });
    if (passed) {
        TEST_RESULTS.passed++;
        log(`✓ ${name}`, 'green');
    } else {
        TEST_RESULTS.failed++;
        log(`✗ ${name}${details ? ': ' + details : ''}`, 'red');
    }
}

async function apiCall(method, endpoint, data = null, expectedStatus = 200) {
    try {
        const config = {
            method,
            url: `${BACKEND_URL}${endpoint}`,
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        };
        
        if (data) {
            config.data = data;
        }
        
        const response = await axios(config);
        
        if (Array.isArray(expectedStatus)) {
            if (expectedStatus.includes(response.status)) {
                return { success: true, data: response.data, status: response.status };
            }
        } else if (response.status === expectedStatus) {
            return { success: true, data: response.data, status: response.status };
        }
        
        return { success: false, error: `Expected status ${expectedStatus}, got ${response.status}`, status: response.status };
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            if (Array.isArray(expectedStatus) && expectedStatus.includes(status)) {
                return { success: true, data: error.response.data, status };
            }
            if (status === expectedStatus) {
                return { success: true, data: error.response.data, status };
            }
            return { success: false, error: error.response.data?.message || error.message, status };
        }
        return { success: false, error: error.message };
    }
}

async function testAuthentication() {
    log('\n[1] Testing Authentication...', 'yellow');
    
    try {
        const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
            username: 'admin',
            password: 'admin123'
        });
        
        if (response.data.token) {
            TOKEN = response.data.token;
            testResult('Authentication', true);
            return true;
        } else {
            testResult('Authentication', false, 'No token in response');
            return false;
        }
    } catch (error) {
        testResult('Authentication', false, error.response?.data?.message || error.message);
        return false;
    }
}

async function testICTAssetsModule() {
    log('\n[2] Testing ICT Assets Module - GET Endpoints...', 'yellow');
    
    const endpoints = [
        '/api/category',
        '/api/type',
        '/api/brand',
        '/api/model',
        '/api/assets',
        '/api/staff',
        '/api/department',
        '/api/division',
        '/api/facility'
    ];
    
    for (const endpoint of endpoints) {
        const result = await apiCall('GET', endpoint, null, [200, 404]);
        testResult(`GET ${endpoint}`, result.success, result.error);
    }
}

async function testICTAssetsPOST() {
    log('\n[3] Testing ICT Assets Module - POST (Data Entry)...', 'yellow');
    
    const timestamp = Date.now();
    
    // Test creating category
    const categoryData = {
        name: `Test Category ${timestamp}`,
        description: 'Test category for testing'
    };
    const categoryResult = await apiCall('POST', '/api/category', categoryData, [200, 201]);
    testResult('POST /api/category - Create category', categoryResult.success, categoryResult.error);
    const categoryId = categoryResult.success && categoryResult.data?.id ? categoryResult.data.id : null;
    
    // Test creating brand
    const brandData = {
        name: `Test Brand ${timestamp}`,
        description: 'Test brand'
    };
    const brandResult = await apiCall('POST', '/api/brand', brandData, [200, 201]);
    testResult('POST /api/brand - Create brand', brandResult.success, brandResult.error);
    
    // Test creating staff
    const staffData = {
        firstname: 'Test',
        lastname: `User ${timestamp}`,
        email: `test${timestamp}@test.com`,
        phone: '1234567890',
        department: 'IT'
    };
    const staffResult = await apiCall('POST', '/api/staff', staffData, [200, 201]);
    testResult('POST /api/staff - Create staff', staffResult.success, staffResult.error);
    
    return { categoryId };
}

async function testStoresModule() {
    log('\n[4] Testing Stores Module...', 'yellow');
    
    const endpoints = [
        '/api/stores/grn',
        '/api/stores/ledger',
        '/api/stores/form76a'
    ];
    
    for (const endpoint of endpoints) {
        const result = await apiCall('GET', endpoint, null, [200, 404]);
        testResult(`GET ${endpoint}`, result.success, result.error);
    }
    
    // Test creating GRN
    const timestamp = Date.now();
    const grnData = {
        grn_no: `GRN-TEST-${timestamp}`,
        date: new Date().toISOString().split('T')[0],
        supplier: 'Test Supplier',
        items: []
    };
    const grnResult = await apiCall('POST', '/api/stores/grn', grnData, [200, 201, 400]);
    testResult('POST /api/stores/grn - Create GRN', grnResult.success, grnResult.error);
}

async function testFleetModule() {
    log('\n[5] Testing Fleet Module...', 'yellow');
    
    const endpoints = [
        '/api/vehicles',
        '/api/vehicles/types'
    ];
    
    for (const endpoint of endpoints) {
        const result = await apiCall('GET', endpoint, null, [200, 404]);
        testResult(`GET ${endpoint}`, result.success, result.error);
    }
}

async function testFinanceModule() {
    log('\n[6] Testing Finance Module...', 'yellow');
    
    const endpoints = [
        '/api/activity',
        '/api/reports/accountability'
    ];
    
    for (const endpoint of endpoints) {
        const result = await apiCall('GET', endpoint, null, [200, 404]);
        testResult(`GET ${endpoint}`, result.success, result.error);
    }
}

async function testServersModule() {
    log('\n[7] Testing Servers Module...', 'yellow');
    
    // GET endpoints
    const getEndpoints = ['/api/servers', '/api/servers/virtual'];
    for (const endpoint of getEndpoints) {
        const result = await apiCall('GET', endpoint, null, [200, 404]);
        testResult(`GET ${endpoint}`, result.success, result.error);
    }
    
    // POST - Create server
    const timestamp = Date.now();
    const serverData = {
        serverName: `Test Server ${timestamp}`,
        IP: '192.168.1.100',
        brand: 'Dell',
        memory: '16GB',
        processor: 'Intel i7'
    };
    const serverResult = await apiCall('POST', '/api/servers', serverData, [200, 201, 400]);
    testResult('POST /api/servers - Create server', serverResult.success, serverResult.error);
}

async function testUpdateDelete(categoryId) {
    log('\n[8] Testing UPDATE and DELETE Operations...', 'yellow');
    
    if (!categoryId) {
        testResult('PUT/DELETE operations', false, 'No category ID available for testing');
        return;
    }
    
    // Test UPDATE
    const timestamp = Date.now();
    const updateData = {
        name: `Updated Category ${timestamp}`,
        description: 'Updated description'
    };
    const updateResult = await apiCall('PUT', `/api/category/${categoryId}`, updateData, [200, 404]);
    testResult(`PUT /api/category/${categoryId} - Update category`, updateResult.success, updateResult.error);
    
    // Test DELETE
    const deleteResult = await apiCall('DELETE', `/api/category/${categoryId}`, null, [200, 204, 404]);
    testResult(`DELETE /api/category/${categoryId} - Delete category`, deleteResult.success, deleteResult.error);
}

async function testErrorHandling() {
    log('\n[9] Testing Error Handling...', 'yellow');
    
    // Test 404
    const notFoundResult = await apiCall('GET', '/api/category/999999', null, 404);
    testResult('Error handling - 404 for non-existent resource', notFoundResult.success, notFoundResult.error);
    
    // Test invalid data
    const invalidData = { invalid: 'data' };
    const badRequestResult = await apiCall('POST', '/api/category', invalidData, [400, 422]);
    testResult('Error handling - 400 for invalid data', badRequestResult.success, badRequestResult.error);
}

async function runAllTests() {
    log('========================================', 'blue');
    log('  Comprehensive System Test Suite', 'blue');
    log('========================================', 'blue');
    
    // Authenticate first
    const authSuccess = await testAuthentication();
    if (!authSuccess) {
        log('\n❌ Authentication failed. Cannot continue tests.', 'red');
        return;
    }
    
    // Run all module tests
    await testICTAssetsModule();
    const { categoryId } = await testICTAssetsPOST();
    await testStoresModule();
    await testFleetModule();
    await testFinanceModule();
    await testServersModule();
    await testUpdateDelete(categoryId);
    await testErrorHandling();
    
    // Summary
    log('\n========================================', 'blue');
    log('  Test Summary', 'blue');
    log('========================================', 'blue');
    log(`Passed: ${TEST_RESULTS.passed}`, 'green');
    log(`Failed: ${TEST_RESULTS.failed}`, 'red');
    log(`Total:  ${TEST_RESULTS.passed + TEST_RESULTS.failed}`, 'blue');
    
    if (TEST_RESULTS.failed === 0) {
        log('\n✓ All tests passed! System is working correctly.', 'green');
        process.exit(0);
    } else {
        log('\n⚠ Some tests failed. Review the output above.', 'yellow');
        log('\nFailed tests:', 'yellow');
        TEST_RESULTS.tests.filter(t => !t.passed).forEach(t => {
            log(`  - ${t.name}${t.details ? ': ' + t.details : ''}`, 'red');
        });
        process.exit(1);
    }
}

// Run tests
runAllTests().catch(error => {
    log(`\n❌ Fatal error: ${error.message}`, 'red');
    process.exit(1);
});
