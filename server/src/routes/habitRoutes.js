import express from "express";
import {
  createHabit,
  getHabits,
  updateHabit,
  deleteHabit,
  completeHabit,
} from "../controllers/habitController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createHabit);
router.get("/", protect, getHabits);
router.put("/:id", protect, updateHabit);
router.delete("/:id", protect, deleteHabit);
router.patch("/:id/complete", protect, completeHabit);

export default router;