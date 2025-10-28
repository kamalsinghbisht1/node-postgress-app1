import express from "express";
import {
  handleStepUpdate,
  getStepData,
} from "../controllers/bookingController.js";

const router = express.Router();

// PUT: Save or update a step
router.put("/:step", handleStepUpdate);

// GET: Fetch data for a step
router.get("/:case_id/:step", getStepData);

export default router;
