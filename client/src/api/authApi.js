import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const loginUser = async (email, password) => {
  const response = await axios.post(
    `${API_URL}/login`,
    { email, password },
    { withCredentials: true }
  );

  return response.data;
};

export const signupUser = async (name, email, password) => {
  const response = await axios.post(
    `${API_URL}/signup`,
    { name, email, password },
    { withCredentials: true }
  );

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get(
    `${API_URL}/me`,
    { withCredentials: true }
  );

  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post(
    `${API_URL}/logout`,
    {},
    { withCredentials: true }
  );

  return response.data;
};