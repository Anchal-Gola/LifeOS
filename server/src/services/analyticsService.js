
import { getAnalyticsData } from "../repositories/analyticsRepository.js";

export const getAnalyticsService = async (userId) => {
  const data = await getAnalyticsData(userId);

  const isCompleted = (status) =>
    status?.toLowerCase() === "completed";

  const completedTasks = data.tasks.filter((task) =>
    isCompleted(task.status)
  ).length;

  const completedGoals = data.goals.filter((goal) =>
    isCompleted(goal.status)
  ).length;

  const totalStudyMinutes = data.studies.reduce(
    (total, study) => total + (study.duration || 0),
    0
  );

  const isCompletedToday = (goal) => {
    const today = new Date().toDateString();

    return (goal.completedDates || []).some(
      (date) => new Date(date).toDateString() === today
    );
  };

  const calculateGoalProgress = (goal) => {
    if (isCompleted(goal.status)) return 100;

    if (!goal.deadline) {
      return isCompletedToday(goal) ? 100 : 0;
    }

    const startValue = goal.startDate || goal.createdAt;
    if (!startValue) return isCompletedToday(goal) ? 100 : 0;

    const start = new Date(startValue);
    const deadline = new Date(goal.deadline);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(deadline.getTime())
    ) {
      return isCompletedToday(goal) ? 100 : 0;
    }

    start.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const totalDays = Math.max(
      1,
      Math.ceil(
        (deadline.getTime() - start.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1
    );

    const completedDates = new Set(
      (goal.completedDates || []).map((date) =>
        new Date(date).toDateString()
      )
    );

    return Math.min(
      100,
      Math.round((completedDates.size / totalDays) * 100)
    );
  };

  const averageGoalProgress = data.goals.length
    ? Math.round(
        data.goals.reduce(
          (total, goal) => total + calculateGoalProgress(goal),
          0
        ) / data.goals.length
      )
    : 0;

  const totalHabitCompletions = data.habits.reduce(
    (total, habit) =>
      total + (habit.completedDates || []).length,
    0
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    const nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    return {
      date: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      tasksCreated: data.tasks.filter((task) => {
        const created = new Date(task.createdAt);
        return created >= date && created < nextDate;
      }).length,
      studyMinutes: data.studies
        .filter((study) => {
          const studyDate = new Date(
            study.date || study.createdAt
          );
          return studyDate >= date && studyDate < nextDate;
        })
        .reduce(
          (total, study) => total + (study.duration || 0),
          0
        ),
      habitsCompleted: data.habits.reduce(
        (total, habit) =>
          total +
          (habit.completedDates || []).filter((completedDate) => {
            const completed = new Date(completedDate);
            return completed >= date && completed < nextDate;
          }).length,
        0
      ),
    };
  });

  return {
    totalTasks: data.tasks.length,
    completedTasks,
    pendingTasks: data.tasks.filter(
      (task) => !isCompleted(task.status)
    ).length,
    totalHabits: data.habits.length,
    totalHabitCompletions,
    totalGoals: data.goals.length,
    completedGoals,
    averageGoalProgress,
    totalStudyMinutes,
    weeklyData,
  };
};
