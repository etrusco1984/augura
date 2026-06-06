import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { getLeaderboard } from "../db/leaderboardSvc.js";

const router = express.Router();

router.get("/:quiniela_id", authenticateUser, async (req, res) => {
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
