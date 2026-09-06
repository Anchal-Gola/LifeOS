import Habit from "../models/habit.js";

export const createHabit = async (habitData) => {
  return await Habit.create(habitData);
};

export const getHabitsByUser = async (userId) => {
  return await Habit.find({ user: userId });
};
export const updateHabit = async (habitId, userId, data) => {
  return await Habit.findOneAndUpdate(
    { _id: habitId, user: userId },
    data,
    { new: true }
  );
};
export const deleteHabit = async (habitId, userId) => {
  return await Habit.findOneAndDelete({
    _id: habitId,
    user: userId,
  });
};
export const completeHabit = async (habitId, userId, date) => {
  return await Habit.findOneAndUpdate(
    {
      _id: habitId,
      user: userId,
    },
    {
      $addToSet: {
        completedDates: date,
      },
    },
    { new: true }
  );
};