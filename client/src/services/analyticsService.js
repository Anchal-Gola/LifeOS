
import axios from "axios";

const API_URL = "https://lifeos-backend-o6vn.onrender.com/api/analytics";

export const getAnalytics = async () => {
  const response = await axios.get(API_URL, {
    withCredentials: true,
  });

  return response.data.data;
};