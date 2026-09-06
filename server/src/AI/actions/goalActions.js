import {
  createGoalService,
  updateGoalService,
  deleteGoalService,
  completeGoalTodayService,
  getCompletedGoalsThisWeekService,
} from "../../services/goalService.js";

export const createGoalAction = async (userId, data) => {
  return await createGoalService({
    user: userId,
    title: data.title,
    description: data.description || "",
    deadline: data.deadline || undefined,
    status: "active",
    progress: data.progress || 0,
  });
};

export const updateGoalAction = async (userId, data) => {
  return await updateGoalService(
    data.id,
    userId,
    data.updates
  );
};

export const deleteGoalAction = async (userId, data) => {
  return await deleteGoalService(
    data.id,
    userId
  );
};

export const completeGoalTodayAction = async (
  userId,
  data
) => {
  return await completeGoalTodayService(
    data.id,
    userId,
    data.date
  );
};
export const getCompletedGoalsThisWeekAction = async (
  userId,
  data
) => {
  return await getCompletedGoalsThisWeekService(
    userId,
    data.weekStart,
    data.now
  );
};