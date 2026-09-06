import express from "express";
import {
  getConversations,
  getConversation,
  deleteConversation,
} from "../controllers/conversationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getConversations);

router.get("/:id", protect, getConversation);

router.delete("/:id", protect, deleteConversation);

export default router;