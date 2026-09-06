import axios from "axios";

const API_URL = "http://localhost:5000/api/study";

export const createStudy = async (studyData) => {
  const response = await axios.post(
    API_URL,
    studyData,
    { withCredentials: true }
  );

  return response.data;
};

export const getStudies = async () => {
  const response = await axios.get(
    API_URL,
    { withCredentials: true }
  );

  return response.data;
};

export const updateStudy = async (id, studyData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    studyData,
    { withCredentials: true }
  );

  return response.data;
};

export const deleteStudy = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    { withCredentials: true }
  );

  return response.data;
};