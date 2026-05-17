import express from "express";
import { login, me, signup } from "../controllers/authController.js";
import { protect } from "../middlewares/auth.js";
import { authLimiter } from "../middlewares/rateLimiters.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, signupSchema } from "../utils/validators.js";

export const authRouter = express.Router();

authRouter.post("/signup", authLimiter, validate(signupSchema), signup);
authRouter.post("/login", authLimiter, validate(loginSchema), login);
authRouter.get("/me", protect, me);
