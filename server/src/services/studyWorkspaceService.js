import StudyWorkspace from "../models/StudyWorkspace.js";

export const createSubjectService = async (userId, subject) => {
  return await StudyWorkspace.create({
    user: userId,
    subject: subject.trim(),
    topics: [],
    notes: "",
  });
};

export const getSubjectsService = async (userId) => {
  return await StudyWorkspace.find({ user: userId }).sort({
    createdAt: -1,
  });
};

export const getSubjectService = async (id, userId) => {
  return await StudyWorkspace.findOne({
    _id: id,
    user: userId,
  });
};

export const updateSubjectService = async (
  id,
  userId,
  data
) => {
  return await StudyWorkspace.findOneAndUpdate(
    {
      _id: id,
      user: userId,
    },
    data,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteSubjectService = async (id, userId) => {
  return await StudyWorkspace.findOneAndDelete({
    _id: id,
    user: userId,
  });
};

export const addTopicService = async (
  id,
  userId,
  title
) => {
  const workspace = await StudyWorkspace.findOne({
    _id: id,
    user: userId,
  });

  if (!workspace) return null;

  workspace.topics.push({
    title: title.trim(),
    completed: false,
  });

  await workspace.save();

  return workspace;
};

export const toggleTopicService = async (
  id,
  userId,
  topicId
) => {
  const workspace = await StudyWorkspace.findOne({
    _id: id,
    user: userId,
  });

  if (!workspace) return null;

  const topic = workspace.topics.id(topicId);

  if (!topic) return null;

  topic.completed = !topic.completed;

  await workspace.save();

  return workspace;
};