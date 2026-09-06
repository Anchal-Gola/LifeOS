import { getDashboardData } from "../repositories/dashboardRepository.js";

export const getDashboardService = async (userId) => {
  const data = await getDashboardData(userId);

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
    tasks: data.tasks,
    habits: data.habits,
    events: data.events,
    goals: data.goals,
    summary: {
      totalTasks: data.tasks.length,
      completedTasks,
      totalHabits: data.habits.length,
      totalGoals: data.goals.length,
      completedGoals,
      totalStudyMinutes,
    },
  };
};