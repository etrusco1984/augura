// src/services/adminGamesSvc.js
import pool from "../db/pool.js";

/**
 * Get all seasons for admin dropdowns / overview
 */
export async function getAdminSeasons() {
    const query = `
    SELECT 
      q.quiniela_id,
      q.name AS quiniela_name,
      s.season_id,
      s.name AS season_name,
      q.is_active,
      q.created_at
    FROM seasons s
    JOIN quinielas q ON s.season_id = q.season_id
    ORDER BY q.created_at DESC;
  `;


    const { rows } = await pool.query(query);
    return rows;
}

/**
 * Get all games for a season with JOINs for team names and stage names
 */
export async function getAdminGamesBySeason(seasonId) {
    const query = `
    SELECT *
    FROM v_quiniela_games
    WHERE season_id = $1
    ORDER BY match_date ASC
  `;

    const { rows } = await pool.query(query, [seasonId]);
    return rows;
}

/**
 * Update game score (admin version — NO scoring engine trigger)
 */
export async function adminUpdateGameScore({
    game_id,
    home_score,
    away_score,
    penalty_winner_team_id
}) {
    const query = `UPDATE games
    SET 
      home_score = $1,
      away_score = $2,
      penalty_winner_team_id = $3,
      status = 'finished'
    WHERE game_id = $4
    RETURNING 
      game_id, season_id, stage_id,
      home_team_id, away_team_id,
      match_date, target_date, status,
      home_score, away_score, penalty_winner_team_id
  `;

    const params = [
        home_score,
        away_score,
        penalty_winner_team_id,
        game_id
    ];

    const { rows } = await pool.query(query, params);
    const enriched = await pool.query(
        `SELECT * FROM v_quiniela_games WHERE game_id = $1`,
        [rows[0].game_id]
    );
    return enriched.rows[0];
}

/**
 * Update game metadata (stage, date, status, etc.)
 */
export async function adminUpdateGameMetadata({
    game_id,
    stage_id,
    match_date,
    target_date,
    status
}) {
    const query = `UPDATE games
    SET 
      stage_id = COALESCE($1, stage_id),
      match_date = COALESCE($2, match_date),
      target_date = COALESCE($3, target_date),
      status = COALESCE($4, status)
    WHERE game_id = $5
    RETURNING *
  `;

    const params = [
        stage_id,
        match_date,
        target_date,
        status,
        game_id
    ];

    const { rows } = await pool.query(query, params);
    return rows[0];
}
