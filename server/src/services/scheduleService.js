import {
  createSchedule,
  getSchedulesByUser,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
  getDueSchedules,
} from "../repositories/scheduleRepository.js";

export const createScheduleService = async (
  scheduleData
) => {
  return await createSchedule(scheduleData);
};

export const getSchedulesService = async (userId) => {
  return await getSchedulesByUser(userId);
};

export const getScheduleByIdService = async (
  scheduleId,
  userId
) => {
  return await getScheduleById(
    scheduleId,
    userId
  );
};

export const updateScheduleService = async (
  scheduleId,
  userId,
  data
) => {
  const schedule = await updateSchedule(
    scheduleId,
    userId,
    data
  );

  if (!schedule) {
    throw new Error("Schedule not found");
  }

  return schedule;
};

export const deleteScheduleService = async (
  scheduleId,
  userId
) => {
  const schedule = await deleteSchedule(
    scheduleId,
    userId
  );

  if (!schedule) {
    throw new Error("Schedule not found");
  }

  return schedule;
};

export const getDueSchedulesService = async (now) => {
  return await getDueSchedules(now);
};