import express from "express";
import { getDashboard, updateProfile } from "../controllers/userController.js";
import { protect } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { updateProfileSchema } from "../utils/validators.js";

export const userRouter = express.Router();

userRouter.use(protect);
userRouter.get("/dashboard", getDashboard);
userRouter.patch("/profile", validate(updateProfileSchema), updateProfile);
