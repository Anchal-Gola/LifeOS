import {
  createDocument,
  getDocumentsByUser,
  updateDocument,
  deleteDocument,
} from "../repositories/documentRepository.js";

export const createDocumentService = async (documentData) => {
  return await createDocument(documentData);
};

export const getDocumentsService = async (userId) => {
  return await getDocumentsByUser(userId);
};
export const updateDocumentService = async (
  documentId,
  userId,
  data
) => {
  return await updateDocument(documentId, userId, data);
};

export const deleteDocumentService = async (documentId, userId) => {
  return await deleteDocument(documentId, userId);
};