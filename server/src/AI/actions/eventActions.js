import {
  createEventService,
  updateEventService,
  deleteEventService,
  getCompletedEventsThisWeekService,
} from "../../services/eventService.js";

export const createEventAction = async (userId, data) => {
  return await createEventService({
    user: userId,
    title: data.title,
    description: data.description || "",
    startTime: data.startTime,
    endTime: data.endTime || undefined,
    location: data.location || "",
    reminderMinutes: data.reminderMinutes ?? 10,
    status: data.status || "upcoming",
  });
};

export const updateEventAction = async (userId, data) => {
  return await updateEventService(
    data.id,
    userId,
    data.updates
  );
};

export const deleteEventAction = async (userId, data) => {
  return await deleteEventService(
    data.id,
    userId
  );
};

export const completeEventAction = async (userId, data) => {
  return await updateEventService(
    data.id,
    userId,
    {
      status: "completed",
    }
  );
};
export const getCompletedEventsThisWeekAction = async (
  userId,
  data
) => {
  return await getCompletedEventsThisWeekService(
    userId,
    data.weekStart,
    data.now
  );
};