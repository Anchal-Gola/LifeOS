import axios from "axios";

const API_URL = "http://localhost:5000/api/journals";

export const createJournal = async (journalData) => {
  const response = await axios.post(
    API_URL,
    journalData,
    { withCredentials: true }
  );

  return response.data;
};

export const getJournals = async () => {
  const response = await axios.get(
    API_URL,
    { withCredentials: true }
  );

  return response.data;
};

export const updateJournal = async (id, journalData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    journalData,
    { withCredentials: true }
  );

  return response.data;
};

export const deleteJournal = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    { withCredentials: true }
  );

  return response.data;
};