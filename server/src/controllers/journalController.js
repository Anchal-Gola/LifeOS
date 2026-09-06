import {
  createJournalService,
  getJournalsService,
  updateJournalService,
  deleteJournalService,
} from "../services/journalService.js";

export const createJournal = async (req, res) => {
  try {
    const journal = await createJournalService({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: journal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJournals = async (req, res) => {
  try {
    const journals = await getJournalsService(req.user.id);

    res.status(200).json({
      success: true,
      data: journals,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateJournal = async (req, res) => {
  try {
    const journal = await updateJournalService(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: journal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteJournal = async (req, res) => {
  try {
    const journal = await deleteJournalService(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: journal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};