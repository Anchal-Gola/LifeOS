import {
  createTaskService,
  getTasksService,
  updateTaskService,
  deleteTaskService,
} from "../services/taskService.js";

export const createTask = async (req, res) => {
  try {
    const task = await createTaskService({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await getTasksService(req.user.id);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateTask = async (req, res) => {
  try {
   const task = await updateTaskService(
  req.params.id,
  req.user.id,
  req.body
);

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteTask = async (req, res) => {
  try {
    await deleteTaskService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};