import {
  createHabitService,
  getHabitsService,
  updateHabitService,
  deleteHabitService,
  completeHabitService,
} from "../services/habitService.js";
export const createHabit = async (req, res) => {
  try {
    const habit = await createHabitService({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getHabits = async (req, res) => {
  try {
    const habits = await getHabitsService(req.user.id);

    res.status(200).json({
      success: true,
      data: habits,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateHabit = async (req, res) => {
  try {
    const habit = await updateHabitService(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteHabit = async (req, res) => {
  try {
    const habit = await deleteHabitService(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const completeHabit = async (req, res) => {
  try {
    const habit = await completeHabitService(
      req.params.id,
      req.user.id,
      req.body.date
    );

    res.status(200).json({
      success: true,
      data: habit,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};