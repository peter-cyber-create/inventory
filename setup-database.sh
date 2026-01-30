#!/bin/bash

# Database Setup Script
# Run this script to set up the PostgreSQL database for local development

set -e

echo "🗄️  Setting up PostgreSQL database..."
echo ""

# Database credentials from backend.env
DB_NAME="inventory_db"
DB_USER="inventory_user"
DB_PASSWORD="KLy1p6Wh0x4BnES5PdTCLA=="

# Check if database already exists
DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" 2>/dev/null || echo "0")

if [ "$DB_EXISTS" = "1" ]; then
    echo "⚠️  Database '$DB_NAME' already exists"
    read -p "Do you want to recreate it? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "Dropping existing database..."
        sudo -u postgres psql -c "DROP DATABASE IF EXISTS $DB_NAME;" 2>/dev/null || true
        sudo -u postgres psql -c "DROP USER IF EXISTS $DB_USER;" 2>/dev/null || true
        DB_EXISTS="0"
    else
        echo "✅ Using existing database"
        exit 0
    fi
fi

if [ "$DB_EXISTS" != "1" ]; then
    echo "Creating database..."
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" || {
        echo "❌ Failed to create database"
        exit 1
    }
    
    echo "Creating user..."
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || {
        echo "⚠️  User may already exist, updating password..."
        sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
    }
    
    echo "Granting privileges..."
    sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
    sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;"
    
    echo "✅ Database setup complete!"
    echo ""
    echo "Database: $DB_NAME"
    echo "User: $DB_USER"
    echo "Password: $DB_PASSWORD"
fi
























