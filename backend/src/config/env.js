import dotenv from "dotenv";

dotenv.config({ quiet: true });

const requiredInProduction = ["MONGODB_URI", "JWT_SECRET"];
const parseCsv = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

for (const key of requiredInProduction) {
  if (process.env.NODE_ENV === "production" && !process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  corsOrigins: parseCsv(process.env.CORS_ORIGINS || process.env.CLIENT_URL),
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "dev-only-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  geminiFallbackModels: parseCsv(
    process.env.GEMINI_FALLBACK_MODELS ||
      "gemini-2.5-flash-lite,gemini-3.1-flash-lite,gemini-3-flash-preview"
  ),
  allowAiFallback: process.env.ALLOW_AI_FALLBACK === "true",
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || "",
  googleSheetId: process.env.GOOGLE_SHEET_ID || "",
  googleSheetRange: process.env.GOOGLE_SHEET_RANGE || "Logs!A:H",
  googleServiceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
  googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY || "",
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.EMAIL_FROM || "AI Travel Planner <no-reply@example.com>"
  }
};
