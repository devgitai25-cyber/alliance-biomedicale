# Production Maintenance Scripts

> **⚠️ These scripts are designed to run on the VPS only.**
> They must **never** be executed locally or in a CI pipeline without adaptation.

## Overview

| Script | Schedule | Purpose | Retention |
|---|---|---|---|
| `postgres_daily_backup.sh` | Daily at 2:00 AM | Logical database backup (pg_dump) | 14 days |
| `postgres_volume_weekly.sh` | Weekly (Sunday) at 3:00 AM | Raw volume archive | 30 days |
| `docker_cleanup_weekly.sh` | Weekly (Sunday) at 4:00 AM | Prune unused Docker resources | N/A |

---

## Manual VPS Setup Steps

### 1. Copy Scripts to VPS

From your **local machine**, run:

```bash
scp -r production/maintenance root@your_vps:/opt/
```

### 2. Set File Permissions

On the **VPS**, make scripts executable:

```bash
chmod +x /opt/maintenance/*.sh
```

### 3. Set Environment Variables

Add the following to `/etc/environment` or configure via systemd environment files:

```bash
POSTGRES_CONTAINER=your_container_name
POSTGRES_DB=your_db
POSTGRES_USER=postgres
POSTGRES_VOLUME=your_volume_name
```

> **🔐 Security Note:** Never hardcode these values in the scripts themselves.
> Use Dokploy's environment variable management or `/etc/environment` on the VPS.

### 4. Add Cron Jobs

Edit the crontab on the VPS:

```bash
crontab -e
```

Add the following entries:

```cron
# Daily PostgreSQL logical backup at 2:00 AM
0 2 * * * /opt/maintenance/postgres_daily_backup.sh

# Weekly PostgreSQL volume backup at 3:00 AM on Sundays
0 3 * * 0 /opt/maintenance/postgres_volume_weekly.sh

# Weekly Docker cleanup at 4:00 AM on Sundays
0 4 * * 0 /opt/maintenance/docker_cleanup_weekly.sh
```

### 5. Configure Docker Log Limits

Create or edit `/etc/docker/daemon.json` on the VPS:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

Then restart Docker:

```bash
sudo systemctl restart docker
```

> This limits each container's log files to **3 rotated files of 10 MB each** (30 MB max per container).

---

## Backup Locations (on VPS)

| Type | Path |
|---|---|
| Daily SQL backups | `/opt/prod_backup/postgres/` |
| Weekly volume archives | `/opt/prod_backup/postgres_volume/` |
| Docker cleanup logs | `/opt/prod_backup/docker_cleanup.log` |

---

## Security Rules

- ✅ All credentials are read from **environment variables only**
- ✅ Volume backups mount data as **read-only**
- ✅ Docker cleanup **never prunes volumes**
- ✅ No secrets are committed to the repository
- ✅ Backup directory (`/opt/prod_backup/`) is **outside the project folder**
- ✅ Scripts use `set -euo pipefail` for strict error handling

### What These Scripts Will **Never** Do

| ❌ Action | Reason |
|---|---|
| Hardcode container names | Names vary per deployment |
| Store passwords in scripts | Security risk |
| Expose backup paths via web | Data leak risk |
| Modify Docker volumes | Risk of data corruption |
| Stop production containers | Causes downtime |
| Remove images used by running containers | Breaks production |
| Execute VPS commands from CI | No SSH access assumed |

---

## Monitoring & Troubleshooting

### Check Backup Logs

```bash
# Daily backup log
tail -20 /opt/prod_backup/postgres/backup.log

# Volume backup log
tail -20 /opt/prod_backup/postgres_volume/backup.log

# Docker cleanup log
tail -20 /opt/prod_backup/docker_cleanup.log
```

### Verify Backup Integrity

```bash
# List recent SQL backups
ls -lah /opt/prod_backup/postgres/

# Test a SQL backup can be decompressed
gunzip -t /opt/prod_backup/postgres/db_YYYY-MM-DD_HH-MM-SS.sql.gz

# List recent volume backups
ls -lah /opt/prod_backup/postgres_volume/
```

### Restore from SQL Backup

```bash
gunzip -c /opt/prod_backup/postgres/db_YYYY-MM-DD_HH-MM-SS.sql.gz \
  | docker exec -i "$POSTGRES_CONTAINER" psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
```

> **⚠️ Caution:** This will overwrite the current database. Always test restoration on a staging environment first.

---

## Architecture Summary

```
VPS (/opt/)
├── maintenance/
│   ├── postgres_daily_backup.sh    # Logical backup (pg_dump)
│   ├── postgres_volume_weekly.sh   # Raw volume archive
│   ├── docker_cleanup_weekly.sh    # Resource cleanup
│   └── README.md                   # This file
│
└── prod_backup/
    ├── postgres/                   # SQL dumps (14-day retention)
    │   ├── db_2026-02-14_02-00-00.sql.gz
    │   └── backup.log
    ├── postgres_volume/            # Volume archives (30-day retention)
    │   ├── volume_2026-02-14.tar.gz
    │   └── backup.log
    └── docker_cleanup.log          # Cleanup log
```
