
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGODB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;
export const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:5173";