import pool from "../db/pool.js";
import { scoreGame } from "./scoringEngineSvc.js";

// CREATE GAME
export async function createGame({
  season_id,
  stage_id,
  home_team_id,
  away_team_id,
  match_date,
  target_date,
  status
}) {
  const result = await pool.query(
    `INSERT INTO games (
        season_id,
        stage_id,
        home_team_id,
        away_team_id,
        match_date,
        target_date,
        status
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING game_id, season_id, stage_id, home_team_id, away_team_id,
               match_date, target_date, status`,
    [
      season_id,
      stage_id,
      home_team_id,
      away_team_id,
      match_date,
      target_date,
      status
    ]
  );

  return result.rows[0];
}

// GET GAME BY ID
export async function getGameById(id) {
  const result = await pool.query(
    `SELECT *
     FROM games
     WHERE game_id = $1`,
    [id]
  );
  return result.rows[0];
}

// LIST GAMES BY SEASON
export async function getGamesBySeason(season_id) {
  const result = await pool.query(
    `SELECT *
     FROM games
     WHERE season_id = $1
     ORDER BY match_date`,
    [season_id]
  );
  return result.rows;
}

// LIST GAMES BY TEAM
export async function getGamesByTeam(season_id, team_id) {
  const result = await pool.query(
    `SELECT *
     FROM games
     WHERE season_id = $1
     AND (home_team_id = $2 or away_team_id = $2)
     ORDER BY match_date`,
    [season_id, team_id]
  );
  return result.rows;
}

// UPDATE GAME SCORE (including penalties)
export async function updateGameScore({
  game_id,
  home_score,
  away_score,
  penalty_winner_team_id
}) {
  // 1. Fetch old status
  const oldRes = await pool.query(
    `SELECT status
     FROM games
     WHERE game_id = $1`,
    [game_id]
  );
  const oldStatus = oldRes.rows[0]?.status;

  // 2. Update the game scores
  const result = await pool.query(
    `UPDATE games
     SET home_score = $1,
         away_score = $2,
         penalty_winner_team_id = $3
     WHERE game_id = $4
     RETURNING game_id, season_id, stage_id, home_team_id, away_team_id,
               match_date, status, home_score, away_score,
               penalty_winner_team_id, target_date`,
    [
      home_score,
      away_score,
      penalty_winner_team_id,
      game_id
    ]
  );

  const updatedGame = result.rows[0];

  // 3. Automatic scoring trigger
  if (oldStatus !== "completed" && updatedGame.status === "completed") {
    await scoreGame(game_id);
  }

  return updatedGame;
}

export async function getUpcomingGamesBySeasonIds(seasonIds) {
  const query =
    `SELECT 
      sea.name AS season_name,
      g.game_id,
      g.match_date,
      ht.shortname AS home_team,
      at.shortname AS away_team,
      initcap(stg.name) AS stage_name
    FROM games g
    JOIN teams ht ON g.home_team_id = ht.team_id
    JOIN teams at ON g.away_team_id = at.team_id
    JOIN stages stg ON g.stage_id = stg.stage_id
    JOIN seasons sea ON g.season_id = sea.season_id
    WHERE g.season_id = ANY($1::int[])
      AND g.match_date >= NOW()
      AND LOWER(g.status)= 'scheduled'
    ORDER BY g.match_date
    LIMIT 3;`;
  
  const pgArray = `{${seasonIds.join(",")}}`;
  const result = await pool.query(query, [seasonIds]);
  return result.rows;
}

export async function getLastResultsBySeason(season_id) {
  const query = `
    SELECT 
      q."name" as quiniela_name,
      s.name,
      g.game_id,
      g.match_date,
      ht.shortname AS home_team,
      at.shortname AS away_team,
      g.home_score,
      g.away_score,
      stg.name as stage_name
    FROM games g
    JOIN teams ht ON g.home_team_id = ht.team_id
    JOIN teams at ON g.away_team_id = at.team_id
    JOIN stages stg ON g.stage_id = stg.stage_id
    JOIN seasons s ON g.season_id = s.season_id
    JOIN quinielas q ON q.season_id = s.season_id 
    WHERE g.season_id = ANY($1)
      AND g.home_score IS NOT NULL
      AND g.away_score IS NOT NULL
    ORDER BY g.match_date DESC
    LIMIT 3;
  `;
  const result = await pool.query(query, [season_id]);
  return result.rows;
}