import {
  addTopicService,
} from "../../services/studyWorkspaceService.js";

export const addStudyTopicAction = async (
  userId,
  data
) => {
  return await addTopicService(
    data.subjectId,
    userId,
    data.topicTitle
  );
};