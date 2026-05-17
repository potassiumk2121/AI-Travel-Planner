import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";

import { adminRouter } from "./routes/adminRoutes.js";
import { authRouter } from "./routes/authRoutes.js";
import { chatRouter } from "./routes/chatRoutes.js";
import { itineraryRouter } from "./routes/itineraryRoutes.js";
import { userRouter } from "./routes/userRoutes.js";

import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import { apiLimiter } from "./middlewares/rateLimiters.js";

export const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

/*
========================
CORS CONFIGURATION
========================
*/

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "https://ai-travel-planner-frontend.vercel.app",
  "https://ai-travel-planner-frontend-pi.vercel.app",
  "https://ai-travel-planner-frontend-771jir6j7.vercel.app",
  "https://ai-travel-planner-771jir6j7.vercel.app",
  ...env.corsOrigins,
]);

const vercelPreviewPatterns = [
  /^https:\/\/ai-travel-planner-frontend(?:-[a-z0-9-]+)?\.vercel\.app$/i,
  /^https:\/\/ai-travel-planner(?:-[a-z0-9-]+)?\.vercel\.app$/i,
];

const isAllowedOrigin = (origin) =>
  allowedOrigins.has("*") ||
  allowedOrigins.has(origin) ||
  vercelPreviewPatterns.some((pattern) => pattern.test(origin));

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests such as curl, Postman, and health checks.
    if (!origin) {
      return callback(null, true);
    }

    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked for origin: ${origin}`);
    return callback(null, false);
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(
  cors(corsOptions)
);
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(apiLimiter);

if (env.nodeEnv !== "test") {
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
}

app.get("/", (_req, res) => {
  res.json({
    success: true,
    name: "AI Travel Planner API",
    status: "online",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/itineraries", itineraryRouter);
app.use("/api/chat", chatRouter);
app.use("/api/admin", adminRouter);

app.use(notFound);
app.use(errorHandler);
