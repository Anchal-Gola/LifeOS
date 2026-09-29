import PushSubscription from "../models/PushSubscription.js";

export const createOrUpdatePushSubscription = async (
  userId,
  subscription
) => {
  return await PushSubscription.findOneAndUpdate(
    {
      user: userId,
      endpoint: subscription.endpoint,
    },
    {
      user: userId,
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    },
    {
      new: true,
      upsert: true,
    }
  );
};

export const getPushSubscriptionsByUser = async (userId) => {
  return await PushSubscription.find({
    user: userId,
  });
};

export const deletePushSubscription = async (
  userId,
  endpoint
) => {
  return await PushSubscription.findOneAndDelete({
    user: userId,
    endpoint,
  });
};