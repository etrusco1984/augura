import express from "express";
import { getLeaderboard, getTopLeaders } from "../db/leaderboardSvc.js";

const router = express.Router();

// GET /leaderboard/top
router.get("/top", async (req, res) => {
  try {
    const leaders = await getTopLeaders();

    res.json({
      success: true,
      leaders
    });
  } catch (err) {
    console.error("Error fetching top leaders:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// GET /leaderboard/:quiniela_id
router.get("/:quiniela_id", async (req, res) => {
  try {
    const { quiniela_id } = req.params;
    const leaderboard = await getLeaderboard(quiniela_id);

    res.json({
      success: true,
      quiniela_id,
      leaderboard
    });
  } catch (err) {
    console.error("Error fetching leaderboard:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

export default router;
