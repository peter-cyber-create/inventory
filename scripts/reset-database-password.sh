#!/bin/bash

# Script to reset database password for inventory_user
# Run this on the server

set -e

DB_USER="${DB_USER:-inventory_user}"
DB_NAME="${DB_NAME:-inventory_db}"

echo "🔐 Database Password Reset Script"
echo "=================================="
echo ""

# Check if running as postgres user or with sudo
if [ "$EUID" -eq 0 ] || [ "$USER" = "postgres" ]; then
    echo "✅ Running with appropriate privileges"
else
    echo "⚠️  This script needs to be run with sudo or as postgres user"
    echo "   Run: sudo -u postgres $0"
    exit 1
fi

# Prompt for new password
echo "Enter new password for database user '$DB_USER':"
read -sp "New password: " NEW_PASSWORD
echo ""
read -sp "Confirm password: " CONFIRM_PASSWORD
echo ""

if [ "$NEW_PASSWORD" != "$CONFIRM_PASSWORD" ]; then
    echo "❌ Passwords do not match"
    exit 1
fi

if [ -z "$NEW_PASSWORD" ]; then
    echo "❌ Password cannot be empty"
    exit 1
fi

# Reset password
echo ""
echo "🔄 Resetting password for user '$DB_USER'..."
if [ "$USER" = "postgres" ]; then
    psql -c "ALTER USER $DB_USER WITH PASSWORD '$NEW_PASSWORD';"
else
    sudo -u postgres psql -c "ALTER USER $DB_USER WITH PASSWORD '$NEW_PASSWORD';"
fi

if [ $? -eq 0 ]; then
    echo "✅ Password reset successfully"
    echo ""
    echo "📝 Update your backend.env file with:"
    echo "   DB_PASS=$NEW_PASSWORD"
    echo ""
    echo "Run: nano config/environments/backend.env"
else
    echo "❌ Failed to reset password"
    exit 1
fi

