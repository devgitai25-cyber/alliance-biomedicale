#!/bin/bash
set -euo pipefail

# =============================================================================
# Weekly Docker Cleanup Script
# =============================================================================
# Purpose:  Reclaims disk space by pruning unused Docker resources.
#           Safely removes build cache, dangling images, stopped containers,
#           and unused networks.
#
# ⚠️  IMPORTANT: This script does NOT prune Docker volumes.
#     Volume data (including PostgreSQL) is intentionally preserved.
#
# Security:
#   - Does not remove images used by running containers
#   - Does not stop or restart any containers
#   - Does not touch Docker volumes
#
# Usage:
#   ./docker_cleanup_weekly.sh
#
# Cron Example (runs every Sunday at 4:00 AM):
#   0 4 * * 0 /opt/maintenance/docker_cleanup_weekly.sh
# =============================================================================

LOG_FILE="/opt/prod_backup/docker_cleanup.log"

# --- Ensure log directory exists ---------------------------------------------
mkdir -p "$(dirname "$LOG_FILE")"

echo "$(date) - Docker cleanup started" >> "$LOG_FILE"

# --- Prune build cache -------------------------------------------------------
echo "$(date) - Pruning build cache..." >> "$LOG_FILE"
docker builder prune -a -f >> "$LOG_FILE" 2>&1

# --- Prune unused images -----------------------------------------------------
echo "$(date) - Pruning unused images..." >> "$LOG_FILE"
docker image prune -a -f >> "$LOG_FILE" 2>&1

# --- Prune stopped containers ------------------------------------------------
echo "$(date) - Pruning stopped containers..." >> "$LOG_FILE"
docker container prune -f >> "$LOG_FILE" 2>&1

# --- Prune unused networks ---------------------------------------------------
echo "$(date) - Pruning unused networks..." >> "$LOG_FILE"
docker network prune -f >> "$LOG_FILE" 2>&1

# 🚫 docker volume prune is intentionally excluded to protect persistent data

echo "$(date) - Docker cleanup finished" >> "$LOG_FILE"
