import {
  createTaskService,
  updateTaskService,
  deleteTaskService,
} from "../services/taskService.js";

import {
  createGoalService,
  updateGoalService,
  deleteGoalService,
  completeGoalTodayService,
} from "../services/goalService.js";

import {
  addTopicService,
} from "../services/studyWorkspaceService.js";

export const executeAction = async ({
  action,
  userId,
  data = {},
}) => {
  switch (action) {
    /*
     * =========================
     * TASK ACTIONS
     * =========================
     */

    case "create_task":
      return await createTaskService({
        user: userId,
        title: data.title,
        description: data.description || "",
        priority: data.priority || "Medium",
        status: data.status || "Todo",
        dueDate: data.dueDate || undefined,
      });

    case "update_task":
      return await updateTaskService(
        data.id,
        userId,
        data.updates
      );

    case "delete_task":
      return await deleteTaskService(
        data.id,
        userId
      );

    /*
     * =========================
     * GOAL ACTIONS
     * =========================
     */

    case "create_goal":
      return await createGoalService({
        user: userId,
        title: data.title,
        description: data.description || "",
        deadline: data.deadline || undefined,
        status: "active",
        progress: data.progress || 0,
      });

    case "update_goal":
      return await updateGoalService(
        data.id,
        userId,
        data.updates
      );

    case "delete_goal":
      return await deleteGoalService(
        data.id,
        userId
      );

    case "complete_goal_today":
      return await completeGoalTodayService(
        data.id,
        userId,
        data.date
      );

    /*
     * =========================
     * STUDY WORKSPACE ACTIONS
     * =========================
     */

    case "add_study_topic":
      return await addTopicService(
        data.subjectId,
        userId,
        data.topicTitle
      );

    /*
     * =========================
     * UNKNOWN ACTION
     * =========================
     */

    default:
      throw new Error(
        `Unsupported AI action: ${action}`
      );
  }
};