import { getAnalyticsData } from "../repositories/analyticsRepository.js";

export const getAnalyticsService = async (userId) => {
  const data = await getAnalyticsData(userId);

  const completedTasks = data.tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const completedGoals = data.goals.filter(
    (goal) => goal.status === "completed"
  ).length;

  const totalStudyMinutes = data.studies.reduce(
    (total, study) => total + study.duration,
    0
  );

  return {
    totalTasks: data.tasks.length,
    completedTasks,
    totalHabits: data.habits.length,
    totalGoals: data.goals.length,
    completedGoals,
    totalStudyMinutes,
  };
};