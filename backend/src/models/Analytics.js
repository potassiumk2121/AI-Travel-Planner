import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ["signup", "login", "generate_itinerary", "save_itinerary", "favorite_destination", "email_itinerary", "chat_question"],
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true
    },
    destination: {
      type: String,
      trim: true,
      index: true
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ip: String,
    userAgent: String
  },
  { timestamps: true }
);

export const Analytics = mongoose.model("Analytics", analyticsSchema);
