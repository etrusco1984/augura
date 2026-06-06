import express from "express";
import { authenticateUser, requireRole } from "../middleware/authMiddleware.js";
import {
  getTeamsBySeason,
  getTeamSeasonById,
  createTeamSeason
} from "../db/teamSeasonsSvc.js";

const router = express.Router();

// GET /team-seasons/season/:seasonId
router.get("/season/:seasonId", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const teams = await getTeamsBySeason(req.params.seasonId);
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch teams for season" });
  }
});

// GET /team-seasons/:id
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const teamSeason = await getTeamSeasonById(req.params.id);
    if (!teamSeason) {
      return res.status(404).json({ error: "Team-season not found" });
    }
    res.json(teamSeason);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch team-season" });
  }
});

// POST /team-seasons
router.post("/", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const { team_id, season_id } = req.body;
    const newTeamSeason = await createTeamSeason({
      team_id,
      season_id
    });
    res.status(201).json(newTeamSeason);
  } catch (err) {
    res.status(500).json({ error: "Failed to create team-season" });
  }
});

export default router;
