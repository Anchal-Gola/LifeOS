import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    frequency: {
      type: String,
      enum: ["daily", "weekly"],
      default: "daily",
    },

    completedDates: [
      {
        type: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Habit =
  mongoose.models.Habit || mongoose.model("Habit", habitSchema);

export default Habit;