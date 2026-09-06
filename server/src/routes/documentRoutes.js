import express from "express";

import {
  createDocument,
  getDocuments,
  updateDocument,
  deleteDocument,
} from "../controllers/documentController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create document
// Supports both URL and file upload
router.post(
  "/",
  protect,
  upload.single("file"),
  createDocument
);

// Get all documents
router.get("/", protect, getDocuments);

// Update document
// Supports updating details and optionally replacing the file
router.put(
  "/:id",
  protect,
  upload.single("file"),
  updateDocument
);

// Delete document
router.delete("/:id", protect, deleteDocument);

export default router;