#!/bin/bash

# Create PostgreSQL Database and User
# This script creates the database and user for the inventory system

echo "🐘 Creating PostgreSQL database and user..."

# Create database
sudo -u postgres createdb inventory_db 2>/dev/null || echo "Database may already exist"

# Create user
sudo -u postgres psql -c "CREATE USER inventory_user WITH PASSWORD 'toor';" 2>/dev/null || echo "User may already exist"

# Grant privileges
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE inventory_db TO inventory_user;" 2>/dev/null || true

# Grant schema privileges
sudo -u postgres psql -d inventory_db -c "GRANT ALL ON SCHEMA public TO inventory_user;" 2>/dev/null || true

echo "✅ PostgreSQL database and user created successfully!"
echo ""
echo "📋 Database Information:"
echo "├── Host: localhost"
echo "├── Port: 5432"
echo "├── Database: inventory_db"
echo "├── User: inventory_user"
echo "└── Password: toor"










