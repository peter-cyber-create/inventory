#!/bin/bash

# Automated Database Backup Script
# Ministry of Health Uganda - Inventory Management System
# 
# This script creates automated backups of the PostgreSQL database
# Backups are stored with date/time stamps and rotated automatically

set -e

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/inventory}"
DB_NAME="${DB_NAME:-inventory_db}"
DB_USER="${DB_USER:-inventory_user}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/inventory_backup_${TIMESTAMP}.sql"
BACKUP_FILE_COMPRESSED="${BACKUP_FILE}.gz"
LOG_FILE="${BACKUP_DIR}/backup.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling
error_exit() {
    log "${RED}ERROR: $1${NC}"
    exit 1
}

# Check if backup directory exists, create if not
if [ ! -d "$BACKUP_DIR" ]; then
    log "${YELLOW}Creating backup directory: $BACKUP_DIR${NC}"
    mkdir -p "$BACKUP_DIR" || error_exit "Failed to create backup directory"
    chmod 700 "$BACKUP_DIR" || error_exit "Failed to set backup directory permissions"
fi

# Check if PostgreSQL is available
if ! command -v pg_dump &> /dev/null; then
    error_exit "pg_dump command not found. Please install PostgreSQL client tools."
fi

# Check database connection
log "${YELLOW}Checking database connection...${NC}"
export PGPASSWORD="${DB_PASS}"
if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "SELECT 1;" > /dev/null 2>&1; then
    error_exit "Cannot connect to database. Please check your credentials."
fi

# Create backup
log "${YELLOW}Starting database backup...${NC}"
log "Database: $DB_NAME"
log "Host: $DB_HOST:$DB_PORT"
log "Backup file: $BACKUP_FILE_COMPRESSED"

# Perform backup with compression
if pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    --no-owner \
    --no-acl \
    --clean \
    --if-exists \
    --verbose 2>&1 | gzip > "$BACKUP_FILE_COMPRESSED"; then
    
    # Get backup size
    BACKUP_SIZE=$(du -h "$BACKUP_FILE_COMPRESSED" | cut -f1)
    log "${GREEN}✓ Backup completed successfully${NC}"
    log "Backup size: $BACKUP_SIZE"
    log "Backup file: $BACKUP_FILE_COMPRESSED"
    
    # Verify backup file exists and is not empty
    if [ ! -s "$BACKUP_FILE_COMPRESSED" ]; then
        error_exit "Backup file is empty or does not exist"
    fi
    
    # Verify backup integrity (test decompression)
    if ! gzip -t "$BACKUP_FILE_COMPRESSED" 2>/dev/null; then
        error_exit "Backup file is corrupted"
    fi
    
    log "${GREEN}✓ Backup integrity verified${NC}"
else
    error_exit "Backup failed"
fi

# Clean up old backups
log "${YELLOW}Cleaning up old backups (older than $RETENTION_DAYS days)...${NC}"
find "$BACKUP_DIR" -name "inventory_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
DELETED_COUNT=$(find "$BACKUP_DIR" -name "inventory_backup_*.sql.gz" -type f -mtime +$RETENTION_DAYS | wc -l)
if [ "$DELETED_COUNT" -gt 0 ]; then
    log "Deleted $DELETED_COUNT old backup(s)"
fi

# List current backups
log "${YELLOW}Current backups:${NC}"
ls -lh "$BACKUP_DIR"/inventory_backup_*.sql.gz 2>/dev/null | awk '{print "  " $9 " (" $5 ")"}' || log "  No backups found"

# Calculate total backup size
TOTAL_SIZE=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
log "Total backup storage: $TOTAL_SIZE"

# Success
log "${GREEN}✓ Backup process completed successfully${NC}"
exit 0





