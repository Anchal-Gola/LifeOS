import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

export const createNotification = async (notificationData) => {
  const response = await axios.post(
    API_URL,
    notificationData,
    { withCredentials: true }
  );

  return response.data;
};

export const getNotifications = async () => {
  const response = await axios.get(
    API_URL,
    { withCredentials: true }
  );

  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await axios.patch(
    `${API_URL}/${id}/read`,
    {},
    { withCredentials: true }
  );

  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    { withCredentials: true }
  );

  return response.data;
};