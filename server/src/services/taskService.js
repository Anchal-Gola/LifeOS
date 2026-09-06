import {
  createTask,
  getTasksByUser,
  getTaskById,
  updateTask,
  deleteTask,
  getCompletedTasksThisWeek,
} from "../repositories/taskRepository.js";

export const createTaskService = async (taskData) => {
  return await createTask(taskData);
};

export const getTasksService = async (userId) => {
  return await getTasksByUser(userId);
};

export const getTaskService = async (taskId, userId) => {
  const task = await getTaskById(taskId, userId);

  if (!task) {
    throw new Error("Task not found");
  }

  return task;
};

export const updateTaskService = async (taskId, userId, data) => {
  const task = await getTaskById(taskId, userId);

  if (!task) {
    throw new Error("Task not found");
  }

  return await updateTask(taskId, userId, data);
};

export const deleteTaskService = async (taskId, userId) => {
  const task = await getTaskById(taskId, userId);

  if (!task) {
    throw new Error("Task not found");
  }

  return await deleteTask(taskId, userId);
};
export const getCompletedTasksThisWeekService = async (
  userId,
  weekStart,
  now
) => {
  return await getCompletedTasksThisWeek(userId, weekStart, now);
};