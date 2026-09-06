import axios from "axios";

const API_URL = "http://localhost:5000/api/goals";

export const createGoal = async (goalData) => {
  const response = await axios.post(
    API_URL,
    goalData,
    { withCredentials: true }
  );

  return response.data;
};

export const getGoals = async () => {
  const response = await axios.get(
    API_URL,
    { withCredentials: true }
  );

  return response.data;
};

export const updateGoal = async (id, goalData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    goalData,
    { withCredentials: true }
  );

  return response.data;
};

export const deleteGoal = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    { withCredentials: true }
  );

  return response.data;
};

export const completeGoalToday = async (id, date) => {
  const response = await axios.patch(
    `${API_URL}/${id}/complete`,
    { date },
    { withCredentials: true }
  );

  return response.data;
};