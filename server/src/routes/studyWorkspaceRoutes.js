import express from "express";

import {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
  addTopic,
  toggleTopic,
} from "../controllers/studyWorkspaceController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createSubject);
router.get("/", getSubjects);
router.get("/:id", getSubject);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);
router.post("/:id/topics", addTopic);
router.patch("/:id/topics/:topicId", toggleTopic);

export default router;