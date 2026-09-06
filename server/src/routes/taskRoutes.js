import express from "express";

import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTask);

router.get("/", protect, getTasks);

router.get("/:id", protect, getTask);

router.put("/:id", protect, updateTask);

router.delete("/:id", protect, deleteTask);

export default router;