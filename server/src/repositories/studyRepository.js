import Study from "../models/Study.js";

export const createStudy = async (studyData) => {
  return await Study.create(studyData);
};

export const getStudiesByUser = async (userId) => {
  return await Study.find({ user: userId }).sort({ date: -1 });
};
export const updateStudy = async (studyId, userId, data) => {
  return await Study.findOneAndUpdate(
    { _id: studyId, user: userId },
    data,
    { new: true }
  );
};

export const deleteStudy = async (studyId, userId) => {
  return await Study.findOneAndDelete({
    _id: studyId,
    user: userId,
  });
};