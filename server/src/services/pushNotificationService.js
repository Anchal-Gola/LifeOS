import {
  getPushSubscriptionsByUser,
  deletePushSubscription,
} from "../repositories/pushSubscriptionRepository.js";

import {
  sendPushNotification,
} from "./pushService.js";

export const sendPushToUserService = async (
  userId,
  payload
) => {
  const subscriptions =
    await getPushSubscriptionsByUser(userId);

  if (subscriptions.length === 0) {
    return {
      sent: 0,
      failed: 0,
    };
  }

  let sent = 0;
  let failed = 0;

  for (const subscription of subscriptions) {
    const pushSubscription = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    };

    try {
      await sendPushNotification(
        pushSubscription,
        payload
      );

      sent += 1;
    } catch (error) {
      failed += 1;

      console.error(
        "Failed to send push to subscription:",
        error
      );

      // 410 means this subscription has expired
      // or the browser has unsubscribed it.
      if (error.statusCode === 410) {
        try {
          await deletePushSubscription(
            userId,
            subscription.endpoint
          );

          console.log(
            "🧹 Removed expired push subscription"
          );
        } catch (deleteError) {
          console.error(
            "Failed to remove expired subscription:",
            deleteError
          );
        }
      }
    }
  }

  return {
    sent,
    failed,
  };
};