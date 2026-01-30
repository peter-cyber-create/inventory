#!/bin/bash

# Production Environment Setup Script
# Creates necessary .env files for production deployment

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔧 Setting up production environment files..."
echo ""

# Create frontend .env.production if it doesn't exist
if [ ! -f "frontend/.env.production" ]; then
    cat > frontend/.env.production << 'EOF'
# Production Environment Configuration for Frontend
# Ministry of Health Uganda - Inventory Management System

# API Configuration
# Update these URLs to match your production server
REACT_APP_API_BASE_URL_PROD=http://172.27.0.10:5000
REACT_APP_API_BASE_URL_DEV=http://localhost:5000

# API Version
REACT_APP_API_VERSION=v1

# Mock API (disable in production)
REACT_APP_MOCK_API=false

# Upload Configuration
REACT_APP_UPLOAD_URL=http://172.27.0.10:5000

# Build Configuration
GENERATE_SOURCEMAP=false

# Environment
NODE_ENV=production
EOF
    echo -e "${GREEN}✅${NC} Created frontend/.env.production"
else
    echo -e "${YELLOW}⚠️${NC} frontend/.env.production already exists"
fi

# Create frontend .env.development if it doesn't exist
if [ ! -f "frontend/.env.development" ]; then
    cat > frontend/.env.development << 'EOF'
# Development Environment Configuration for Frontend
# Ministry of Health Uganda - Inventory Management System

# API Configuration
REACT_APP_API_BASE_URL_DEV=http://localhost:5000
REACT_APP_API_BASE_URL_PROD=http://172.27.0.10:5000

# API Version
REACT_APP_API_VERSION=v1

# Mock API (enable for testing without backend)
REACT_APP_MOCK_API=false

# Upload Configuration
REACT_APP_UPLOAD_URL=http://localhost:5000

# Build Configuration
GENERATE_SOURCEMAP=true

# Environment
NODE_ENV=development
EOF
    echo -e "${GREEN}✅${NC} Created frontend/.env.development"
else
    echo -e "${YELLOW}⚠️${NC} frontend/.env.development already exists"
fi

# Verify backend.env exists
if [ ! -f "config/environments/backend.env" ]; then
    if [ -f "config/environments/backend.env.example" ]; then
        cp config/environments/backend.env.example config/environments/backend.env
        echo -e "${GREEN}✅${NC} Created config/environments/backend.env from example"
        echo -e "${YELLOW}⚠️${NC} Please update database credentials in backend.env"
    else
        echo -e "${YELLOW}⚠️${NC} backend.env.example not found"
    fi
else
    echo -e "${GREEN}✅${NC} config/environments/backend.env exists"
fi

# Verify production.env exists
if [ ! -f "production.env" ]; then
    if [ -f "production.env.example" ]; then
        cp production.env.example production.env
        echo -e "${GREEN}✅${NC} Created production.env from example"
        echo -e "${YELLOW}⚠️${NC} Please update production values in production.env"
    else
        echo -e "${YELLOW}⚠️${NC} production.env.example not found"
    fi
else
    echo -e "${GREEN}✅${NC} production.env exists"
fi

echo ""
echo "✅ Environment setup completed!"
echo ""
echo "Next steps:"
echo "1. Update frontend/.env.production with your production API URL"
echo "2. Update config/environments/backend.env with database credentials"
echo "3. Update production.env with production settings"















