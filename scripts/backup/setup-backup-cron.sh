#!/bin/bash

# Setup Automated Backup Cron Job
# Ministry of Health Uganda - Inventory Management System
#
# This script sets up a cron job to run database backups daily

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="${SCRIPT_DIR}/backup-database.sh"
CRON_SCHEDULE="${CRON_SCHEDULE:-0 2 * * *}"  # Default: 2 AM daily

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "${YELLOW}Setting up automated database backups...${NC}"

# Check if backup script exists
if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo "Error: Backup script not found: $BACKUP_SCRIPT"
    exit 1
fi

# Make backup script executable
chmod +x "$BACKUP_SCRIPT"

# Load environment variables from backend.env if it exists
ENV_FILE="${SCRIPT_DIR}/../../config/environments/backend.env"
if [ -f "$ENV_FILE" ]; then
    echo "Loading environment variables from $ENV_FILE"
    set -a
    source "$ENV_FILE"
    set +a
fi

# Create cron job entry
CRON_ENTRY="${CRON_SCHEDULE} ${BACKUP_SCRIPT} >> ${SCRIPT_DIR}/../../logs/backup-cron.log 2>&1"

# Check if cron job already exists
if crontab -l 2>/dev/null | grep -q "$BACKUP_SCRIPT"; then
    echo "${YELLOW}Cron job already exists. Updating...${NC}"
    # Remove existing entry
    crontab -l 2>/dev/null | grep -v "$BACKUP_SCRIPT" | crontab -
fi

# Add new cron job
(crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -

echo "${GREEN}✓ Automated backup cron job configured${NC}"
echo "Schedule: $CRON_SCHEDULE"
echo "Script: $BACKUP_SCRIPT"
echo ""
echo "To view cron jobs: crontab -l"
echo "To remove cron job: crontab -e"
echo ""
echo "Backup logs will be written to: ${SCRIPT_DIR}/../../logs/backup-cron.log"










