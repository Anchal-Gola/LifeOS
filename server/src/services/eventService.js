import {
  createEvent,
  getEventsByUser,
  updateEvent,
  deleteEvent,
  getCompletedEventsThisWeek,
} from "../repositories/eventRepository.js";

export const createEventService = async (eventData) => {
  return await createEvent(eventData);
};

export const getEventsService = async (userId) => {
  return await getEventsByUser(userId);
};
export const updateEventService = async (eventId, userId, data) => {
  return await updateEvent(eventId, userId, data);
};
export const deleteEventService = async (eventId, userId) => {
  return await deleteEvent(eventId, userId);
};
export const getCompletedEventsThisWeekService = async (
  userId,
  weekStart,
  now
) => {
  return await getCompletedEventsThisWeek(
    userId,
    weekStart,
    now
  );
};