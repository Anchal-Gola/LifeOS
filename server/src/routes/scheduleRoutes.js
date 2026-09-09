import express from "express";

import {
  createSchedule,
  getSchedules,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
} from "../controllers/scheduleController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createSchedule);

router.get("/", protect, getSchedules);

router.get("/:id", protect, getScheduleById);

router.put("/:id", protect, updateSchedule);

router.delete("/:id", protect, deleteSchedule);

export default router;