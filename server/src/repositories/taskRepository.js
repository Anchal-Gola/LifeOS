import Task from "../models/Task.js";

export const createTask = async (taskData) => {
  return await Task.create(taskData);
};

export const getTasksByUser = async (userId) => {
  return await Task.find({ user: userId });
};

export const getTaskById = async (taskId, userId) => {
  return await Task.findOne({
    _id: taskId,
    user: userId,
  });
};

export const updateTask = async (taskId, userId, data) => {
  return await Task.findOneAndUpdate(
    {
      _id: taskId,
      user: userId,
    },
    data,
    {
      returnDocument: "after",
    }
  );
};

export const deleteTask = async (taskId, userId) => {
  return await Task.findOneAndDelete({
    _id: taskId,
    user: userId,
  });
};
export const getCompletedTasksThisWeek = async (
  userId,
  weekStart,
  now
) => {
  return await Task.find({
    user: userId,
    status: { $in: ["Completed", "completed"] },
    updatedAt: {
      $gte: weekStart,
      $lte: now,
    },
  }).sort({ updatedAt: -1 });
};