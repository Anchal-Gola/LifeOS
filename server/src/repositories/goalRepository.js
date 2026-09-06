import Goal from "../models/Goal.js";

export const createGoal = async (goalData) => {
  return await Goal.create(goalData);
};

export const getGoalsByUser = async (userId) => {
  return await Goal.find({ user: userId }).sort({
    createdAt: -1,
  });
};

export const getGoalById = async (goalId, userId) => {
  return await Goal.findOne({
    _id: goalId,
    user: userId,
  });
};

export const updateGoal = async (goalId, userId, data) => {
  return await Goal.findOneAndUpdate(
    {
      _id: goalId,
      user: userId,
    },
    data,
    {
      new: true,
    }
  );
};

export const completeGoalToday = async (
  goalId,
  userId,
  date
) => {
  return await Goal.findOneAndUpdate(
    {
      _id: goalId,
      user: userId,
    },
    {
      $addToSet: {
        completedDates: date,
      },
    },
    {
      new: true,
    }
  );
};

export const deleteGoal = async (goalId, userId) => {
  return await Goal.findOneAndDelete({
    _id: goalId,
    user: userId,
  });
};
export const getCompletedGoalsThisWeek = async (
  userId,
  weekStart,
  now
) => {
  return await Goal.find({
    user: userId,
    completedDates: {
      $elemMatch: {
        $gte: weekStart,
        $lte: now,
      },
    },
  }).sort({ updatedAt: -1 });
};