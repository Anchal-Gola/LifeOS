import {
  createHabitService,
  updateHabitService,
  deleteHabitService,
  completeHabitService,
} from "../../services/habitService.js";

export const createHabitAction = async (userId, data) => {
  return await createHabitService({
    user: userId,
    name: data.name,
    description: data.description || "",
    frequency: data.frequency || "daily",
  });
};

export const updateHabitAction = async (userId, data) => {
  return await updateHabitService(
    data.id,
    userId,
    data.updates
  );
};

export const deleteHabitAction = async (userId, data) => {
  return await deleteHabitService(
    data.id,
    userId
  );
};

export const completeHabitAction = async (userId, data) => {
  return await completeHabitService(
    data.id,
    userId,
    data.date
  );
};