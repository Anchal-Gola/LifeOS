import Note from "../models/Note.js";

export const createNote = async (noteData) => {
  return await Note.create(noteData);
};

export const getNotesByUser = async (userId) => {
  return await Note.find({ user: userId });
};
export const updateNote = async (noteId, userId, data) => {
  return await Note.findOneAndUpdate(
    { _id: noteId, user: userId },
    data,
    { new: true }
  );
};
export const deleteNote = async (noteId, userId) => {
  return await Note.findOneAndDelete({
    _id: noteId,
    user: userId,
  });
};