# Alliance Biomédicale — Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git (for version control)

## Initial Setup

### 1. Database Setup

**Option A: Supabase (Recommended)**
1. Go to https://supabase.com
2. Create new project
3. Copy PostgreSQL connection string
4. Add to `server/.env` as `DATABASE_URL`

**Option B: Railway**
1. Go to https://railway.app
2. Create new PostgreSQL database
3. Copy connection string
4. Add to `server/.env`

**Option C: Local PostgreSQL**
```bash
createdb bioeco
# Then use: postgresql://localhost:5432/bioeco
```

### 2. Backend Configuration

```bash
cd server

# Copy environment template
cp .env.example .env

# Edit .env and add:
# - DATABASE_URL (from step 1)
# - JWT_SECRET (random string)
```

### 3. Run Database Migration

```bash
cd server
npx prisma migrate dev --name init
npx prisma generate
```

### 4. Install Backend Dependencies (if not done)

```bash
cd server
npm install
```

### 5. Install Frontend Dependencies (if not done)

```bash
cd client
npm install
```

### 6. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run start:dev

# Should see: 🚀 Server running on http://localhost:3001/api
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev

# Should see: Ready on http://localhost:3000
```

### 7. Test the Setup

1. Open browser: http://localhost:3000
2. Should redirect to http://localhost:3000/fr
3. Test API: http://localhost:3001/api/products
4. Test different locales:
   - http://localhost:3000/en
   - http://localhost:3000/ar (RTL layout)

## Create Admin User

Use Prisma Studio to manually set `isAdmin = true`:

```bash
cd server
npx prisma studio

# Opens GUI at http://localhost:5555
# Find your user and set isAdmin to true
```

## Testing API Endpoints

### Register User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bioeco.com","password":"admin123","firstName":"Admin"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bioeco.com","password":"admin123"}'
```

Copy the `accessToken` from response for admin operations.

## Next Steps
- Continue building UI components (see walkthrough.md)
- Add sample products via Prisma Studio
- Build product listing pages
- Implement shopping cart
- Create admin dashboard

## Troubleshooting

**Port Already in Use:**
```bash
# Change port in server/.env
APP_PORT=3002

# Or kill process on port 3001
```

**Prisma Errors:**
```bash
cd server
npx prisma generate
npx prisma migrate reset  # Resets database
```

**Frontend Build Errors:**
```bash
cd client
rm -rf .next node_modules
npm install
npm run dev
```

## Useful Commands

```bash
# View database
cd server && npx prisma studio

# Reset database
cd server && npx prisma migrate reset

# Generate Prisma client
cd server && npx prisma generate

# View frontend routes
cd client && npm run build
```

## Documentation

- [Walkthrough](./walkthrough.md) - Complete implementation overview
- [Implementation Plan](./implementation_plan.md) - Original architecture plan
- [Task Checklist](./task.md) - Development progress tracker
- [PROGRESS.md](../PROGRESS.md) - Quick progress summary
