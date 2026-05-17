# Deployment Guide

## Backend on Render

1. Create a new Render Web Service.
2. Use the repository root as the source.
3. Set root directory to `backend`.
4. Build command:

```bash
npm install
```

5. Start command:

```bash
npm start
```

6. Add environment variables from `backend/.env.example`.
7. Set `CLIENT_URL` to your Vercel frontend URL.

Recommended production values:

```env
NODE_ENV=production
JWT_SECRET=<long-random-secret>
ALLOW_AI_FALLBACK=false
```

## Frontend on Vercel

1. Create a new Vercel project.
2. Set root directory to `frontend`.
3. Build command:

```bash
npm run build
```

4. Output directory:

```text
dist
```

5. Add:

```env
VITE_API_URL=https://your-render-api.onrender.com/api
```

The included `frontend/vercel.json` rewrites all routes to `index.html` for React Router.

## MongoDB Atlas

1. Create a cluster and database user.
2. Add Render's outbound IPs or use a restricted production allowlist.
3. Use the connection string as `MONGODB_URI`.

## Automation

### n8n

Set `N8N_WEBHOOK_URL`. Every signup, login, itinerary generation, save, favorite, email, and chat event is posted to that webhook.

### Google Sheets

Set `GOOGLE_SHEET_ID`, `GOOGLE_SHEET_RANGE`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY`. The backend appends analytics rows asynchronously so user-facing requests are not blocked by automation failures.

### Email

Set SMTP values. The `/itineraries/:id/email` endpoint sends an HTML itinerary email through Nodemailer.
