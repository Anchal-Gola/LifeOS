import {
  createGoalService,
  getGoalsService,
  updateGoalService,
  deleteGoalService,
  completeGoalTodayService,
} from "../services/goalService.js";

export const createGoal = async (req, res) => {
  try {
    const goal = await createGoalService({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGoals = async (req, res) => {
  try {
    const goals = await getGoalsService(req.user.id);

    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const goal = await updateGoalService(
      req.params.id,
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const goal = await deleteGoalService(
      req.params.id,
      req.user.id
    );

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const completeGoalToday = async (req, res) => {
  try {
    const goal = await completeGoalTodayService(
      req.params.id,
      req.user.id,
      req.body.date
    );

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};