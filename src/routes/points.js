import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  insertPoints,
  updatePoints,
  getPointsForQuiniela,
  getPointsForUser,
  getPointsForGame,
  getTotalPointsForUser
} from "../db/pointsSvc.js";

const router = express.Router();

// POST /points
router.post("/", authenticateUser, async (req, res) => {
  try {
    const p = await insertPoints(req.body);
    res.status(201).json(p);
  } catch (err) {
    res.status(500).json({ error: "Failed to insert points" });
  }
});

// PATCH /points
router.patch("/", authenticateUser, async (req, res) => {
  try {
    const updated = await updatePoints(req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update points" });
  }
});

// GET /points/quiniela/:quiniela_id
router.get("/quiniela/:quiniela_id", authenticateUser, async (req, res) => {
  try {
    const list = await getPointsForQuiniela(req.params.quiniela_id);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch points" });
  }
});

// GET /points/quiniela/:quiniela_id/user/:user_id
router.get("/quiniela/:quiniela_id/user/:user_id", authenticateUser, async (req, res) => {
  try {
    const list = await getPointsForUser(
      req.params.quiniela_id,
      req.params.user_id
    );
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user points" });
  }
});

// GET /points/user/:user_id
router.get("/user/:user_id", authenticateUser, async (req, res) => {
  try {
    const rows = await getTotalPointsForUser(req.params.user_id);
    res.json({ success: true, points: rows });
  } catch (err) {
    console.error("Error fetching total points:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /points/quiniela/:quiniela_id/game/:game_id
router.get("/quiniela/:quiniela_id/game/:game_id", authenticateUser, async (req, res) => {
  try {
    const list = await getPointsForGame(
      req.params.quiniela_id,
      req.params.game_id
    );
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch game points" });
  }
});

export default router;
