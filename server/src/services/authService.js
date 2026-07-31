import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

import bcrypt from "bcryptjs";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../repositories/userRepository.js";

export const signupService = async ({ name, email, password }) => {
  // Check if user already exists
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("User already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save user
  const user = await createUser({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

export const loginService = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user,
  };
};
export const getMeService = async (id) => {
  const user = await findUserById(id);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};