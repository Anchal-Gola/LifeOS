import {
  createNoteService,
  updateNoteService,
  deleteNoteService,
  getNotesService,
} from "../../services/noteService.js";


export const createNoteAction = async (userId, data) => {
  return await createNoteService({
    user: userId,
    title: data.title,
    content: data.content || "",
  });
};

export const getNotesAction = async (userId) => {
  return await getNotesService(userId);
};
export const updateNoteAction = async (userId, data) => {
  return await updateNoteService(
    data.id,
    userId,
    data.updates
  );
};

export const deleteNoteAction = async (userId, data) => {
  return await deleteNoteService(
    data.id,
    userId
  );
  
};
