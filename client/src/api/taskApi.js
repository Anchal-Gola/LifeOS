import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

export const createTask = async (taskData) => {
  const response = await axios.post(
    API_URL,
    taskData,
    { withCredentials: true }
  );

  return response.data;
};

export const getTasks = async () => {
  const response = await axios.get(
    API_URL,
    { withCredentials: true }
  );

  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    taskData,
    { withCredentials: true }
  );

  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    { withCredentials: true }
  );

  return response.data;
};