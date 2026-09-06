import mongoose from "mongoose";

const studyWorkspaceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    topics: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },

        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const StudyWorkspace =
  mongoose.models.StudyWorkspace ||
  mongoose.model("StudyWorkspace", studyWorkspaceSchema);

export default StudyWorkspace;