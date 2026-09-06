import express from "express";
import { getLifeInsights } from "../controllers/intelligenceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getLifeInsights);

export default router;