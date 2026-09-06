import express from "express";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProfile);
router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);

export default router;