import {
  createHabit,
  getHabitsByUser,
  updateHabit,
  deleteHabit,
  completeHabit,
} from "../repositories/habitRepository.js";

export const createHabitService = async (habitData) => {
  return await createHabit(habitData);
};

export const getHabitsService = async (userId) => {
  return await getHabitsByUser(userId);
};
export const updateHabitService = async (habitId, userId, data) => {
  return await updateHabit(habitId, userId, data);
};
export const deleteHabitService = async (habitId, userId) => {
  return await deleteHabit(habitId, userId);
};
export const completeHabitService = async (habitId, userId, date) => {
  return await completeHabit(habitId, userId, date);
};