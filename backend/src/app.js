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

const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",

  "https://ai-travel-planner-frontend-pi.vercel.app",
  "https://ai-travel-planner-771jir6j7.vercel.app",
];

if (env.clientUrl) {
  env.clientUrl
    .split(",")
    .map((origin) => origin.trim())
    .forEach((origin) => {
      if (origin && !allowedOrigins.includes(origin)) {
        allowedOrigins.push(origin);
      }
    });
}

app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },

    credentials: true,
  })
);

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
