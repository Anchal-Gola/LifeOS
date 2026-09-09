import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sourceType: {
      type: String,
      enum: [
        "task",
        "habit",
        "goal",
        "study",
        "calendar",
      ],
      required: true,
    },

    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    scheduledFor: {
      type: Date,
      required: true,
    },

    reminderMinutes: {
      type: Number,
      default: 10,
      min: 0,
    },

    repeat: {
      type: String,
      enum: ["none", "daily", "weekly"],
      default: "none",
    },

    notificationEnabled: {
      type: Boolean,
      default: true,
    },

    soundEnabled: {
      type: Boolean,
      default: true,
    },

    alarmEnabled: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: [
        "scheduled",
        "triggered",
        "completed",
        "cancelled",
      ],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model(
  "Schedule",
  scheduleSchema
);

export default Schedule;