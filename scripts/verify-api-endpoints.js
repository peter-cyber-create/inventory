#!/usr/bin/env node

/**
 * API Endpoint Verification Script
 * Verifies that all critical API endpoints are accessible
 */

const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/environments/backend.env') });

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';
const TIMEOUT = 10000; // 10 seconds

const criticalEndpoints = [
  {
    name: 'Health Check',
    method: 'GET',
    path: '/api/system/health',
    auth: false,
    expectedStatus: 200
  },
  {
    name: 'User Login',
    method: 'POST',
    path: '/api/users/login',
    auth: false,
    expectedStatus: 200,
    body: { username: 'admin', password: 'admin123' }
  },
  {
    name: 'Get Assets',
    method: 'GET',
    path: '/api/assets',
    auth: true,
    expectedStatus: [200, 401] // 401 is OK if not authenticated
  },
  {
    name: 'Get Vehicles',
    method: 'GET',
    path: '/api/v/vehicle',
    auth: true,
    expectedStatus: [200, 401]
  },
  {
    name: 'Get GRNs',
    method: 'GET',
    path: '/api/stores/grn',
    auth: true,
    expectedStatus: [200, 401]
  },
  {
    name: 'Get Activities',
    method: 'GET',
    path: '/api/activity',
    auth: true,
    expectedStatus: [200, 401]
  }
];

let authToken = null;

async function login() {
  try {
    const response = await axios.post(`${BASE_URL}/api/users/login`, {
      username: 'admin',
      password: 'admin123'
    }, { timeout: TIMEOUT });

    if (response.data.token) {
      authToken = response.data.token;
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

async function testEndpoint(endpoint) {
  try {
    const config = {
      method: endpoint.method,
      url: `${BASE_URL}${endpoint.path}`,
      timeout: TIMEOUT,
      headers: {}
    };

    if (endpoint.auth && authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    if (endpoint.body) {
      config.data = endpoint.body;
    }

    const response = await axios(config);
    const status = response.status;
    const expectedStatuses = Array.isArray(endpoint.expectedStatus) 
      ? endpoint.expectedStatus 
      : [endpoint.expectedStatus];

    if (expectedStatuses.includes(status)) {
      return { success: true, status, message: 'OK' };
    } else {
      return { success: false, status, message: `Expected ${endpoint.expectedStatus}, got ${status}` };
    }
  } catch (error) {
    const status = error.response?.status || 'NETWORK_ERROR';
    const expectedStatuses = Array.isArray(endpoint.expectedStatus) 
      ? endpoint.expectedStatus 
      : [endpoint.expectedStatus];

    if (expectedStatuses.includes(status)) {
      return { success: true, status, message: 'OK (expected error)' };
    } else {
      return { success: false, status, message: error.response?.data?.message || error.message };
    }
  }
}

async function verifyEndpoints() {
  console.log('🔍 Verifying API endpoints...\n');
  console.log(`Base URL: ${BASE_URL}\n`);

  // Test health check first
  const healthCheck = criticalEndpoints.find(e => e.path === '/api/system/health');
  if (healthCheck) {
    const result = await testEndpoint(healthCheck);
    if (!result.success) {
      console.error('❌ Health check failed. Is the backend server running?');
      console.error(`   ${result.message}\n`);
      process.exit(1);
    }
    console.log(`✅ ${healthCheck.name}: ${result.status} ${result.message}\n`);
  }

  // Try to login for authenticated endpoints
  console.log('🔐 Attempting authentication...');
  const loggedIn = await login();
  if (loggedIn) {
    console.log('✅ Authentication successful\n');
  } else {
    console.log('⚠️  Authentication failed (using default credentials)\n');
    console.log('   This is OK if default credentials have been changed\n');
  }

  // Test all endpoints
  console.log('📡 Testing endpoints...\n');
  let passed = 0;
  let failed = 0;

  for (const endpoint of criticalEndpoints) {
    if (endpoint.path === '/api/system/health') continue; // Already tested

    process.stdout.write(`   Testing ${endpoint.name}... `);
    const result = await testEndpoint(endpoint);

    if (result.success) {
      console.log(`✅ ${result.status}`);
      passed++;
    } else {
      console.log(`❌ ${result.status} - ${result.message}`);
      failed++;
    }
  }

  console.log('\n📊 Results:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📋 Total: ${passed + failed}\n`);

  if (failed === 0) {
    console.log('✅ All API endpoints verified successfully!\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some endpoints failed verification.');
    console.log('   This may be normal if:');
    console.log('   - Backend is not running');
    console.log('   - Authentication is required');
    console.log('   - Endpoints are not yet implemented\n');
    process.exit(1);
  }
}

verifyEndpoints();














