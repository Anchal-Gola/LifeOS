import express from "express";

import {
  savePushSubscription,
  getPushSubscriptions,
  removePushSubscription,
  getVapidPublicKey,
  sendTestPushNotification,
} from "../controllers/pushSubscriptionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, savePushSubscription);

router.get("/", protect, getPushSubscriptions);

router.get(
  "/public-key",
  protect,
  getVapidPublicKey
);

router.post(
  "/test",
  protect,
  sendTestPushNotification
);

router.delete(
  "/",
  protect,
  removePushSubscription
);

export default router;