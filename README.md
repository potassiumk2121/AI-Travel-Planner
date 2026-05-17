# AI Travel Planner

Full-stack AI travel planning app built with React, Vite, Tailwind CSS, Framer Motion, ShadCN-style UI primitives, Express, MongoDB Atlas, JWT auth, Gemini, LangChain, n8n, Google Sheets logging, and Nodemailer.

## Features

- Signup, login, persistent JWT sessions, protected routes, and admin-only routes.
- AI itinerary generation with Gemini through LangChain.
- Day-wise itinerary, attractions, estimated costs, food recommendations, packing tips, weather advice, and safety guidance.
- Dashboard with profile, generated trips, saved itineraries, favorite destinations, and trip history.
- Voice input through the Web Speech API.
- PDF itinerary export.
- Email itinerary delivery through Nodemailer.
- AI travel chat assistant.
- Admin panel for total users, generated itineraries, saved itineraries, and most searched destinations.
- MongoDB schemas for User, Trip, Saved Itinerary, and Analytics.
- n8n webhook and Google Sheets automation logging.
- Deployment-ready structure for Vercel frontend and Render backend.

## Project Structure

```text
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   └── utils
│   └── .env.example
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── lib
│   │   └── pages
│   ├── vercel.json
│   └── .env.example
└── docs
```

## Quick Start

```bash
npm install
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
npm run dev:backend
npm run dev:frontend
```

Frontend runs at `http://localhost:5173`. Backend runs at `http://localhost:5000`.

The backend can run without `GEMINI_API_KEY` when `ALLOW_AI_FALLBACK=true`, but production should use a real Gemini API key.

## Useful Scripts

```bash
npm run dev:frontend
npm run dev:backend
npm run build
npm run start
```

## Documentation

- [API documentation](docs/API.md)
- [Setup guide](docs/SETUP.md)
- [Deployment guide](docs/DEPLOYMENT.md)
