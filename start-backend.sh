#!/bin/bash

# Ministry of Health Uganda Inventory Management System
# Backend Startup Script

echo "🇺🇬 Ministry of Health Uganda - Inventory Management System"
echo "============================================================="
echo "Starting Backend Server..."
echo ""

# Check if we're in the right directory
if [ ! -f "inventory-backend-master/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Navigate to backend directory
cd inventory-backend-master

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚙️  Setting up environment configuration..."
    if [ -f "environment.example" ]; then
        cp environment.example .env
        echo "✅ Environment file created from template"
        echo "📝 Please edit .env file with your database credentials"
    else
        echo "⚠️  Warning: No environment template found"
    fi
fi

# Check MySQL/MariaDB connection
echo "🔍 Checking database connection..."
node -e "
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'inventory_db',
  username: process.env.DB_USER || 'root',
  password: String(process.env.DB_PASS || ''),
  logging: false
});

sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection successful');
    process.exit(0);
  })
  .catch(err => {
    console.log('❌ Database connection failed:', err.message);
    console.log('');
    console.log('🔧 Database Setup Instructions:');
    console.log('1. Make sure MySQL/MariaDB is running');
    console.log('2. Create database: CREATE DATABASE inventory_db;');
    console.log('3. Update .env file with correct credentials');
    console.log('');
    process.exit(1);
  });
" 2>/dev/null

if [ $? -eq 0 ]; then
    echo ""
    echo "🚀 Starting backend server on port 5001..."
    echo "📍 API will be available at: http://localhost:5001"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo "============================================================="
    
    npm run server
else
    echo ""
    echo "⚠️  Database connection failed. Please check your setup."
    echo ""
    echo "🔧 Quick Setup Commands:"
    echo "sudo mariadb -e \"CREATE DATABASE inventory_db;\""
    echo "sudo mariadb -e \"CREATE USER 'inventory_user'@'localhost' IDENTIFIED BY 'secure_password';\""
    echo "sudo mariadb -e \"GRANT ALL PRIVILEGES ON inventory_db.* TO 'inventory_user'@'localhost';\""
    echo ""
    echo "Then update your .env file with the credentials."
fi
