import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
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

    fileUrl: {
      type: String,
      trim: true,
    },

    fileName: {
      type: String,
      trim: true,
    },

    fileType: {
      type: String,
      trim: true,
    },

    sourceType: {
      type: String,
      enum: ["url", "upload"],
      default: "url",
    },

    category: {
      type: String,
      trim: true,
      default: "general",
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;