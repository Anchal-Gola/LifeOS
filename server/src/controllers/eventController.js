import {
  createEventService,
  getEventsService,
  updateEventService,
  deleteEventService,
} from "../services/eventService.js";

export const createEvent = async (req, res) => {
  try {
    const event = await createEventService({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEvents = async (req, res) => {
  try {
    const events = await getEventsService(req.user.id);

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateEvent = async (req, res) => {
  try {
    const event = await updateEventService(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteEvent = async (req, res) => {
  try {
    const event = await deleteEventService(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};