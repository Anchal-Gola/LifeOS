import Notification from "../models/Notification.js";

export const createNotificationRepository = async (notificationData) => {
  return await Notification.create(notificationData);
};

export const getNotificationsRepository = async (userId) => {
  return await Notification.find({ user: userId }).sort({
    createdAt: -1,
  });
};

export const markNotificationReadRepository = async (
  id,
  userId
) => {
  return await Notification.findOneAndUpdate(
    {
      _id: id,
      user: userId,
    },
    {
      isRead: true,
    },
    {
      new: true,
    }
  );
};

export const deleteNotificationRepository = async (
  id,
  userId
) => {
  return await Notification.findOneAndDelete({
    _id: id,
    user: userId,
  });
};