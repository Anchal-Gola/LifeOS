import {
  createGoal,
  getGoalsByUser,
  getGoalById,
  updateGoal,
  completeGoalToday,
  deleteGoal,
  getCompletedGoalsThisWeek,
} from "../repositories/goalRepository.js";

export const createGoalService = async (goalData) => {
  return await createGoal(goalData);
};

export const getGoalsService = async (userId) => {
  return await getGoalsByUser(userId);
};

export const updateGoalService = async (goalId, userId, data) => {
  const goal = await getGoalById(goalId, userId);

  if (!goal) {
    throw new Error("Goal not found");
  }

  return await updateGoal(goalId, userId, data);
};

export const completeGoalTodayService = async (
  goalId,
  userId,
  date
) => {
  const goal = await getGoalById(goalId, userId);

  if (!goal) {
    throw new Error("Goal not found");
  }

  return await completeGoalToday(goalId, userId, date);
};

export const deleteGoalService = async (goalId, userId) => {
  const goal = await getGoalById(goalId, userId);

  if (!goal) {
    throw new Error("Goal not found");
  }

  return await deleteGoal(goalId, userId);
};
export const getCompletedGoalsThisWeekService = async (
  userId,
  weekStart,
  now
) => {
  return await getCompletedGoalsThisWeek(
    userId,
    weekStart,
    now
  );
};