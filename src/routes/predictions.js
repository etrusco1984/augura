import express from "express";

import {
  createPrediction,
  getPredictionsForQuiniela,
  getPrediction,
  updatePrediction,
  getLastPredictions,
  getPendingPredictions,
  bulkSavePredictions
} from "../db/predictionsSvc.js";
import { getRoundByGameId } from "../db/roundsSvc.js";

import { getPredictions } from "../controllers/predictionsController.js";

import { t } from "../i18n.js";

const router = express.Router();

/**
 * POST /api/predictions
 * Create a prediction for the authenticated user
 */
router.post("/", async (req, res) => {
  try {
    const {
      predicted_home_score,
      predicted_away_score,
      predicted_penalty_winner_team_id
    } = req.body;

    const userLang = req.user?.language_code || "en";
    const isDraw = predicted_home_score === predicted_away_score;

    if (!isDraw && predicted_penalty_winner_team_id) {
      return res.status(400).json({
        error: t("error.only_draw_can_have_penalties", userLang)
      });
    }

    if (!isDraw) {
      req.body.predicted_penalty_winner_team_id = null;
    }

    const prediction = await createPrediction(
      req.user.user_id,
      req.body.game_id,
      req.body.predicted_home_score,
      req.body.predicted_away_score,
      req.body.predicted_penalty_winner_team_id
    );

    res.status(201).json(prediction);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create prediction" });
  }
});

/**
 * GET /api/predictions/last
 * Get last predictions for authenticated user
 */
router.get("/last", async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const predictions = await getLastPredictions(user_id);

    res.json({
      success: true,
      predictions
    });
  } catch (err) {
    console.error("Error fetching last predictions:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

/**
 * GET /api/predictions/pending
 * Get pending predictions for authenticated user
 */
router.get("/pending", async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const rows = await getPendingPredictions(user_id);

    res.json({ success: true, pending: rows });
  } catch (err) {
    console.error("Error fetching pending predictions:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

/**
 * GET /api/predictions/quiniela/:quiniela_id
 * Get predictions for a quiniela
 */
router.get("/quiniela/:quiniela_id", async (req, res) => {
  try {
    const list = await getPredictionsForQuiniela(req.params.quiniela_id);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch predictions" });
  }
});

/**
 * GET /api/predictions/:quiniela_id/:game_id
 * Get a single prediction for authenticated user
 */
router.get("/:quiniela_id/:game_id", async (req, res) => {
  try {
    const p = await getPrediction(
      req.user.user_id,
      req.params.quiniela_id,
      req.params.game_id
    );
    res.json(p);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch prediction" });
  }
});

/**
 * GET /api/predictions/:quiniela_id
 * Get all predictions for a quiniela for authenticated user
 */
router.get("/:quiniela_id", getPredictions);

/**
 * PATCH /api/predictions
 * Update a prediction
 */
router.patch("/", async (req, res) => {
  try {
    const { 
      prediction_id,
      predicted_home_score,
      predicted_away_score,
      predicted_penalty_winner_team_id,
      round_target
    } = req.body;

    // ⛔ Lock check BEFORE updating
    
    if (new Date(round_target) <= new Date()) {
      return res.status(403).json({ error: "Predictions are locked for this round" });
    }

    const updated = await updatePrediction(
      predicted_home_score,
      predicted_away_score,
      predicted_penalty_winner_team_id,
      prediction_id
    );

    res.json(updated);
  } catch (err) {
    console.error("Failed to update prediction:", err);
    res.status(500).json({ error: "Failed to update prediction" });
  }
});


/**
 * POST /api/predictions/bulk
 * Bulk save predictions
 */
router.post("/bulk", async (req, res) => {
  try {
    const { predictions} = req.body;

    if (!predictions || predictions.length === 0){
      return res.status(400).json({ error: "No predictions provided" });
    }
    // 1. Extract game_id from the first prediction
    const gameId = predictions[0].game_id;  
    // 2. Fetch REAL round info from DB (ignore client data)
    const round = await getRoundByGameId(gameId);

    if (!round) {
      return res.status(400).json({ error: "Round not found" });
    }
    // 3. ⛔ Lock check
    
    const now = new Date();
    const lockDate = new Date(round.route_target);
    
    if (now >= lockDate) {
      return res.status(403).json({ error: "Predictions are locked for this round" });
    }

    // 4. Perform the bulk update
    const results = await bulkSavePredictions(predictions);
    res.json(results);

  } catch (err) {
    console.error("Bulk save failed:", err);
    res.status(500).json({ error: "Bulk save failed" });
  }
});


export default router;
