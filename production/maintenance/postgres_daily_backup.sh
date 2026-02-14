#!/bin/bash
set -euo pipefail

# =============================================================================
# Daily PostgreSQL Backup Script
# =============================================================================
# Purpose:  Creates a compressed logical backup of the PostgreSQL database
#           running inside a Docker container.
#
# Required Environment Variables:
#   POSTGRES_CONTAINER  - Name of the running PostgreSQL Docker container
#   POSTGRES_DB         - Name of the database to back up
#   POSTGRES_USER       - PostgreSQL user with read access to the database
#
# Retention: 14 days (older backups are automatically deleted)
#
# Usage:
#   export POSTGRES_CONTAINER=my_pg_container
#   export POSTGRES_DB=my_database
#   export POSTGRES_USER=postgres
#   ./postgres_daily_backup.sh
#
# Cron Example (runs daily at 2:00 AM):
#   0 2 * * * /opt/maintenance/postgres_daily_backup.sh
# =============================================================================

BACKUP_DIR="/opt/prod_backup/postgres"
LOG_FILE="/opt/prod_backup/postgres/backup.log"
DATE=$(date +%F_%H-%M-%S)

# --- Strict environment variable checks (fail-fast) -------------------------
: "${POSTGRES_CONTAINER:?ERROR: POSTGRES_CONTAINER environment variable is not set}"
: "${POSTGRES_DB:?ERROR: POSTGRES_DB environment variable is not set}"
: "${POSTGRES_USER:?ERROR: POSTGRES_USER environment variable is not set}"

# --- Ensure backup directory exists ------------------------------------------
mkdir -p "$BACKUP_DIR"

# --- Verify the target container is running ----------------------------------
if ! docker ps --format '{{.Names}}' | grep -q "^${POSTGRES_CONTAINER}$"; then
  echo "$(date) - ERROR: Container '${POSTGRES_CONTAINER}' is not running" >> "$LOG_FILE"
  exit 1
fi

# --- Perform the database dump -----------------------------------------------
if docker exec "$POSTGRES_CONTAINER" \
  pg_dump -U "$POSTGRES_USER" --no-owner --clean "$POSTGRES_DB" \
  | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"; then
  echo "$(date) - SUCCESS: db_$DATE.sql.gz created" >> "$LOG_FILE"
else
  echo "$(date) - ERROR: pg_dump failed for database '${POSTGRES_DB}'" >> "$LOG_FILE"
  exit 1
fi

# --- Prune backups older than 14 days ----------------------------------------
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +14 -delete
