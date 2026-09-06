import {
  createNote,
  getNotesByUser,
  updateNote,
  deleteNote,
} from "../repositories/noteRepository.js";

export const createNoteService = async (noteData) => {
  return await createNote(noteData);
};

export const getNotesService = async (userId) => {
  return await getNotesByUser(userId);
};

export const updateNoteService = async (noteId, userId, data) => {
  const note = await updateNote(noteId, userId, data);

  if (!note) {
    throw new Error("Note not found");
  }

  return note;
};
export const deleteNoteService = async (noteId, userId) => {
  return await deleteNote(noteId, userId);
};