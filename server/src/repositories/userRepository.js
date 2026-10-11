
import User from "../models/User.js";

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserByGoogleId = async (googleId) => {
  return await User.findOne({ googleId });
};

export const findUserById = async (id) => {
  return await User.findById(id).select("-password");
};

// Find a user by their hashed password-reset token
export const findUserByResetToken = async (tokenHash) => {
  return await User.findOne({
    resetPasswordToken: tokenHash,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+resetPasswordToken +resetPasswordExpires");
};

// Save password-reset token and expiry
export const savePasswordResetToken = async (userId, tokenHash, expiresAt) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      resetPasswordToken: tokenHash,
      resetPasswordExpires: expiresAt,
    },
    { new: true }
  );
};