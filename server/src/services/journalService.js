import {
  createJournal,
  getJournalsByUser,
  updateJournal,
  deleteJournal,
} from "../repositories/journalRepository.js";
export const createJournalService = async (journalData) => {
  return await createJournal(journalData);
};

export const getJournalsService = async (userId) => {
  return await getJournalsByUser(userId);
};
export const updateJournalService = async (journalId, userId, data) => {
  return await updateJournal(journalId, userId, data);
};

export const deleteJournalService = async (journalId, userId) => {
  return await deleteJournal(journalId, userId);
};