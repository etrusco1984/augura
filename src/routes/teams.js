import express from "express";
import { authenticateUser, requireRole } from "../middleware/authMiddleware.js";
import {
  getTeams,
  getTeamById,
  getTeamByName,
  createTeam
} from "../db/teamsSvc.js";

const router = express.Router();

// GET /teams
router.get("/", authenticateUser, async (req, res) => {
  try {
    const teams = await getTeams();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

// GET /teams/:id
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const team = await getTeamById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch team" });
  }
});

// GET /teams/name/:name
router.get("/name/:name", authenticateUser, async (req, res) => {
  try {
    const team = await getTeamByName(req.params.name);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch team" });
  }
});

// POST /teams
router.post("/", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const { name, shortname, logo_url } = req.body;
    const newTeam = await createTeam({
      name,
      shortname,
      logo_url
    });
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(500).json({ error: "Failed to create team" });
  }
});

export default router;
