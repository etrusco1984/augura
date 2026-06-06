import express from "express";
import { authenticateUser, requireRole } from "../middleware/authMiddleware.js";
import {
  createGame,
  getGameById,
  getGamesBySeason,
  updateGameScore
} from "../db/gamesSvc.js";

const router = express.Router();

// POST /games
router.post("/", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const game = await createGame(req.body);
    res.status(201).json(game);
  } catch (err) {
    res.status(500).json({ error: "Failed to create game" });
  }
});

// GET /games/:id
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const game = await getGameById(req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });
    res.json(game);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch game" });
  }
});

// GET /games/season/:season_id
router.get("/season/:season_id", authenticateUser, async (req, res) => {
  try {
    const games = await getGamesBySeason(req.params.season_id);
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

// GET /games/season/:season_id/team/team_id
router.get("/season/:season_id/team/:team_id", authenticateUser, async (req, res) => {
  try {
    const games = await getGamesByTeam(
      req.params.season_id, 
      req.params.team_id);
    res.json(games);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch games" });
  }
});

// PATCH /games/:id/score
router.patch("/:id/score", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const updated = await updateGameScore({
      game_id: req.params.id,
      home_score: req.body.home_score,
      away_score: req.body.away_score,
      penalty_winner_team_id: req.body.penalty_winner_team_id
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update game score" });
  }
});

export default router;
