import {
  createDocumentService,
  getDocumentsService,
  updateDocumentService,
  deleteDocumentService,
} from "../../services/documentService.js";

export const createDocumentAction = async (userId, data) => {
  return await createDocumentService({
    user: userId,
    name: data.name,
    fileUrl: data.fileUrl || "",
    fileName: data.fileName || "",
    fileType: data.fileType || "",
    sourceType: data.sourceType || "url",
    category: data.category || "general",
  });
};

export const getDocumentsAction = async (userId) => {
  return await getDocumentsService(userId);
};

export const updateDocumentAction = async (userId, data) => {
  return await updateDocumentService(
    data.id,
    userId,
    data.updates
  );
};

export const deleteDocumentAction = async (userId, data) => {
  return await deleteDocumentService(
    data.id,
    userId
  );
};