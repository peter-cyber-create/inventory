#!/bin/bash

# Production Deployment Script for Ministry of Health Uganda Inventory Management System

echo "🚀 Starting Production Deployment..."

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Build frontend for production
echo "🏗️ Building frontend for production..."
cd frontend && npm run build && cd ..

# Create production environment file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating production environment file..."
    cp production.env.example .env
    echo "⚠️  Please update .env file with your production configuration"
fi

# Create logs directory
mkdir -p logs

# Set proper permissions
chmod +x scripts/maintenance/stop-application.sh
chmod +x scripts/maintenance/start-application.sh

echo "✅ Deployment preparation completed!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env file with your production configuration"
echo "2. Set up PostgreSQL database"
echo "3. Run: npm run start:production"
echo ""
echo "🌐 Your application will be available at:"
echo "   Frontend: http://your-domain:3001"
echo "   Backend API: http://your-domain:5000"
echo ""
echo "🔐 Default admin credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo "   ⚠️  Please change the default password after first login!"
