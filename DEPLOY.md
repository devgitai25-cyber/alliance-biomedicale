# 🚀 Dokploy Deployment Guide — alliance-biomedicale.com

Deploy as 3 independent applications on Dokploy.

---

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│  PostgreSQL   │
│  (Next.js)   │     │  (NestJS)    │     │   Database    │
│  Port 3000   │     │  Port 3001   │     │  Port 5432    │
└──────────────┘     └──────────────┘     └──────────────┘
```

Dokploy handles: routing, SSL (Let's Encrypt), and internal networking.

---

## Step 1: Create PostgreSQL Database

In Dokploy dashboard:
1. **Create → Database → PostgreSQL**
2. Image: `postgres:16-alpine`
3. Set environment variables:
   - `POSTGRES_USER` = `bioeco`
   - `POSTGRES_PASSWORD` = `<strong-random-password>`
   - `POSTGRES_DB` = `bioeco`
4. Enable **persistent storage**
5. Note the **internal hostname** (e.g., `postgres-xxxx`)

---

## Step 2: Deploy Backend (NestJS)

1. **Create → Application**
2. Source: **Git** → your repository URL
3. Build Type: **Dockerfile**
4. **Build Path (context)**: `./server`
5. **Dockerfile Path**: `./server/Dockerfile`
6. Set environment variables:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `postgresql://bioeco:<password>@<postgres-hostname>:5432/bioeco?schema=public` |
| `JWT_SECRET` | `<random-64-char-string>` |
| `JWT_EXPIRES_IN` | `7d` |
| `APP_PORT` | `3001` |
| `NODE_ENV` | `production` |
| `CORS_ORIGINS` | `https://alliance-biomedicale.com` |
| `FRONTEND_URL` | `https://alliance-biomedicale.com` |
| `GOOGLE_CLIENT_ID` | `<from-google-console>` |
| `GOOGLE_CLIENT_SECRET` | `<from-google-console>` |
| `GOOGLE_CALLBACK_URL` | `https://alliance-biomedicale.com/api/auth/google/callback` |

7. Set port to **3001**
8. Assign domain (e.g., `api.alliance-biomedicale.com` or use Dokploy's internal routing)
9. Deploy

---

## Step 3: Deploy Frontend (Next.js)

1. **Create → Application**
2. Source: **Git** → your repository URL
3. Build Type: **Dockerfile**
4. **Build Path (context)**: `./client`
5. **Dockerfile Path**: `./client/Dockerfile`
6. Set **build argument**:

| Build Arg | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://api.alliance-biomedicale.com/api` (or wherever backend is deployed) |

7. Set port to **3000**
8. Assign domain: `alliance-biomedicale.com`
9. Enable SSL (Let's Encrypt) — Dokploy handles this automatically
10. Deploy

---

## Step 4: Seed Database (First Time)

In the backend application terminal (Dokploy console):
```bash
npx prisma db seed
```

---

## Step 5: Google OAuth Setup

In Google Cloud Console → APIs & Services → Credentials:
- **Authorized redirect URI**: `https://alliance-biomedicale.com/api/auth/google/callback`
- **Authorized JavaScript origin**: `https://alliance-biomedicale.com`

---

## Verify

- `https://alliance-biomedicale.com` → Frontend loads
- `https://api.alliance-biomedicale.com/api/settings/public` → API responds
- Google login works
- Product image upload works (saved to local `/app/uploads/`)

---

## Updates

To redeploy after code changes:
1. `git push` to your repository
2. In Dokploy, click **Redeploy** on the affected application(s)
