import {
  createNotificationService,
  getNotificationsService,
  markNotificationReadService,
  deleteNotificationService,
} from "../../services/notificationService.js";

export const createNotificationAction = async (userId, data) => {
  return await createNotificationService({
    user: userId,
    title: data.title,
    message: data.message,
    type: data.type || "system",
    isRead: data.isRead || false,
    link: data.link || "",
  });
};

export const getNotificationsAction = async (userId) => {
  return await getNotificationsService(userId);
};

export const markNotificationReadAction = async (userId, data) => {
  return await markNotificationReadService(
    data.id,
    userId
  );
};

export const deleteNotificationAction = async (userId, data) => {
  return await deleteNotificationService(
    data.id,
    userId
  );
};