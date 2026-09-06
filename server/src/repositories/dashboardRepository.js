import Task from "../models/Task.js";
import Habit from "../models/Habit.js";
import Event from "../models/Event.js";
import Goal from "../models/Goal.js";
import Study from "../models/Study.js";

export const getDashboardData = async (userId) => {
  const [tasks, habits, events, goals, studies] = await Promise.all([
    Task.find({ user: userId }),
    Habit.find({ user: userId }),
    Event.find({ user: userId }),
    Goal.find({ user: userId }),
    Study.find({ user: userId }),
  ]);

  return {
    tasks,
    habits,
    events,
    goals,
    studies,
  };
};