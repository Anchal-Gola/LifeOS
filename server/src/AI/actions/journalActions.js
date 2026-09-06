import {
  createJournalService,
  getJournalsService,
  updateJournalService,
  deleteJournalService,
} from "../../services/journalService.js";

export const createJournalAction = async (userId, data) => {
  return await createJournalService({
    user: userId,
    title: data.title,
    content: data.content || "",
    date: data.date || new Date(),
  });
};
export const getJournalsAction = async (userId) => {
  return await getJournalsService(userId);
};

export const updateJournalAction = async (userId, data) => {
  return await updateJournalService(
    data.id,
    userId,
    data.updates
  );
};

export const deleteJournalAction = async (userId, data) => {
  return await deleteJournalService(
    data.id,
    userId
  );
};
