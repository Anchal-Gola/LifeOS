import {
  createNoteService,
  getNotesService,
  updateNoteService,
  deleteNoteService,
} from "../services/noteService.js";

export const createNote = async (req, res) => {
  try {
    const note = await createNoteService({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await getNotesService(req.user.id);

    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await updateNoteService(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteNote = async (req, res) => {
  try {
    const note = await deleteNoteService(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: note,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};