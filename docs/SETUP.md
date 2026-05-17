# Setup Guide

## Requirements

- Node.js 20 or newer
- MongoDB Atlas database
- Gemini API key
- Optional n8n webhook URL
- Optional Google Cloud service account for Sheets logging
- Optional SMTP credentials for email delivery

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Backend

```bash
cp backend/.env.example backend/.env
```

Set at minimum:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=long-random-secret
GEMINI_API_KEY=your-key
CLIENT_URL=http://localhost:5173
```

For Google Sheets logging, share the target sheet with the service account email and set:

```env
GOOGLE_SHEET_ID=
GOOGLE_SHEET_RANGE=Logs!A:H
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

For email:

```env
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
EMAIL_FROM="AI Travel Planner <no-reply@example.com>"
```

## 3. Configure Frontend

```bash
cp frontend/.env.example frontend/.env
```

For local development:

```env
VITE_API_URL=http://localhost:5000/api
```

## 4. Run Locally

Terminal 1:

```bash
npm run dev:backend
```

Terminal 2:

```bash
npm run dev:frontend
```

Open `http://localhost:5173`.

## 5. Make an Admin User

Create a regular user through signup, then update the user role in MongoDB Atlas:

```js
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Notes

- `ALLOW_AI_FALLBACK=false` keeps itinerary output strictly Gemini-backed. Set it to `true` only if you want deterministic local fallback itineraries when Gemini is unavailable.
- Rate limiting is enabled for general API, auth, and AI routes.
- Passwords are hashed with bcrypt before storage.
