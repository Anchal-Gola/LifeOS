
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { OAuth2Client } from "google-auth-library";
import { JWT_SECRET, GOOGLE_CLIENT_ID } from "../config/env.js";
import bcrypt from "bcryptjs";

import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByGoogleId,
  findUserByResetToken,
  savePasswordResetToken,
} from "../repositories/userRepository.js";

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

export const signupService = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  return await createUser({
    name,
    email: normalizedEmail,
    password: hashedPassword,
  });
};

export const loginService = async ({ email, password }) => {
  const user = await findUserByEmail(email.trim().toLowerCase());

  if (!user || !user.password) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token, user };
};

export const googleLoginService = async (credential) => {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error("Google authentication is not configured");
  }

  if (!credential) {
    throw new Error("Google credential is missing");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.sub || !payload.email || payload.email_verified !== true) {
    throw new Error("Google account could not be verified");
  }

  const googleId = payload.sub;
  const email = payload.email.trim().toLowerCase();
  const name = payload.name?.trim() || email.split("@")[0];

  let user = await findUserByGoogleId(googleId);

  if (!user) {
    user = await findUserByEmail(email);

    if (user) {
      if (user.googleId && user.googleId !== googleId) {
        throw new Error("This email is linked to another Google account");
      }

      user.googleId = googleId;
      await user.save();
    } else {
      user = await createUser({ name, email, googleId });
    }
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token, user };
};

export const getMeService = async (id) => {
  const user = await findUserById(id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Generate a single-use password reset token
export const requestPasswordResetService = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUserByEmail(normalizedEmail);

  // Do not reveal whether the email exists
  if (!user) {
    return null;
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await savePasswordResetToken(user._id, tokenHash, expiresAt);

  return {
    token: rawToken,
    email: user.email,
    name: user.name,
  };
};

// Verify token and update password
export const resetPasswordService = async ({ token, password }) => {
  if (!token || !password || password.length < 6) {
    throw new Error("A valid token and password of at least 6 characters are required");
  }

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await findUserByResetToken(tokenHash);

  if (!user) {
    throw new Error("Reset link is invalid or expired");
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return true;
};