import axios from "axios";

const API_URL = "http://localhost:5000/api/habits";

export const createHabit = async (habitData) => {
  const response = await axios.post(
    API_URL,
    habitData,
    { withCredentials: true }
  );

  return response.data;
};

export const getHabits = async () => {
  const response = await axios.get(
    API_URL,
    { withCredentials: true }
  );

  return response.data;
};

export const updateHabit = async (id, habitData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    habitData,
    { withCredentials: true }
  );

  return response.data;
};

export const deleteHabit = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    { withCredentials: true }
  );

  return response.data;
};

export const completeHabit = async (id, date) => {
  const response = await axios.patch(
    `${API_URL}/${id}/complete`,
    { date },
    { withCredentials: true }
  );

  return response.data;
};