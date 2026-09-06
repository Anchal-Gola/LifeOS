import express from "express";
import {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal,
  completeGoalToday,
} from "../controllers/goalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createGoal);
router.get("/", protect, getGoals);
router.put("/:id", protect, updateGoal);
router.delete("/:id", protect, deleteGoal);
router.patch("/:id/complete", protect, completeGoalToday);

export default router;