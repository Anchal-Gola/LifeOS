import express from "express";
import {
  createSettings,
  getSettings,
  updateSettings,
} from "../controllers/settingsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createSettings);
router.get("/", protect, getSettings);
router.put("/", protect, updateSettings);

export default router;