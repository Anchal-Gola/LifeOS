import Settings from "../models/Settings.js";

export const createSettings = async (settingsData) => {
  return await Settings.create(settingsData);
};

export const getSettingsByUser = async (userId) => {
  return await Settings.findOne({ user: userId });
};

export const updateSettings = async (userId, data) => {
  return await Settings.findOneAndUpdate(
    { user: userId },
    data,
    { new: true }
  );
};