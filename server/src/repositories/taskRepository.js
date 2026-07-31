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

export const updateTask = async (taskId, data) => {
  return await Task.findByIdAndUpdate(taskId, data, {
    new: true,
  });
};

export const deleteTask = async (taskId) => {
  return await Task.findByIdAndDelete(taskId);
};