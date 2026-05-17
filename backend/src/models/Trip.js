import mongoose from "mongoose";

const tripRequestSchema = new mongoose.Schema(
  {
    currentCity: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true, index: true },
    budget: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 1, max: 60 },
    people: { type: Number, required: true, min: 1, max: 50 },
    travelMode: { type: String, required: true, trim: true },
    interests: { type: [String], default: [] },
    hotelPreference: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    request: {
      type: tripRequestSchema,
      required: true
    },
    destinationNormalized: {
      type: String,
      index: true
    },
    itinerary: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    totalEstimatedCost: Number,
    isFavorite: {
      type: Boolean,
      default: false
    },
    savedAt: Date,
    emailedAt: Date,
    source: {
      type: String,
      enum: ["gemini-langchain", "fallback"],
      default: "gemini-langchain"
    }
  },
  { timestamps: true }
);

tripSchema.pre("save", function normalizeDestination(next) {
  this.destinationNormalized = this.request.destination.trim().toLowerCase();
  next();
});

export const Trip = mongoose.model("Trip", tripSchema);
