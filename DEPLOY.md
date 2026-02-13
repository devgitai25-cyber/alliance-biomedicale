# 🚀 Deployment Guide — alliance-biomedicale.com

Deploy on Ubuntu 24.04 VPS (Hostinger) with Docker Compose.

## Prerequisites

SSH into your VPS and install Docker:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# Install Docker Compose (included with modern Docker)
docker compose version
```

Log out and back in for group changes to take effect.

## 1. Clone & Configure

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/bioeco.git
cd bioeco

# Create production env file
cp .env.production.example .env
nano .env
```

Fill in `.env` with real values:

```env
POSTGRES_USER=bioeco
POSTGRES_PASSWORD=<strong-random-password>
POSTGRES_DB=bioeco
JWT_SECRET=<random-64-char-string>
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

> **Important**: Update Google Cloud Console → OAuth → Authorized redirect URIs to:
> `https://alliance-biomedicale.com/api/auth/google/callback`

## 2. SSL Certificate (First Time)

Before starting with SSL, create a temporary Nginx config for the Certbot challenge:

```bash
# Create temp nginx config (HTTP only, for initial cert)
cat > nginx/default.conf.tmp << 'EOF'
server {
    listen 80;
    server_name alliance-biomedicale.com www.alliance-biomedicale.com;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 200 'OK'; }
}
EOF

# Temporarily use this config
cp nginx/default.conf nginx/default.conf.bak
cp nginx/default.conf.tmp nginx/default.conf

# Start just nginx
docker compose up -d nginx

# Get SSL certificate
docker compose run --rm certbot certonly \
  --webroot --webroot-path=/var/www/certbot \
  -d alliance-biomedicale.com -d www.alliance-biomedicale.com \
  --email your-email@example.com --agree-tos --no-eff-email

# Restore full config
cp nginx/default.conf.bak nginx/default.conf

# Stop nginx
docker compose down
```

## 3. Build & Start

```bash
# Build all images (first time takes ~5 min)
docker compose build

# Start all services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

## 4. Seed Database (First Time)

```bash
# Run Prisma migrations + seed
docker compose exec server npx prisma db seed
```

## 5. Verify

- Open `https://alliance-biomedicale.com` — frontend should load
- Open `https://alliance-biomedicale.com/api/settings/public` — API should respond
- Try Google login
- Upload a product image (admin panel) — should save to local storage

## Common Commands

```bash
# Restart after code changes
docker compose down
git pull
docker compose build
docker compose up -d

# View logs
docker compose logs -f server
docker compose logs -f client

# Database backup
docker compose exec db pg_dump -U bioeco bioeco > backup_$(date +%F).sql

# Restore database
cat backup.sql | docker compose exec -T db psql -U bioeco bioeco

# Renew SSL (auto via certbot container, or manually)
docker compose run --rm certbot renew
docker compose exec nginx nginx -s reload
```
