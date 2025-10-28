#!/bin/bash

# Admin Password Reset Script for Ministry of Health Uganda Inventory System
# This script ensures the admin user always has the default password

echo "🔐 Resetting Admin Password..."

# Reset admin password to default
curl -s -X PATCH http://localhost:5000/api/users/1/password \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"admin123","newPassword":"admin123"}' \
  > /dev/null

# Test login
echo "🧪 Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

if echo "$LOGIN_RESPONSE" | grep -q '"status":"success"'; then
    echo "✅ Admin login working successfully!"
    echo "📋 Default credentials:"
    echo "   Username: admin"
    echo "   Password: admin123"
else
    echo "❌ Login test failed"
    echo "Response: $LOGIN_RESPONSE"
fi
