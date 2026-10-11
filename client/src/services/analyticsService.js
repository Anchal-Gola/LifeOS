
import axios from "axios";

const API_URL = "http://localhost:5000/api/analytics";

export const getAnalytics = async () => {
  const response = await axios.get(API_URL, {
    withCredentials: true,
  });

  return response.data.data;
};