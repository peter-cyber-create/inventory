#!/bin/bash

# Database Restore Script
# Ministry of Health Uganda - Inventory Management System
#
# This script restores the database from a backup file
# WARNING: This will overwrite existing data!

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/inventory}"
DB_NAME="${DB_NAME:-inventory_db}"
DB_USER="${DB_USER:-inventory_user}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "${RED}Usage: $0 <backup_file.sql.gz>${NC}"
    echo ""
    echo "Available backups:"
    ls -lh "$BACKUP_DIR"/inventory_backup_*.sql.gz 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}' || echo "  No backups found"
    exit 1
fi

BACKUP_FILE="$1"

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "${RED}Error: Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

# Check if PostgreSQL is available
if ! command -v psql &> /dev/null; then
    echo "${RED}Error: psql command not found. Please install PostgreSQL client tools.${NC}"
    exit 1
fi

# Confirm restoration
echo "${YELLOW}WARNING: This will overwrite all existing data in the database!${NC}"
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo "Backup file: $BACKUP_FILE"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled."
    exit 0
fi

# Check database connection
echo "${YELLOW}Checking database connection...${NC}"
export PGPASSWORD="${DB_PASS}"
if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
    echo "${RED}Error: Cannot connect to database. Please check your credentials.${NC}"
    exit 1
fi

# Restore database
echo "${YELLOW}Restoring database from backup...${NC}"

# Decompress and restore
if gunzip -c "$BACKUP_FILE" | psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME"; then
    echo "${GREEN}✓ Database restored successfully${NC}"
else
    echo "${RED}Error: Database restore failed${NC}"
    exit 1
fi

# Verify restoration
echo "${YELLOW}Verifying restoration...${NC}"
TABLE_COUNT=$(psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
echo "Tables in database: $TABLE_COUNT"

if [ "$TABLE_COUNT" -gt 0 ]; then
    echo "${GREEN}✓ Restoration verified${NC}"
else
    echo "${RED}Warning: No tables found after restoration${NC}"
fi

echo "${GREEN}Restore process completed${NC}"














