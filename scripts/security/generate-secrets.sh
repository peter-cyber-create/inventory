#!/bin/bash

# Secure Secret Generation Script
# This script generates cryptographically secure secrets for production use

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔐 Secure Secret Generator${NC}"
echo "================================"
echo ""

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js not found. Using OpenSSL instead.${NC}"
    USE_NODE=false
else
    USE_NODE=true
fi

echo -e "${GREEN}Generating secure secrets...${NC}"
echo ""

# Generate JWT Secret (64 bytes = 128 hex characters)
if [ "$USE_NODE" = true ]; then
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
else
    JWT_SECRET=$(openssl rand -hex 64)
fi

# Generate Session Secret (32 bytes = 64 hex characters)
if [ "$USE_NODE" = true ]; then
    SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
else
    SESSION_SECRET=$(openssl rand -hex 32)
fi

# Generate Database Password (24 bytes = 48 hex characters)
if [ "$USE_NODE" = true ]; then
    DB_PASSWORD=$(node -e "console.log(require('crypto').randomBytes(24).toString('base64'))")
else
    DB_PASSWORD=$(openssl rand -base64 24)
fi

echo -e "${GREEN}✅ Secrets generated successfully!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}⚠️  IMPORTANT: Save these secrets securely. They will not be shown again.${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Generated Secrets:"
echo ""
echo "1. JWT Secret (SECRETKEY):"
echo "   ${JWT_SECRET}"
echo ""
echo "2. Session Secret (SESSION_SECRET):"
echo "   ${SESSION_SECRET}"
echo ""
echo "3. Database Password (DB_PASS):"
echo "   ${DB_PASSWORD}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo ""
echo "1. Update your production.env file with these values:"
echo "   SECRETKEY=${JWT_SECRET}"
echo "   SESSION_SECRET=${SESSION_SECRET}"
echo "   DB_PASS=${DB_PASSWORD}"
echo ""
echo "2. Store these secrets in a secure password manager"
echo "3. Never commit these secrets to version control"
echo "4. Use different secrets for each environment (dev, staging, production)"
echo ""
echo -e "${YELLOW}⚠️  Security Reminder:${NC}"
echo "   - Each environment should have unique secrets"
echo "   - Rotate secrets periodically (every 90 days recommended)"
echo "   - Never share secrets via email or chat"
echo "   - Use environment variables or secret management tools in production"
echo ""

# Optionally save to a secure file (user must confirm)
read -p "Save secrets to .secrets file? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    SECRETS_FILE=".secrets.$(date +%Y%m%d_%H%M%S)"
    cat > "$SECRETS_FILE" << EOF
# Generated Secrets - $(date)
# ⚠️  SECURITY WARNING: This file contains sensitive secrets
# Store this file securely and delete it after copying values
# DO NOT commit this file to version control

SECRETKEY=${JWT_SECRET}
SESSION_SECRET=${SESSION_SECRET}
DB_PASS=${DB_PASSWORD}
EOF
    chmod 600 "$SECRETS_FILE"
    echo -e "${GREEN}✅ Secrets saved to: ${SECRETS_FILE}${NC}"
    echo -e "${YELLOW}⚠️  File permissions set to 600 (read/write owner only)${NC}"
    echo "   Remember to delete this file after copying values to your .env file"
fi

echo ""
echo -e "${GREEN}✨ Done!${NC}"
























