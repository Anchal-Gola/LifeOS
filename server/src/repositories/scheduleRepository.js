import Schedule from "../models/Schedule.js";

export const createSchedule = async (scheduleData) => {
  return await Schedule.create(scheduleData);
};

export const getSchedulesByUser = async (userId) => {
  return await Schedule.find({
    user: userId,
  }).sort({
    scheduledFor: 1,
  });
};

export const getScheduleById = async (
  scheduleId,
  userId
) => {
  return await Schedule.findOne({
    _id: scheduleId,
    user: userId,
  });
};

export const updateSchedule = async (
  scheduleId,
  userId,
  data
) => {
  return await Schedule.findOneAndUpdate(
    {
      _id: scheduleId,
      user: userId,
    },
    data,
    {
      new: true,
    }
  );
};

export const deleteSchedule = async (
  scheduleId,
  userId
) => {
  return await Schedule.findOneAndDelete({
    _id: scheduleId,
    user: userId,
  });
};

export const getDueSchedules = async (now) => {
  return await Schedule.find({
    scheduledFor: {
      $lte: now,
    },
    status: "scheduled",
    notificationEnabled: true,
  }).sort({
    scheduledFor: 1,
  });
};