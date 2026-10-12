
import {
  signupService,
  loginService,
  googleLoginService,
  getMeService,
  requestPasswordResetService,
  resetPasswordService,
} from "../services/authService.js";

import { sendPasswordResetEmail } from "../services/emailService.js";

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await signupService({ name, email, password });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await loginService({ email, password });

    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    const { token, user } = await googleLoginService(credential);

    setAuthCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Google login successful",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Google login error:", error.message);

    res.status(401).json({
      success: false,
      message: "Google authentication failed. Please try again.",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await getMeService(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

// Request a password-reset email
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const resetData = await requestPasswordResetService(email);

    if (resetData) {
      await sendPasswordResetEmail(resetData);
    }

    // Same response whether the account exists or not
    return res.status(200).json({
      success: true,
      message:
        "If an account exists for that email, a password-reset link will be sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to send the reset email right now. Please try again later.",
    });
  }
};

// Reset the password using the emailed token
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    await resetPasswordService({ token, password });

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Unable to reset password.",
    });
  }
};