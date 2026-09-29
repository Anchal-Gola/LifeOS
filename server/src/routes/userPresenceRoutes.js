import express from "express";

import {
  updateUserPresence,
} from "../controllers/userPresenceController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/heartbeat",
  protect,
  updateUserPresence
);

export default router;