import axios from "axios";

const API_URL =
  "http://localhost:5000/api/push-subscriptions";

export const getVapidPublicKey = async () => {
  const response = await axios.get(
    `${API_URL}/public-key`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const savePushSubscription = async (
  subscription
) => {
  const response = await axios.post(
    API_URL,
    subscription,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const getPushSubscriptions = async () => {
  const response = await axios.get(API_URL, {
    withCredentials: true,
  });

  return response.data;
};

export const removePushSubscription = async (
  endpoint
) => {
  const response = await axios.delete(API_URL, {
    withCredentials: true,
    data: {
      endpoint,
    },
  });

  return response.data;
};
export const sendTestPushNotification = async () => {
  const response = await axios.post(
    `${API_URL}/test`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};