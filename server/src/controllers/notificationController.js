import {
  createNotificationService,
  getNotificationsService,
  markNotificationReadService,
  deleteNotificationService,
} from "../services/notificationService.js";

export const createNotification = async (req, res) => {
  try {
    const notification = await createNotificationService({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const notifications = await getNotificationsService(req.user.id);

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const markNotificationRead = async (req, res) => {
  try {
    const notification = await markNotificationReadService(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await deleteNotificationService(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};