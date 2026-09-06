import Profile from "../models/Profile.js";

export const createProfile = async (profileData) => {
  return await Profile.create(profileData);
};

export const getProfileByUser = async (userId) => {
  return await Profile.findOne({ user: userId });
};

export const updateProfile = async (userId, data) => {
  return await Profile.findOneAndUpdate(
    { user: userId },
    data,
    { new: true }
  );
};