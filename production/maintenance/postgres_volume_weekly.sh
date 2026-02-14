#!/bin/bash
set -euo pipefail

# =============================================================================
# Weekly PostgreSQL Volume Backup Script
# =============================================================================
# Purpose:  Creates a compressed tar archive of the raw PostgreSQL Docker
#           volume data for disaster recovery.
#
# Required Environment Variables:
#   POSTGRES_VOLUME  - Name of the Docker volume used by PostgreSQL
#
# Security:
#   - Volume is mounted read-only (:ro) to prevent accidental writes
#   - No database credentials required
#   - No container restart needed
#
# Retention: 30 days (older archives are automatically deleted)
#
# Usage:
#   export POSTGRES_VOLUME=my_pg_volume
#   ./postgres_volume_weekly.sh
#
# Cron Example (runs every Sunday at 3:00 AM):
#   0 3 * * 0 /opt/maintenance/postgres_volume_weekly.sh
# =============================================================================

BACKUP_DIR="/opt/prod_backup/postgres_volume"
LOG_FILE="/opt/prod_backup/postgres_volume/backup.log"
DATE=$(date +%F)

# --- Strict environment variable checks (fail-fast) -------------------------
: "${POSTGRES_VOLUME:?ERROR: POSTGRES_VOLUME environment variable is not set}"

# --- Ensure backup directory exists ------------------------------------------
mkdir -p "$BACKUP_DIR"

# --- Create compressed volume archive (read-only mount) ----------------------
if docker run --rm \
  -v "$POSTGRES_VOLUME":/data:ro \
  -v "$BACKUP_DIR":/backup \
  alpine \
  tar czf "/backup/volume_$DATE.tar.gz" /data; then
  echo "$(date) - SUCCESS: volume_$DATE.tar.gz created" >> "$LOG_FILE"
else
  echo "$(date) - ERROR: Volume backup failed for '${POSTGRES_VOLUME}'" >> "$LOG_FILE"
  exit 1
fi

# --- Prune backups older than 30 days ----------------------------------------
find "$BACKUP_DIR" -type f -name "*.tar.gz" -mtime +30 -delete
