import Journal from "../models/Journal.js";

export const createJournal = async (journalData) => {
  return await Journal.create(journalData);
};

export const getJournalsByUser = async (userId) => {
  return await Journal.find({ user: userId }).sort({ date: -1 });
};
export const updateJournal = async (journalId, userId, data) => {
  return await Journal.findOneAndUpdate(
    { _id: journalId, user: userId },
    data,
    { new: true }
  );
};

export const deleteJournal = async (journalId, userId) => {
  return await Journal.findOneAndDelete({
    _id: journalId,
    user: userId,
  });
};