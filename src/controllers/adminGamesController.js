// src/controllers/adminGamesController.js
import {
  getAdminSeasons,
  getAdminGamesBySeason,
  adminUpdateGameScore,
  adminUpdateGameMetadata
} from "../db/adminGamesSvc.js";

/**
 * GET /api/admin/seasons
 * List all seasons grouped by quiniela for admin overview
 */
export async function getAllAdminSeasons(req, res) {
  try {
    const seasons = await getAdminSeasons();
    res.json(seasons);
  } catch (error) {
    console.error("ERROR IN /api/admin/seasons:", error);
    res.status(500).json({ error: "Failed to fetch admin seasons" });
  }
}

/**
 * GET /api/admin/games/:seasonId
 * List all games for a given season (admin view)
 */
export async function getAdminGames(req, res) {
  try {
    const { seasonId } = req.params;
    const games = await getAdminGamesBySeason(seasonId);
    res.json(games);
  } catch (error) {
    console.error("ERROR IN /api/admin/games/:seasonId:", error);
    res.status(500).json({ error: "Failed to fetch admin games" });
  }
}

/**
 * PATCH /api/admin/games/:id/score
 * Update game score (admin version)
 */
export async function updateAdminGameScore(req, res) {
  try {
    const { id } = req.params;
    const { home_score, away_score, penalty_winner_team_id } = req.body;

    const updated = await adminUpdateGameScore({
      game_id: id,
      home_score,
      away_score,
      penalty_winner_team_id
    });
    
    res.json(updated);
  } catch (error) {
    console.error("ERROR IN /api/admin/games/:id/score:", error);
    res.status(500).json({ error: "Failed to update admin game score" });
  }
}

/**
 * PATCH /api/admin/games/:id/metadata
 * Update game metadata (stage, date, status)
 */
export async function updateAdminGameMetadata(req, res) {
  try {
    const { id } = req.params;
    const { stage_id, match_date, target_date, status } = req.body;

    const updated = await adminUpdateGameMetadata({
      game_id: id,
      stage_id,
      match_date,
      target_date,
      status
    });

    res.json(updated);
  } catch (error) {
    console.error("ERROR IN /api/admin/games/:id/metadata:", error);
    res.status(500).json({ error: "Failed to update admin game metadata" });
  }
}
