# 🔒 Security Audit Guide — alliance-biomedicale.com

> **Stack**: Next.js (client) + NestJS (server) + PostgreSQL, deployed via Dokploy on Hostinger VPS.
>
> Each command below indicates **where** to run it and **why**.

---

## Table of Contents

1. [VPS / OS Hardening](#1-vps--os-hardening)
2. [SSH Security](#2-ssh-security)
3. [Firewall (UFW)](#3-firewall-ufw)
4. [Docker Security](#4-docker-security)
5. [PostgreSQL Security](#5-postgresql-security)
6. [Application-Level Security (NestJS)](#6-application-level-security-nestjs)
7. [SSL / TLS](#7-ssl--tls)
8. [Secrets & Environment Variables](#8-secrets--environment-variables)
9. [File Upload Security](#9-file-upload-security)
10. [Dependency Vulnerabilities](#10-dependency-vulnerabilities)
11. [Monitoring & Logging](#11-monitoring--logging)
12. [Backup Verification](#12-backup-verification)
13. [External Scanning](#13-external-scanning)

---

## 1. VPS / OS Hardening

> 📍 **Run on**: VPS terminal (SSH into your Hostinger server)

### 1.1 — Check for OS updates

```bash
# Purpose: Ensure all packages are up to date (security patches)
sudo apt update && sudo apt list --upgradable
```

```bash
# Purpose: Apply all updates (do this during low-traffic hours)
sudo apt upgrade -y
```

### 1.2 — Enable automatic security updates

```bash
# Purpose: Auto-install critical security patches
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

Verify it's enabled:
```bash
cat /etc/apt/apt.conf.d/20auto-upgrades
```
Expected output should contain:
```
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
```

### 1.3 — Remove unnecessary packages

```bash
# Purpose: Reduce attack surface by listing installed packages
dpkg --get-selections | grep -v deinstall | wc -l
```

### 1.4 — Check for listening services

```bash
# Purpose: See all open ports and services — there should be ONLY what you need
sudo ss -tlnp
```

**Expected**: Only ports 22 (SSH), 80 (HTTP), 443 (HTTPS), and Dokploy's port (e.g., 3000) should be listening on public interfaces. PostgreSQL (5432) and app ports (3000, 3001) should only be on Docker internal networks.

### 1.5 — Check running processes

```bash
# Purpose: Identify any unexpected processes
ps aux --sort=-%mem | head -20
```

---

## 2. SSH Security

> 📍 **Run on**: VPS terminal

### 2.1 — Verify SSH configuration

```bash
# Purpose: Check SSH security settings
sudo grep -E "^(PermitRootLogin|PasswordAuthentication|PubkeyAuthentication|Port|MaxAuthTries|AllowUsers)" /etc/ssh/sshd_config
```

**Recommended settings** (edit with `sudo nano /etc/ssh/sshd_config`):
```
PermitRootLogin no              # ⚠️ CRITICAL: Disable root login
PasswordAuthentication no       # Use SSH keys only
PubkeyAuthentication yes        # Enable key-based auth
MaxAuthTries 3                  # Limit failed attempts
Port 2222                       # Change from default 22 (optional but recommended)
```

After changing, restart SSH:
```bash
# ⚠️ IMPORTANT: Keep your current session open and test with a new terminal first!
sudo systemctl restart sshd
```

### 2.2 — Check who can SSH in

```bash
# Purpose: List all users with shell access
cat /etc/passwd | grep -E '/bin/(bash|sh|zsh)' | cut -d: -f1
```

### 2.3 — Install Fail2Ban (brute-force protection)

```bash
# Purpose: Automatically ban IPs after failed login attempts
sudo apt install fail2ban -y
```

```bash
# Create a local config to survive updates
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

Add/modify these in `/etc/fail2ban/jail.local`:
```ini
[sshd]
enabled = true
port = ssh          # Change to 2222 if you changed SSH port
maxretry = 3
bantime = 3600      # Ban for 1 hour
findtime = 600      # Within 10 minutes
```

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

Check Fail2Ban status:
```bash
# Purpose: Verify Fail2Ban is working and see banned IPs
sudo fail2ban-client status sshd
```

### 2.4 — Check recent failed login attempts

```bash
# Purpose: See if anyone is trying to brute-force your server
sudo journalctl -u sshd --since "7 days ago" | grep "Failed" | tail -20
```

---

## 3. Firewall (UFW)

> 📍 **Run on**: VPS terminal

### 3.1 — Check if firewall is enabled

```bash
sudo ufw status verbose
```

### 3.2 — Set up UFW (if not configured)

```bash
# Purpose: Only allow necessary traffic
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (use your port if you changed it)
sudo ufw allow 22/tcp comment 'SSH'

# Allow HTTP/HTTPS (required for web traffic & Let's Encrypt)
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'

# If Dokploy dashboard runs on a specific port (e.g., 3000)
# Only allow from YOUR IP:
sudo ufw allow from YOUR_IP_ADDRESS to any port 3000 comment 'Dokploy Dashboard'

# Enable firewall
sudo ufw enable
```

### 3.3 — Verify firewall rules

```bash
sudo ufw status numbered
```

**⚠️ CRITICAL**: PostgreSQL port **5432 should NOT be open** to the public. It should only be accessible within Docker's internal network.

```bash
# Purpose: Verify PostgreSQL is NOT publicly accessible
sudo ss -tlnp | grep 5432
```

If you see `0.0.0.0:5432`, that's **BAD** — the database is exposed to the internet. It should show only `127.0.0.1:5432` or `172.x.x.x:5432` (Docker internal).

---

## 4. Docker Security

> 📍 **Run on**: VPS terminal

### 4.1 — Check Docker containers are running as non-root

```bash
# Purpose: Verify containers don't run as root internally
# Replace container names with your actual Dokploy container names

# List all running containers
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"
```

```bash
# Purpose: Check which user each container runs as (should NOT be root/UID 0)
docker ps -q | xargs -I {} docker exec {} whoami 2>/dev/null
```

For your specific containers:
```bash
# Check the NestJS backend container user
docker exec <backend-container-name> whoami
# Expected: "node" (as per your Dockerfile USER directive ✅)

# Check the Next.js frontend container user
docker exec <frontend-container-name> whoami
# Expected: "nextjs" (as per your Dockerfile USER directive ✅)
```

### 4.2 — Check Docker network isolation

```bash
# Purpose: Ensure containers use Docker's internal network, not host networking
docker network ls
```

```bash
# Purpose: Inspect a specific network to see connected containers
docker network inspect <network-name>
```

### 4.3 — Check container capabilities (should be minimal)

```bash
# Purpose: Ensure containers don't have unnecessary Linux capabilities
docker inspect --format='{{.HostConfig.CapAdd}}' <backend-container-name>
docker inspect --format='{{.HostConfig.Privileged}}' <backend-container-name>
```

**Expected**: `CapAdd` should be `[]` (empty) and `Privileged` should be `false`.

### 4.4 — Check for exposed ports on host

```bash
# Purpose: List all port mappings — only necessary ports should be mapped
docker ps --format "{{.Names}}: {{.Ports}}"
```

### 4.5 — Scan Docker images for vulnerabilities

```bash
# Purpose: Check your Docker images for known CVEs
# Install Trivy (container vulnerability scanner)
sudo apt install -y wget
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | sudo apt-key add -
echo "deb https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/trivy.list
sudo apt update && sudo apt install trivy -y
```

```bash
# Scan your backend image
trivy image <your-backend-image-name>

# Scan your frontend image
trivy image <your-frontend-image-name>
```

### 4.6 — Check Docker daemon configuration

```bash
# Purpose: Verify Docker daemon security settings
cat /etc/docker/daemon.json 2>/dev/null || echo "No custom daemon config found"
```

Recommended `/etc/docker/daemon.json`:
```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "no-new-privileges": true,
  "live-restore": true
}
```

```bash
# After modifying, restart Docker
sudo systemctl restart docker
```

---

## 5. PostgreSQL Security

> 📍 **Run on**: Inside the **PostgreSQL Docker container**

### 5.1 — Connect to PostgreSQL container

```bash
# From VPS terminal, find the PostgreSQL container name first
docker ps | grep postgres
```

```bash
# Enter the PostgreSQL container
docker exec -it <postgres-container-name> bash
```

### 5.2 — Check PostgreSQL users and privileges

```bash
# Purpose: Verify only necessary users exist with minimal privileges
# Run inside the postgres container:
psql -U bioeco -d bioeco -c "\du"
```

### 5.3 — Check connection settings

```bash
# Purpose: Ensure PostgreSQL only accepts local/Docker network connections
psql -U bioeco -d bioeco -c "SHOW listen_addresses;"
# Expected: "localhost" or "*" (but protected by Docker network isolation)
```

### 5.4 — Check SSL is enabled for DB connections (optional but recommended)

```bash
psql -U bioeco -d bioeco -c "SHOW ssl;"
```

### 5.5 — Check for unauthorized databases

```bash
psql -U bioeco -d bioeco -c "\l"
```

### 5.6 — Verify the DB is NOT directly accessible from the internet

> 📍 **Run on**: Your local machine (not the VPS)

```bash
# Purpose: Attempt to connect to PostgreSQL from outside — this should FAIL
# Replace YOUR_VPS_IP with your actual server IP
psql -h YOUR_VPS_IP -U bioeco -d bioeco -p 5432
# Expected: Connection refused or timeout = GOOD ✅
# If it connects = BAD ❌ (database is exposed!)
```

---

## 6. Application-Level Security (NestJS)

### 6.1 — SQL Injection Protection ✅

> Your app uses **Prisma ORM** which automatically parameterizes all queries. I verified there are **no raw SQL queries** (`$queryRaw` / `$executeRaw`) in your codebase. You're safe from SQL injection.

### 6.2 — Input Validation ✅

> Your `main.ts` has `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true`. This strips unknown properties and rejects unexpected input. Good.

### 6.3 — Security Headers (Helmet) ✅

> You're using `helmet` middleware. This sets important headers like `X-Content-Type-Options`, `X-Frame-Options`, etc.

Verify headers are being set:

> 📍 **Run on**: Your local machine or VPS terminal

```bash
# Purpose: Check security headers on your API
curl -I https://api.alliance-biomedicale.com/api/settings/public
```

**Expected headers** (from Helmet):
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN` (or DENY)
- `X-XSS-Protection: 0` (modern approach, relies on CSP)
- `Strict-Transport-Security: max-age=...` (HSTS)

### 6.4 — ⚠️ MISSING: Rate Limiting

> **Your app currently has NO rate limiting!** This is a significant vulnerability. Attackers can:
> - Brute-force login endpoints
> - Abuse the registration endpoint to create spam accounts
> - DDoS your API

**Fix** — Add `@nestjs/throttler` to your NestJS backend:

> 📍 **Run on**: Your local development machine (in `server/` directory)

```bash
npm install @nestjs/throttler
```

Then update `app.module.ts`:
```typescript
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,    // 60 seconds
      limit: 30,     // 30 requests per minute per IP
    }]),
    // ... other imports
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
```

For auth endpoints specifically, consider stricter limits (e.g., 5 login attempts per minute).

### 6.5 — CORS Configuration ✅

> Your CORS is properly configured with an allowlist. Verify it's working:

```bash
# Purpose: Test CORS — this should be rejected (origin not in allowlist)
curl -H "Origin: https://evil-site.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS \
  https://api.alliance-biomedicale.com/api/auth/login -v 2>&1 | grep -i "access-control"
```

### 6.6 — Check error messages in production

```bash
# Purpose: Verify that detailed error messages are NOT leaked in production
# This should return a generic error, NOT a stack trace
curl -X POST https://api.alliance-biomedicale.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test","password":"test"}'
```

**Expected**: Generic error message like "Invalid credentials" — NOT a stack trace or internal details.

### 6.7 — Verify JWT security

> 📍 **Run on**: Inside the **backend Docker container**

```bash
# Purpose: Verify JWT_SECRET is set and is strong (not a default value)
docker exec <backend-container-name> printenv JWT_SECRET
```

**Check**:
- ❌ BAD: `secret`, `changeme`, `your-secret-key`
- ✅ GOOD: A random 64+ character string

### 6.8 — Check body size limits ⚠️

> Your `main.ts` allows `50mb` request bodies. This is very large and could be abused for DoS.
> Consider reducing to `10mb` or lower unless you specifically need large payloads.

---

## 7. SSL / TLS

> 📍 **Run on**: Your local machine or VPS terminal

### 7.1 — Check SSL certificate validity

```bash
# Purpose: Verify SSL cert is valid and not expiring soon
echo | openssl s_client -connect alliance-biomedicale.com:443 -servername alliance-biomedicale.com 2>/dev/null | openssl x509 -noout -dates -subject
```

### 7.2 — Check SSL for the API subdomain too

```bash
echo | openssl s_client -connect api.alliance-biomedicale.com:443 -servername api.alliance-biomedicale.com 2>/dev/null | openssl x509 -noout -dates -subject
```

### 7.3 — Check TLS version (should be TLS 1.2+ only)

```bash
# Purpose: Ensure old/insecure TLS versions are disabled
# Test TLS 1.0 (should FAIL)
openssl s_client -connect alliance-biomedicale.com:443 -tls1 2>&1 | head -5

# Test TLS 1.1 (should FAIL)
openssl s_client -connect alliance-biomedicale.com:443 -tls1_1 2>&1 | head -5

# Test TLS 1.2 (should SUCCEED)
openssl s_client -connect alliance-biomedicale.com:443 -tls1_2 2>&1 | head -5

# Test TLS 1.3 (should SUCCEED)
openssl s_client -connect alliance-biomedicale.com:443 -tls1_3 2>&1 | head -5
```

### 7.4 — Quick online SSL test

Visit: https://www.ssllabs.com/ssltest/analyze.html?d=alliance-biomedicale.com

You want an **A** or **A+** rating.

---

## 8. Secrets & Environment Variables

> 📍 **Run on**: VPS terminal

### 8.1 — Check environment variables aren't in Docker images

```bash
# Purpose: Ensure secrets aren't baked into images (they should be injected at runtime)
docker inspect <backend-container-name> --format='{{range .Config.Env}}{{println .}}{{end}}' | grep -iE "(password|secret|key|token)"
```

Make sure these values come from **Dokploy environment variables**, not hardcoded in Dockerfiles.

### 8.2 — Check .env files are NOT in the Git repository

> 📍 **Run on**: Your local machine

```bash
# Purpose: Verify .env files are gitignored
cd d:\Desktop\bioeco
git ls-files | findstr ".env"
```

**Expected**: No `.env` files should appear (only `.env.example` is OK).

### 8.3 — Check Docker container environment

```bash
# Purpose: Verify DATABASE_URL doesn't use weak passwords
docker exec <backend-container-name> printenv DATABASE_URL
```

**Check the password in the URL** — it should be:
- ❌ BAD: `password`, `123456`, `admin`
- ✅ GOOD: A random 32+ character alphanumeric string

---

## 9. File Upload Security

> 📍 **Run on**: VPS terminal

### 9.1 — Check upload directory permissions

```bash
# Purpose: Verify the uploads directory has proper permissions
docker exec <backend-container-name> ls -la /app/uploads/
```

**Expected**: Owned by `node` user, not `root`. Permissions should be `755` or `750`.

### 9.2 — Check what files exist in uploads

```bash
# Purpose: Look for suspicious uploaded files
docker exec <backend-container-name> find /app/uploads -type f | head -20
```

### 9.3 — Test upload directory listing is disabled

```bash
# Purpose: Ensure directory listing is not enabled for /uploads
curl https://api.alliance-biomedicale.com/uploads/
# Expected: 403 Forbidden or 404, NOT a directory listing
```

---

## 10. Dependency Vulnerabilities

> 📍 **Run on**: Inside Docker containers OR on your local machine

### 10.1 — Audit server (NestJS) dependencies

```bash
# Run inside the backend container
docker exec <backend-container-name> npm audit --production
```

Or from your local machine:
```bash
cd d:\Desktop\bioeco\server
npm audit --production
```

### 10.2 — Audit client (Next.js) dependencies

```bash
docker exec <frontend-container-name> npm audit --production 2>/dev/null || echo "npm not available in production image"
```

Or from your local machine:
```bash
cd d:\Desktop\bioeco\client
npm audit --production
```

### 10.3 — Check for outdated packages

```bash
# From local machine
cd d:\Desktop\bioeco\server
npm outdated
```

---

## 11. Monitoring & Logging

> 📍 **Run on**: VPS terminal

### 11.1 — Check Docker logs for errors

```bash
# Purpose: Review recent backend logs for errors or suspicious activity
docker logs <backend-container-name> --tail 100 2>&1 | grep -iE "(error|warn|unauthorized|forbidden)"
```

```bash
# Purpose: Review recent frontend logs
docker logs <frontend-container-name> --tail 100 2>&1 | grep -iE "(error|warn)"
```

### 11.2 — Check system logs for intrusion attempts

```bash
# Purpose: Check for unauthorized access attempts
sudo journalctl --since "7 days ago" | grep -iE "(failed|invalid|unauthorized)" | tail -30
```

### 11.3 — Check disk usage

```bash
# Purpose: Prevent disk-full situations (can crash your app)
df -h
```

```bash
# Purpose: Check Docker disk usage specifically
docker system df
```

### 11.4 — Monitor resource usage

```bash
# Purpose: Check for abnormal CPU/memory usage (could indicate crypto mining malware)
top -bn1 | head -20
```

```bash
# Purpose: Check container resource usage
docker stats --no-stream
```

### 11.5 — Set up log rotation for Docker

```bash
# Purpose: Prevent Docker logs from filling up the disk
# Check current log sizes
sudo find /var/lib/docker/containers -name "*-json.log" -exec ls -lh {} \;
```

If log files are large, add log rotation (see Docker daemon.json in section 4.6).

---

## 12. Backup Verification

> 📍 **Run on**: VPS terminal

### 12.1 — Verify backups are being created

```bash
# Purpose: Check if daily backups exist
ls -la /opt/prod_backup/postgres/
```

### 12.2 — Test backup integrity

```bash
# Purpose: Verify a backup file can be decompressed (not corrupted)
LATEST_BACKUP=$(ls -t /opt/prod_backup/postgres/*.sql.gz 2>/dev/null | head -1)
if [ -n "$LATEST_BACKUP" ]; then
  gunzip -t "$LATEST_BACKUP" && echo "✅ Backup is valid" || echo "❌ Backup is corrupted"
else
  echo "❌ No backup files found!"
fi
```

### 12.3 — Check crontab for scheduled backups

```bash
# Purpose: Verify backup cron jobs are set up
sudo crontab -l 2>/dev/null
crontab -l 2>/dev/null
```

---

## 13. External Scanning

> 📍 **Run on**: Your local machine or any machine with internet access

### 13.1 — Nmap port scan (check what's exposed)

```bash
# Purpose: See what ports are visible from the internet
# Install nmap if needed: sudo apt install nmap (Linux) or choco install nmap (Windows)
nmap -sV YOUR_VPS_IP
```

**Expected open ports**: Only 22 (or custom SSH port), 80, 443. Everything else should be filtered/closed.

### 13.2 — Check HTTP security headers online

Visit: https://securityheaders.com/?q=alliance-biomedicale.com

You want an **A** or **A+** rating.

### 13.3 — Check for exposed sensitive paths

```bash
# Purpose: Ensure these common sensitive paths are NOT accessible
curl -s -o /dev/null -w "%{http_code}" https://api.alliance-biomedicale.com/.env
curl -s -o /dev/null -w "%{http_code}" https://api.alliance-biomedicale.com/.git/config
curl -s -o /dev/null -w "%{http_code}" https://alliance-biomedicale.com/.env
curl -s -o /dev/null -w "%{http_code}" https://alliance-biomedicale.com/.git/config
```

**Expected**: All should return `404` or `403`. If any returns `200`, that's a **critical vulnerability**.

---

## 🏆 Quick Summary Checklist

| # | Check | Priority | Status |
|---|-------|----------|--------|
| 1 | OS packages updated | 🔴 High | ⬜ |
| 2 | SSH: Root login disabled | 🔴 High | ⬜ |
| 3 | SSH: Key-based auth only | 🔴 High | ⬜ |
| 4 | Fail2Ban installed | 🟡 Medium | ⬜ |
| 5 | UFW firewall enabled | 🔴 High | ⬜ |
| 6 | PostgreSQL NOT publicly accessible | 🔴 Critical | ⬜ |
| 7 | Docker containers run as non-root | 🔴 High | ✅ (in Dockerfile) |
| 8 | No raw SQL queries (Prisma ORM) | 🔴 High | ✅ |
| 9 | Input validation (ValidationPipe) | 🔴 High | ✅ |
| 10 | Helmet security headers | 🟡 Medium | ✅ |
| 11 | Rate limiting (ThrottlerModule) | 🔴 High | ❌ MISSING |
| 12 | Strong JWT_SECRET | 🔴 High | ⬜ |
| 13 | Strong DB password | 🔴 High | ⬜ |
| 14 | SSL certificates valid | 🔴 High | ⬜ |
| 15 | TLS 1.2+ only | 🟡 Medium | ⬜ |
| 16 | .env not in Git | 🔴 High | ⬜ |
| 17 | npm audit clean | 🟡 Medium | ⬜ |
| 18 | Backups working | 🔴 High | ⬜ |
| 19 | Log rotation configured | 🟡 Medium | ⬜ |
| 20 | Body size limit reasonable | 🟡 Medium | ⚠️ (50mb is high) |
| 21 | Sensitive paths not exposed | 🔴 High | ⬜ |
| 22 | Docker image vulnerability scan | 🟡 Medium | ⬜ |

---

## 🚨 Immediate Action Items (Top Priority)

1. **Add Rate Limiting** — Install `@nestjs/throttler` (see section 6.4)
2. **Verify PostgreSQL is NOT publicly accessible** (section 5.6)
3. **Enable UFW firewall** if not already enabled (section 3)
4. **Disable SSH root login** and use key-based auth (section 2)
5. **Install Fail2Ban** for brute-force protection (section 2.3)
6. **Reduce body size limit** from 50mb to 10mb (section 6.8)

---

*Last updated: 2026-02-14*
