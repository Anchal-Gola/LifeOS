import Task from "../models/Task.js";
import Habit from "../models/Habit.js";
import Goal from "../models/Goal.js";
import Study from "../models/Study.js";

export const getAnalyticsData = async (userId) => {
  const [tasks, habits, goals, studies] = await Promise.all([
    Task.find({ user: userId }),
    Habit.find({ user: userId }),
    Goal.find({ user: userId }),
    Study.find({ user: userId }),
  ]);

  return {
    tasks,
    habits,
    goals,
    studies,
  };
};