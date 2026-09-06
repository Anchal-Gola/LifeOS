import Task from "../models/Task.js";
import Habit from "../models/Habit.js";
import Goal from "../models/Goal.js";
import Study from "../models/Study.js";
import Journal from "../models/Journal.js";

export const getLifeInsightsService = async (userId) => {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 6);
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfPreviousWeek = new Date(now);
  startOfPreviousWeek.setDate(now.getDate() - 13);
  startOfPreviousWeek.setHours(0, 0, 0, 0);

  const [
    tasks,
    habits,
    goals,
    studies,
    journals,
  ] = await Promise.all([
    Task.find({ user: userId }),
    Habit.find({ user: userId }),
    Goal.find({ user: userId }),
    Study.find({ user: userId }),
    Journal.find({ user: userId }),
  ]);

  // -----------------------------
  // TASK INSIGHTS
  // -----------------------------

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "completed"
  ).length;

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;

    const dueDate = new Date(task.dueDate);

    return (
      dueDate < startOfToday &&
      task.status !== "completed"
    );
  }).length;

  const weeklyTasks = tasks.filter((task) => {
    const date = task.createdAt || task.date;

    if (!date) return false;

    const taskDate = new Date(date);

    return taskDate >= startOfWeek;
  }).length;

  const weeklyCompletedTasks = tasks.filter((task) => {
    const date = task.updatedAt || task.createdAt;

    if (!date) return false;

    const taskDate = new Date(date);

    return (
      taskDate >= startOfWeek &&
      task.status === "completed"
    );
  }).length;

  // -----------------------------
  // HABIT INSIGHTS
  // -----------------------------

  const activeHabits = habits.filter(
    (habit) => habit.isActive !== false
  ).length;

  // -----------------------------
  // GOAL INSIGHTS
  // -----------------------------

  const totalGoals = goals.length;

  const completedGoals = goals.filter(
    (goal) =>
      goal.status === "completed" ||
      goal.completed === true
  ).length;

  const activeGoals = totalGoals - completedGoals;

  // -----------------------------
  // STUDY INSIGHTS
  // -----------------------------

  const weeklyStudyMinutes = studies
    .filter((study) => {
      const date = study.date || study.createdAt;

      if (!date) return false;

      return new Date(date) >= startOfWeek;
    })
    .reduce(
      (total, study) => total + (Number(study.duration) || 0),
      0
    );

  const previousWeekStudyMinutes = studies
    .filter((study) => {
      const date = study.date || study.createdAt;

      if (!date) return false;

      const studyDate = new Date(date);

      return (
        studyDate >= startOfPreviousWeek &&
        studyDate < startOfWeek
      );
    })
    .reduce(
      (total, study) => total + (Number(study.duration) || 0),
      0
    );

  let studyChangePercentage = 0;

  if (previousWeekStudyMinutes > 0) {
    studyChangePercentage = Math.round(
      ((weeklyStudyMinutes - previousWeekStudyMinutes) /
        previousWeekStudyMinutes) *
        100
    );
  }

  // -----------------------------
  // JOURNAL INSIGHTS
  // -----------------------------

  const weeklyJournals = journals.filter((journal) => {
    const date = journal.date || journal.createdAt;

    if (!date) return false;

    return new Date(date) >= startOfWeek;
  }).length;

  const moodCounts = {};

  journals
    .filter((journal) => {
      const date = journal.date || journal.createdAt;

      if (!date) return false;

      return new Date(date) >= startOfWeek;
    })
    .forEach((journal) => {
      const mood = journal.mood || "neutral";

      moodCounts[mood] =
        (moodCounts[mood] || 0) + 1;
    });

  let mostCommonMood = "neutral";

  if (Object.keys(moodCounts).length > 0) {
    mostCommonMood = Object.keys(moodCounts).reduce(
      (a, b) =>
        moodCounts[a] > moodCounts[b] ? a : b
    );
  }

  // -----------------------------
  // INSIGHTS
  // -----------------------------

  const insights = [];

  if (totalTasks > 0) {
    const completionRate = Math.round(
      (completedTasks / totalTasks) * 100
    );

    insights.push({
      type: "productivity",
      title: "Task completion",
      message: `You have completed ${completionRate}% of your tasks.`,
      value: completionRate,
      unit: "%",
    });
  }

  if (overdueTasks > 0) {
    insights.push({
      type: "warning",
      title: "Overdue tasks",
      message: `You have ${overdueTasks} overdue task${
        overdueTasks === 1 ? "" : "s"
      }.`,
      value: overdueTasks,
      unit: "tasks",
    });
  }

  if (weeklyCompletedTasks > 0) {
    insights.push({
      type: "productivity",
      title: "This week's progress",
      message: `You completed ${weeklyCompletedTasks} task${
        weeklyCompletedTasks === 1 ? "" : "s"
      } this week.`,
      value: weeklyCompletedTasks,
      unit: "tasks",
    });
  }

  if (weeklyStudyMinutes > 0) {
    insights.push({
      type: "study",
      title: "Study progress",
      message: `You studied ${weeklyStudyMinutes} minutes this week.`,
      value: weeklyStudyMinutes,
      unit: "minutes",
    });
  }

  if (previousWeekStudyMinutes > 0) {
    insights.push({
      type:
        studyChangePercentage >= 0
          ? "positive"
          : "warning",
      title: "Study trend",
      message:
        studyChangePercentage >= 0
          ? `Your study time increased by ${studyChangePercentage}% compared with last week.`
          : `Your study time decreased by ${Math.abs(
              studyChangePercentage
            )}% compared with last week.`,
      value: studyChangePercentage,
      unit: "%",
    });
  }

  if (activeHabits > 0) {
    insights.push({
      type: "habit",
      title: "Active habits",
      message: `You currently have ${activeHabits} active habit${
        activeHabits === 1 ? "" : "s"
      }.`,
      value: activeHabits,
      unit: "habits",
    });
  }

  if (activeGoals > 0) {
    insights.push({
      type: "goal",
      title: "Goals in progress",
      message: `You are currently working on ${activeGoals} goal${
        activeGoals === 1 ? "" : "s"
      }.`,
      value: activeGoals,
      unit: "goals",
    });
  }

  if (weeklyJournals > 0) {
    insights.push({
      type: "journal",
      title: "Reflection",
      message: `You wrote ${weeklyJournals} journal entr${
        weeklyJournals === 1 ? "y" : "ies"
      } this week. Your most common mood was ${mostCommonMood}.`,
      value: weeklyJournals,
      unit: "entries",
    });
  }

  if (insights.length === 0) {
    insights.push({
      type: "info",
      title: "Start building your LifeOS",
      message:
        "Add some tasks, habits, goals, study sessions or journal entries to start receiving personalized insights.",
      value: 0,
      unit: "",
    });
  }

  return {
    summary: {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      weeklyTasks,
      weeklyCompletedTasks,
      activeHabits,
      totalGoals,
      completedGoals,
      activeGoals,
      weeklyStudyMinutes,
      previousWeekStudyMinutes,
      studyChangePercentage,
      weeklyJournals,
      mostCommonMood,
    },
    insights,
  };
};