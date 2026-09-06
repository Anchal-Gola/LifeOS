import express from "express";

import {
  createNotification,
  getNotifications,
  markNotificationRead,
  deleteNotification,
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createNotification);

router.get("/", protect, getNotifications);

router.patch("/:id/read", protect, markNotificationRead);

router.delete("/:id", protect, deleteNotification);

export default router;