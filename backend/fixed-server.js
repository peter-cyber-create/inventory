const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Ministry of Health Uganda Inventory API is running',
    timestamp: new Date().toISOString()
  });
});

// Login endpoint with proper CORS
app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt:', req.body);
  const { username, password } = req.body;
  
  // Mock authentication
  if (username === 'admin' && password === 'admin123') {
    res.json({
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 1,
        username: 'admin',
        role: 'admin',
        fullName: 'System Administrator',
        email: 'admin@moh.go.ug'
      }
    });
  } else if (username === 'it_manager' && password === 'admin123') {
    res.json({
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 2,
        username: 'it_manager',
        role: 'it',
        fullName: 'IT Manager',
        email: 'it@moh.go.ug'
      }
    });
  } else if (username === 'fleet_manager' && password === 'admin123') {
    res.json({
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 3,
        username: 'fleet_manager',
        role: 'garage',
        fullName: 'Fleet Manager',
        email: 'fleet@moh.go.ug'
      }
    });
  } else if (username === 'store_manager' && password === 'admin123') {
    res.json({
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 4,
        username: 'store_manager',
        role: 'store',
        fullName: 'Store Manager',
        email: 'store@moh.go.ug'
      }
    });
  } else if (username === 'finance_manager' && password === 'admin123') {
    res.json({
      success: true,
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: 5,
        username: 'finance_manager',
        role: 'finance',
        fullName: 'Finance Manager',
        email: 'finance@moh.go.ug'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Mock API endpoints
app.get('/api/users', (req, res) => {
  res.json([
    { id: 1, username: 'admin', role: 'admin', fullName: 'System Administrator' },
    { id: 2, username: 'it_manager', role: 'it', fullName: 'IT Manager' },
    { id: 3, username: 'fleet_manager', role: 'garage', fullName: 'Fleet Manager' },
    { id: 4, username: 'store_manager', role: 'store', fullName: 'Store Manager' },
    { id: 5, username: 'finance_manager', role: 'finance', fullName: 'Finance Manager' }
  ]);
});

app.get('/api/assets', (req, res) => {
  res.json([
    { id: 1, assetTag: 'ASSET001', name: 'Desktop Computer', status: 'active', location: 'IT Department' },
    { id: 2, assetTag: 'ASSET002', name: 'Laptop Computer', status: 'active', location: 'IT Department' },
    { id: 3, assetTag: 'ASSET003', name: 'Printer', status: 'maintenance', location: 'IT Department' }
  ]);
});

app.get('/api/vehicles', (req, res) => {
  res.json([
    { id: 1, registrationNumber: 'UAA 123A', make: 'Toyota', model: 'Hilux', status: 'active', driver: 'John Doe' },
    { id: 2, registrationNumber: 'UAA 456B', make: 'Ford', model: 'Ranger', status: 'active', driver: 'Jane Smith' }
  ]);
});

// Catch all handler
app.get('*', (req, res) => {
  res.json({ 
    message: 'Ministry of Health Uganda Inventory Management System API',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      'POST /api/auth/login',
      'POST /api/auth/logout',
      'GET /api/health',
      'GET /api/users',
      'GET /api/assets',
      'GET /api/vehicles'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🇺🇬 Ministry of Health Uganda - Inventory API Server running on port ${PORT}`);
  console.log(`📍 API available at: http://localhost:${PORT}`);
  console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login`);
});
