#!/bin/bash

# Migration script that substitutes environment variables in config.json
# and runs Sequelize migrations

set -e

echo "🔄 Running database migrations..."
echo ""

# Load environment variables from backend.env
if [ -f "../config/environments/backend.env" ]; then
    set -a
    source ../config/environments/backend.env
    set +a
    echo "✅ Loaded environment variables"
else
    echo "⚠️  Warning: backend.env not found"
    exit 1
fi

# Create a temporary config.json with actual values
CONFIG_FILE="config/config.json"
TEMP_CONFIG="config/config.temp.json"

# Substitute environment variables in config.json
envsubst < "$CONFIG_FILE" > "$TEMP_CONFIG"

# Run migrations using the temporary config
echo "Running Sequelize migrations..."
SEQUELIZE_CONFIG_PATH="$TEMP_CONFIG" npx sequelize-cli db:migrate --env development --config "$TEMP_CONFIG"

# Clean up temporary config
rm -f "$TEMP_CONFIG"

echo ""
echo "✅ Migrations completed!"

