#!/bin/bash

# Migration script that loads environment variables and substitutes them in config.json
# This ensures Sequelize CLI has access to the database credentials

set -e

echo "🔄 Running database migrations..."
echo ""

# Load environment variables from backend.env
if [ -f "../config/environments/backend.env" ]; then
    set -a
    source ../config/environments/backend.env
    set +a
    echo "✅ Loaded environment variables"
    echo "   DB_HOST: $DB_HOST"
    echo "   DB_NAME: $DB_NAME"
    echo "   DB_USER: $DB_USER"
else
    echo "⚠️  Warning: backend.env not found"
    exit 1
fi

# Create temporary config with substituted values
CONFIG_FILE="config/config.json"
TEMP_CONFIG="config/config.temp.json"

# Substitute environment variables using sed
sed "s|\${DB_HOST}|$DB_HOST|g; s|\${DB_PORT}|${DB_PORT:-5432}|g; s|\${DB_NAME}|$DB_NAME|g; s|\${DB_USER}|$DB_USER|g; s|\${DB_PASS}|$DB_PASS|g" "$CONFIG_FILE" > "$TEMP_CONFIG"

# Run migrations using the temporary config
echo "Running Sequelize migrations..."
npx sequelize-cli db:migrate --env development --config "$TEMP_CONFIG"

# Clean up temporary config
rm -f "$TEMP_CONFIG"

echo ""
echo "✅ Migrations completed!"















