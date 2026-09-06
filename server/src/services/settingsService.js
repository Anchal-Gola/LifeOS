import {
  createSettings,
  getSettingsByUser,
  updateSettings,
} from "../repositories/settingsRepository.js";

export const createSettingsService = async (settingsData) => {
  return await createSettings(settingsData);
};

export const getSettingsService = async (userId) => {
  return await getSettingsByUser(userId);
};

export const updateSettingsService = async (userId, data) => {
  return await updateSettings(userId, data);
};