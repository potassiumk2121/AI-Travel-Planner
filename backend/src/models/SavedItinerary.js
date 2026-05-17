import mongoose from "mongoose";

const savedItinerarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 140
    },
    destination: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    itinerarySnapshot: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    notes: {
      type: String,
      default: "",
      maxlength: 2000
    },
    tags: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

savedItinerarySchema.index({ user: 1, trip: 1 }, { unique: true });

export const SavedItinerary = mongoose.model("SavedItinerary", savedItinerarySchema);
