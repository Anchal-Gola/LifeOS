import axios from "axios";

const API_URL =
  "https://lifeos-backend-o6vn.onrender.com/api/presence";

export const sendPresenceHeartbeat = async () => {
  const response = await axios.post(
    `${API_URL}/heartbeat`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};