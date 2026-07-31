import {
  createTask,
  getTasksByUser,
  getTaskById,
  updateTask,
  deleteTask,
} from "../repositories/taskRepository.js";

export const createTaskService = async (taskData) => {
  return await createTask(taskData);
};

export const getTasksService = async (userId) => {
  return await getTasksByUser(userId);
};

export const updateTaskService = async (taskId, userId, data) => {
  const task = await getTaskById(taskId, userId);

  if (!task) {
    throw new Error("Task not found");
  }

  return await updateTask(taskId, data);
};

export const deleteTaskService = async (taskId, userId) => {
  const task = await getTaskById(taskId, userId);

  if (!task) {
    throw new Error("Task not found");
  }

  return await deleteTask(taskId);
};