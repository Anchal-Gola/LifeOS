import {
  createScheduleService,
  getSchedulesService,
  getScheduleByIdService,
  updateScheduleService,
  deleteScheduleService,
} from "../services/scheduleService.js";

export const createSchedule = async (req, res) => {
  try {
    const schedule = await createScheduleService({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSchedules = async (req, res) => {
  try {
    const schedules = await getSchedulesService(
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: schedules,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getScheduleById = async (req, res) => {
  try {
    const schedule = await getScheduleByIdService(
      req.params.id,
      req.user.id
    );

    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSchedule = async (req, res) => {
  try {
    const schedule = await updateScheduleService(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteSchedule = async (req, res) => {
  try {
    const schedule = await deleteScheduleService(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};