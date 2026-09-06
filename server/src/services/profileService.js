import {
  createProfile,
  getProfileByUser,
  updateProfile,
} from "../repositories/profileRepository.js";

export const createProfileService = async (profileData) => {
  return await createProfile(profileData);
};

export const getProfileService = async (userId) => {
  return await getProfileByUser(userId);
};

export const updateProfileService = async (userId, data) => {
  return await updateProfile(userId, data);
};