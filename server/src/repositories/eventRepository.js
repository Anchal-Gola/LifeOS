import Event from "../models/Event.js";

export const createEvent = async (eventData) => {
  return await Event.create(eventData);
};

export const getEventsByUser = async (userId) => {
  return await Event.find({ user: userId });
};
export const updateEvent = async (eventId, userId, data) => {
  return await Event.findOneAndUpdate(
    { _id: eventId, user: userId },
    data,
    { new: true }
  );
};
export const deleteEvent = async (eventId, userId) => {
  return await Event.findOneAndDelete({
    _id: eventId,
    user: userId,
  });
};
export const getCompletedEventsThisWeek = async (
  userId,
  weekStart,
  now
) => {
  return await Event.find({
    user: userId,
    status: { $in: ["completed", "Completed"] },
    startTime: {
      $gte: weekStart,
      $lte: now,
    },
  }).sort({ startTime: -1 });
};