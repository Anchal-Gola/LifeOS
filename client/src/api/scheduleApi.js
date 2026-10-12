import axios from "axios";

const API_URL = "https://lifeos-backend-o6vn.onrender.com/api/schedules";

export const createSchedule = async (scheduleData) => {
  const response = await axios.post(
    API_URL,
    scheduleData,
    { withCredentials: true }
  );

  return response.data;
};

export const getSchedules = async () => {
  const response = await axios.get(
    API_URL,
    { withCredentials: true }
  );

  return response.data;
};

export const getScheduleById = async (id) => {
  const response = await axios.get(
    `${API_URL}/${id}`,
    { withCredentials: true }
  );

  return response.data;
};

export const updateSchedule = async (
  id,
  scheduleData
) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    scheduleData,
    { withCredentials: true }
  );

  return response.data;
};

export const deleteSchedule = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    { withCredentials: true }
  );

  return response.data;
};