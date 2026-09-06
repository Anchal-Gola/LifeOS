import axios from "axios";

const API_URL = "http://localhost:5000/api/study-workspace";

export const createSubject = (subject) =>
  axios.post(
    API_URL,
    { subject },
    { withCredentials: true }
  );

export const getSubjects = () =>
  axios.get(API_URL, {
    withCredentials: true,
  });

export const getSubject = (id) =>
  axios.get(`${API_URL}/${id}`, {
    withCredentials: true,
  });

export const updateSubject = (id, data) =>
  axios.put(`${API_URL}/${id}`, data, {
    withCredentials: true,
  });

export const deleteSubject = (id) =>
  axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });

export const addTopic = (id, title) =>
  axios.post(
    `${API_URL}/${id}/topics`,
    { title },
    { withCredentials: true }
  );

export const toggleTopic = (id, topicId) =>
  axios.patch(
    `${API_URL}/${id}/topics/${topicId}`,
    {},
    { withCredentials: true }
  );