import axios from "axios";

const API_URL = "http://localhost:5000/api/documents";

export const createDocument = async (documentData) => {
  const response = await axios.post(API_URL, documentData, {
    withCredentials: true,
  });

  return response.data;
};

export const uploadDocument = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getDocuments = async () => {
  const response = await axios.get(API_URL, {
    withCredentials: true,
  });

  return response.data;
};

export const updateDocument = async (id, documentData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    documentData,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const updateUploadedDocument = async (id, formData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const deleteDocument = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });

  return response.data;
};