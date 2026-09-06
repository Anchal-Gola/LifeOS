import express from "express";
import {
  createStudy,
  getStudies,
  updateStudy,
  deleteStudy,
} from "../controllers/studyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createStudy);
router.get("/", protect, getStudies);
router.put("/:id", protect, updateStudy);
router.delete("/:id", protect, deleteStudy);

export default router;