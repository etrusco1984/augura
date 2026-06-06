import express from "express";
import { authenticateUser, requireRole } from "../middleware/authMiddleware.js";
import {
  getSeasonsByCompetition,
  getSeasonById,
  createSeason
} from "../db/seasonsSvc.js";

const router = express.Router();

// GET /seasons/competition/:competitionId
router.get("/competition/:competitionId", authenticateUser, async (req, res) => {
  try {
    const seasons = await getSeasonsByCompetition(req.params.competitionId);
    res.json(seasons);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch seasons" });
  }
});

// GET /seasons/:id
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const season = await getSeasonById(req.params.id);
    if (!season) {
      return res.status(404).json({ error: "Season not found" });
    }
    res.json(season);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch season" });
  }
});

router.get("/name/:name", authenticateUser, async (req, res) => {
  try {
    const season = await getSeasonByName(req.params.name);
    if (!season) {
      return res.status(404).json({ error: "Season not found" });
    }
    res.json(season);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch season" });
  }
});

// POST /seasons
router.post("/", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const { competition_id, name, start_date, end_date } = req.body;
    const newSeason = await createSeason({
      competition_id,
      name,
      start_date,
      end_date
    });
    res.status(201).json(newSeason);
  } catch (err) {
    res.status(500).json({ error: "Failed to create season" });
  }
});

export default router;
