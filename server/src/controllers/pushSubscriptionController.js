import {
  savePushSubscriptionService,
  getUserPushSubscriptionsService,
  removePushSubscriptionService,
} from "../services/pushSubscriptionService.js";

import {
  sendPushToUserService,
} from "../services/pushNotificationService.js";

export const savePushSubscription = async (
  req,
  res
) => {
  try {
    const subscription =
      await savePushSubscriptionService(
        req.user.id,
        req.body
      );

    res.status(201).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPushSubscriptions = async (
  req,
  res
) => {
  try {
    const subscriptions =
      await getUserPushSubscriptionsService(
        req.user.id
      );

    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const removePushSubscription = async (
  req,
  res
) => {
  try {
    await removePushSubscriptionService(
      req.user.id,
      req.body.endpoint
    );

    res.status(200).json({
      success: true,
      message: "Push subscription removed",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getVapidPublicKey = async (
  req,
  res
) => {
  try {
    if (!process.env.VAPID_PUBLIC_KEY) {
      throw new Error(
        "VAPID public key is not configured"
      );
    }

    res.status(200).json({
      success: true,
      data: {
        publicKey:
          process.env.VAPID_PUBLIC_KEY,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const sendTestPushNotification = async (
  req,
  res
) => {
  try {
    const result =
      await sendPushToUserService(
        req.user.id,
        {
          title: "LifeOS Test",
          message:
            "Your offline push notification is working!",
          link: "/notifications",
        }
      );

    res.status(200).json({
      success: true,
      message: "Test push sent",
      data: result,
    });
  } catch (error) {
    console.error(
      "Test push error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};