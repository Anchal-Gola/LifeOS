
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const loginUser = async (email, password) =>
  (
    await axios.post(
      `${API_URL}/login`,
      { email, password },
      { withCredentials: true }
    )
  ).data;

export const signupUser = async (name, email, password) =>
  (
    await axios.post(
      `${API_URL}/signup`,
      { name, email, password },
      { withCredentials: true }
    )
  ).data;

export const googleLoginUser = async (credential) =>
  (
    await axios.post(
      `${API_URL}/google`,
      { credential },
      { withCredentials: true }
    )
  ).data;

export const getCurrentUser = async () =>
  (
    await axios.get(`${API_URL}/me`, {
      withCredentials: true,
    })
  ).data;

export const logoutUser = async () =>
  (
    await axios.post(
      `${API_URL}/logout`,
      {},
      { withCredentials: true }
    )
  ).data;

// Request a password-reset email
export const forgotPasswordUser = async (email) =>
  (
    await axios.post(`${API_URL}/forgot-password`, { email })
  ).data;

// Set a new password using the emailed token
export const resetPasswordUser = async (token, password) =>
  (
    await axios.post(`${API_URL}/reset-password`, {
      token,
      password,
    })
  ).data;