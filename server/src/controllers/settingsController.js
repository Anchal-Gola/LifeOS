import {
  createSettingsService,
  getSettingsService,
  updateSettingsService,
} from "../services/settingsService.js";

export const createSettings = async (req, res) => {
  try {
    const settings = await createSettingsService({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSettings = async (req, res) => {
  try {
    const settings = await getSettingsService(req.user.id);

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const settings = await updateSettingsService(
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};