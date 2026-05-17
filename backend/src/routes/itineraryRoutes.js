import express from "express";
import {
  deleteTrip,
  emailTrip,
  favoriteTrip,
  generateTrip,
  getFavorites,
  getHistory,
  getSavedTrips,
  getTrip,
  saveTrip,
  unfavoriteTrip
} from "../controllers/itineraryController.js";
import { protect } from "../middlewares/auth.js";
import { aiLimiter } from "../middlewares/rateLimiters.js";
import { validate } from "../middlewares/validate.js";
import {
  emailItinerarySchema,
  mongoIdParamSchema,
  saveItinerarySchema,
  tripRequestSchema
} from "../utils/validators.js";

export const itineraryRouter = express.Router();

itineraryRouter.use(protect);
itineraryRouter.post("/generate", aiLimiter, validate(tripRequestSchema), generateTrip);
itineraryRouter.post("/save", validate(saveItinerarySchema), saveTrip);
itineraryRouter.get("/history", getHistory);
itineraryRouter.get("/saved", getSavedTrips);
itineraryRouter.get("/favorites", getFavorites);
itineraryRouter.get("/:id", validate(mongoIdParamSchema), getTrip);
itineraryRouter.delete("/:id", validate(mongoIdParamSchema), deleteTrip);
itineraryRouter.post("/:id/favorite", validate(mongoIdParamSchema), favoriteTrip);
itineraryRouter.delete("/:id/favorite", validate(mongoIdParamSchema), unfavoriteTrip);
itineraryRouter.post("/:id/email", validate(emailItinerarySchema), emailTrip);
