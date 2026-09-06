import {
  createProfileService,
  getProfileService,
  updateProfileService,
} from "../services/profileService.js";

export const createProfile = async (req, res) => {
  try {
    const profile = await createProfileService({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const profile = await getProfileService(req.user.id);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profile = await updateProfileService(
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};