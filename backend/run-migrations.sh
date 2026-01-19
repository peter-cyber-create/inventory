#!/bin/bash

# Migration script that loads environment variables first
# This ensures Sequelize CLI has access to the database credentials

set -e

echo "🔄 Running database migrations..."
echo ""

# Load environment variables from backend.env
if [ -f "../config/environments/backend.env" ]; then
    export $(cat ../config/environments/backend.env | grep -v '^#' | xargs)
    echo "✅ Loaded environment variables"
else
    echo "⚠️  Warning: backend.env not found, using config.json defaults"
fi

# Run migrations
echo "Running Sequelize migrations..."
npx sequelize-cli db:migrate

echo ""
echo "✅ Migrations completed!"













