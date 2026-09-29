import axios from "axios";

const API_URL =
  "http://localhost:5000/api/presence";

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