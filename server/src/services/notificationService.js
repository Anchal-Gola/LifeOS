import {
  createNotificationRepository,
  getNotificationsRepository,
  markNotificationReadRepository,
  deleteNotificationRepository,
} from "../repositories/notificationRepository.js";

export const createNotificationService = async (notificationData) => {
  return await createNotificationRepository(notificationData);
};

export const getNotificationsService = async (userId) => {
  return await getNotificationsRepository(userId);
};

export const markNotificationReadService = async (id, userId) => {
  const notification = await markNotificationReadRepository(
    id,
    userId
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};

export const deleteNotificationService = async (id, userId) => {
  const notification = await deleteNotificationRepository(
    id,
    userId
  );

  if (!notification) {
    throw new Error("Notification not found");
  }

  return notification;
};