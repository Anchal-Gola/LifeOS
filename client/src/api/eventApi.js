import axios from "axios";

const API_URL = "http://localhost:5000/api/events";

export const createEvent = async (eventData) => {
  const response = await axios.post(
    API_URL,
    eventData,
    { withCredentials: true }
  );

  return response.data;
};

export const getEvents = async () => {
  const response = await axios.get(
    API_URL,
    { withCredentials: true }
  );

  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    eventData,
    { withCredentials: true }
  );

  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    { withCredentials: true }
  );

  return response.data;
};