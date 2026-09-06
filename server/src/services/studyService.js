import {
  createStudy,
  getStudiesByUser,
  updateStudy,
  deleteStudy,
} from "../repositories/studyRepository.js";

export const createStudyService = async (studyData) => {
  return await createStudy(studyData);
};

export const getStudiesService = async (userId) => {
  return await getStudiesByUser(userId);
};
export const updateStudyService = async (studyId, userId, data) => {
  return await updateStudy(studyId, userId, data);
};

export const deleteStudyService = async (studyId, userId) => {
  return await deleteStudy(studyId, userId);
};