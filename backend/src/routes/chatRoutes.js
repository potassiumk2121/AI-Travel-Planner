import express from "express";
import { askTravelAssistant } from "../controllers/chatController.js";
import { protect } from "../middlewares/auth.js";
import { aiLimiter } from "../middlewares/rateLimiters.js";
import { validate } from "../middlewares/validate.js";
import { chatSchema } from "../utils/validators.js";

export const chatRouter = express.Router();

chatRouter.use(protect);
chatRouter.post("/", aiLimiter, validate(chatSchema), askTravelAssistant);
