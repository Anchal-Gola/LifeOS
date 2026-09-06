import {
  createTaskService,
  updateTaskService,
  deleteTaskService,
  getCompletedTasksThisWeekService,
} from "../../services/taskService.js";

export const createTaskAction = async (userId, data) => {
  return await createTaskService({
    user: userId,
    title: data.title,
    description: data.description || "",
    priority: data.priority || "Medium",
    status: data.status || "Todo",
    dueDate: data.dueDate || undefined,
  });
};

export const updateTaskAction = async (userId, data) => {
  return await updateTaskService(
    data.id,
    userId,
    data.updates
  );
};

export const deleteTaskAction = async (userId, data) => {
  return await deleteTaskService(
    data.id,
    userId
  );
};
export const getCompletedTasksThisWeekAction = async (
  userId,
  data
) => {
  return await getCompletedTasksThisWeekService(
    userId,
    data.weekStart,
    data.now
  );
};