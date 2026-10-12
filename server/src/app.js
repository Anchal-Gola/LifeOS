import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { FRONTEND_URL } from "./config/env.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import journalRoutes from "./routes/journalRoutes.js";
import studyRoutes from "./routes/studyRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import globalSearchRoutes from "./routes/globalSearchRoutes.js";
import intelligenceRoutes from "./routes/intelligenceRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import studyWorkspaceRoutes from "./routes/studyWorkspaceRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import pushSubscriptionRoutes from "./routes/pushSubscriptionRoutes.js";
import userPresenceRoutes from "./routes/userPresenceRoutes.js";

const app = express();

const allowedOrigins = [
  FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/studies", studyRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/search", globalSearchRoutes);
app.use("/api/intelligence", intelligenceRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/study-workspace", studyWorkspaceRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/push-subscriptions", pushSubscriptionRoutes);
app.use("/api/presence", userPresenceRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LifeOS Backend Running 🚀",
  });
});

export default app;