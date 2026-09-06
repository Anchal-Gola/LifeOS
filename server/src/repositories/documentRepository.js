import Document from "../models/Document.js";

export const createDocument = async (documentData) => {
  return await Document.create(documentData);
};

export const getDocumentsByUser = async (userId) => {
  return await Document.find({ user: userId }).sort({ createdAt: -1 });
};
export const updateDocument = async (documentId, userId, data) => {
  return await Document.findOneAndUpdate(
    { _id: documentId, user: userId },
    data,
    { new: true }
  );
};

export const deleteDocument = async (documentId, userId) => {
  return await Document.findOneAndDelete({
    _id: documentId,
    user: userId,
  });
};