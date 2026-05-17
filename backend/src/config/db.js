import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  if (!env.mongoUri) {
    console.warn("MONGODB_URI is not set. API will start, but database routes will fail until configured.");
    return;
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongoUri, {
    autoIndex: env.nodeEnv !== "production"
  });

  console.log(`MongoDB connected: ${mongoose.connection.host}`);
};
