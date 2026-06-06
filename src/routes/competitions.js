import express from "express";
import { authenticateUser, requireRole } from "../middleware/authMiddleware.js";
import {
  getCompetitions,
  getCompetitionById,
  createCompetition
} from "../db/competitionsSvc.js";

const router = express.Router();

router.get("/", authenticateUser, async (req, res) => {
  try {
    const competitions = await getCompetitions();
    res.json(competitions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch competitions" });
  }
});

router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const competition = await getCompetitionById(req.params.id);
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }
    res.json(competition);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch competition" });
  }
});

router.get("/name/:name", authenticateUser, async (req, res) => {
  try {
    const competition = await getCompetitionByName(req.params.name);
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }
    res.json(competition);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch competition" });
  }
});

router.post("/", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const { name, display_name } = req.body;
    const newCompetition = await createCompetition({
      name,
      display_name
    });
    res.status(201).json(newCompetition);
  } catch (err) {
    res.status(500).json({ error: "Failed to create competition" });
  }
});

export default router;
