import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { authorize, protect } from "../middlewares/auth.js";

export const adminRouter = express.Router();

adminRouter.use(protect, authorize("admin"));
adminRouter.get("/stats", getAdminStats);
