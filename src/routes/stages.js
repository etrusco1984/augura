import express from "express";
import { authenticateUser, requireRole } from "../middleware/authMiddleware.js";
import {
  getStagesBySeason,
  getStageById,
  getStageByName,
  createStage
} from "../db/stagesSvc.js";

const router = express.Router();

// GET /stages/season/:seasonId
router.get("/season/:seasonId", authenticateUser, async (req, res) => {
  try {
    const stages = await getStagesBySeason(req.params.seasonId);
    res.json(stages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stages" });
  }
});

// GET /stages/:id
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const stage = await getStageById(req.params.id);
    if (!stage) {
      return res.status(404).json({ error: "Stage not found" });
    }
    res.json(stage);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stage" });
  }
});

// GET /stages/name/:name
router.get("/name/:name", authenticateUser, async (req, res) => {
  try {
    const stage = await getStageByName(req.params.name);
    if (!stage) {
      return res.status(404).json({ error: "Stage not found" });
    }
    res.json(stage);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stage" });
  }
});

// POST /stages
router.post("/", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const { season_id, name, format_id, order_index } = req.body;
    const newStage = await createStage({
      season_id,
      name,
      format_id,
      order_index
    });
    res.status(201).json(newStage);
  } catch (err) {
    res.status(500).json({ error: "Failed to create stage" });
  }
});

export default router;
