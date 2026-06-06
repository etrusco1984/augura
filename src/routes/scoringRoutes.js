import express from "express";
import { authenticateUser, requireRole } from "../middleware/authMiddleware.js";
import { scoreGame, scoreSeason, scoreQuiniela } from "../db/scoringEngineSvc.js";

const router = express.Router();

// ---------------------------------------------
// POST /scoring/game/:game_id
// ---------------------------------------------
router.post("/game/:game_id", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const { game_id } = req.params;
    const result = await scoreGame(game_id);

    res.json({
      success: true,
      game_id,
      result
    });
  } catch (err) {
    console.error("Error scoring game:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ---------------------------------------------
// POST /scoring/season/:season_id
// ---------------------------------------------
router.post("/season/:season_id", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const { season_id } = req.params;
    const result = await scoreSeason(season_id);

    res.json({
      success: true,
      season_id,
      result
    });
  } catch (err) {
    console.error("Error scoring season:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// ---------------------------------------------
// POST /scoring/quiniela/:quiniela_id
// ---------------------------------------------
router.post("/quiniela/:quiniela_id", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const { quiniela_id } = req.params;
    const result = await scoreQuiniela(quiniela_id);

    res.json({
      success: true,
      quiniela_id,
      result
    });
  } catch (err) {
    console.error("Error scoring quiniela:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
