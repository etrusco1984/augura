import {
  getPredictionsForQuiniela,
  createPrediction,
  updatePrediction,
} from "../db/predictionsSvc.js";

import { getGamesForQuiniela } from "../db/quinielaDetailsSvc.js";
import pool from "../db/pool.js"; // assuming this is where your pool comes from

export async function getPredictions(req, res) {
  const { quiniela_id } = req.params;
  const user_id = req.user.user_id;

  const client = await pool.connect();

  try {
    // 1. Fetch all games for this quiniela (from the view)
    const games = await getGamesForQuiniela(client, quiniela_id);
    // 2. Fetch this user's predictions for those games
    const predictions = await getPredictionsForQuiniela(
      client,
      quiniela_id,
      user_id
    );

    // 3. Return both datasets together for the prediction screen
    res.json({
      games,
      predictions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch prediction data" });
  } finally {
    client.release();
  }
}

// getGames is no longer needed for the prediction screen and can be removed

export async function savePrediction(req, res) {
  const { prediction_id, game_id, quiniela_id, home_score, away_score } = req.body;
  const user_id = req.user.user_id;

  try {
    if (prediction_id) {
      const updated = await updatePrediction({
        prediction_id,
        home_score,
        away_score,
      });
      res.json({ updated });
    } else {
      const created = await createPrediction({
        user_id,
        game_id,
        quiniela_id,
        home_score,
        away_score,
      });
      res.json({ created });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save prediction" });
  }
}
