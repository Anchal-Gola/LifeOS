import {
  createOrUpdatePushSubscription,
  getPushSubscriptionsByUser,
  deletePushSubscription,
} from "../repositories/pushSubscriptionRepository.js";

export const savePushSubscriptionService = async (
  userId,
  subscription
) => {
  if (
    !subscription?.endpoint ||
    !subscription?.keys?.p256dh ||
    !subscription?.keys?.auth
  ) {
    throw new Error("Invalid push subscription");
  }

  return await createOrUpdatePushSubscription(
    userId,
    subscription
  );
};

export const getUserPushSubscriptionsService = async (
  userId
) => {
  return await getPushSubscriptionsByUser(userId);
};

export const removePushSubscriptionService = async (
  userId,
  endpoint
) => {
  return await deletePushSubscription(
    userId,
    endpoint
  );
};