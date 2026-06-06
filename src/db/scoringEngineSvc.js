import pool from "../db/pool.js";
import { updatePoints, insertPoints } from "./pointsSvc.js";
import { calculatePoints } from "../helpers/scoringHelpers.js";

export async function scoreGame(game_id) {
  // 1. Fetch game + scoring rule id
  const gameRes = await pool.query(
    `SELECT g.*, s.scoring_rule_id
     FROM games g
     JOIN stages s ON g.stage_id = s.stage_id
     WHERE g.game_id = $1`,
    [game_id]
  );

  const game = gameRes.rows[0];
  if (!game) throw new Error("Game not found");

  // SAFETY CHECK 1: Game must be completed
  if (game.status !== "finished") {
    return { skipped: true, reason: "Game not completed" };
  }

  // SAFETY CHECK 2: Game must have scores
  if (game.home_score === null || game.away_score === null) {
    return { skipped: true, reason: "Game has no score" };
  }

  // 2. Fetch scoring rule
  const ruleRes = await pool.query(
    `SELECT *
     FROM scoring_rules
     WHERE rule_id = $1`,
    [game.scoring_rule_id]
  );

  const rule = ruleRes.rows[0];
  if (!rule) throw new Error("Scoring rule not found");

  // SAFETY CHECK 3: Penalty winner required but missing
  if (rule.use_penalty_winner && !game.penalty_winner_team_id) {
    return { skipped: true, reason: "Penalty winner required but missing" };
  }

  // 3. Fetch predictions
  const predsRes = await pool.query(
    `SELECT *
     FROM predictions
     WHERE game_id = $1`,
    [game_id]
  );

  const predictions = predsRes.rows;

  let totalPointsAssigned = 0;

  // 4. Score each prediction
  for (const p of predictions) {
    const points = calculatePoints(p, game, rule);
    totalPointsAssigned += points;

    // 5. Insert or update points (idempotent)
    const existing = await pool.query(
      `SELECT point_id FROM points WHERE prediction_id = $1`,
      [p.prediction_id]
    );

    if (existing.rows.length > 0) {
      await updatePoints({
        prediction_id: p.prediction_id,
        points
      });
    } else {
      await insertPoints({
        prediction_id: p.prediction_id,
        points,
        quiniela_id: p.quiniela_id,
        user_id: p.user_id,
        game_id: p.game_id
      });
    }
  }

  return {
    success: true,
    game_id,
    predictions_scored: predictions.length,
    total_points_assigned: totalPointsAssigned
  };
}

export async function scoreSeason(season_id) {
  // 1. Fetch all games in the season
  const gamesRes = await pool.query(
    `SELECT game_id
     FROM games
     WHERE season_id = $1
     ORDER BY kickoff_time ASC`,
    [season_id]
  );

  const games = gamesRes.rows;

  if (games.length === 0) {
    return { success: false, reason: "No games found for this season" };
  }

  const results = [];
  let totalGamesScored = 0;

  // 2. Score each game
  for (const g of games) {
    const result = await scoreGame(g.game_id);
    results.push({ game_id: g.game_id, ...result });

    if (result.success) {
      totalGamesScored++;
    }
  }

  // 3. Return summary
  return {
    success: true,
    season_id,
    total_games: games.length,
    games_scored: totalGamesScored,
    details: results
  };
}

export async function scoreQuiniela(quiniela_id) {
  // 1. Fetch all games that have predictions in this quiniela
  const gamesRes = await pool.query(
    `SELECT DISTINCT game_id
     FROM predictions
     WHERE quiniela_id = $1
     ORDER BY game_id ASC`,
    [quiniela_id]
  );

  const games = gamesRes.rows;

  if (games.length === 0) {
    return { success: false, reason: "No predictions found for this quiniela" };
  }

  const results = [];
  let totalGamesScored = 0;

  // 2. Score each game
  for (const g of games) {
    const result = await scoreGame(g.game_id);
    results.push({ game_id: g.game_id, ...result });

    if (result.success) {
      totalGamesScored++;
    }
  }

  // 3. Return summary
  return {
    success: true,
    quiniela_id,
    total_games: games.length,
    games_scored: totalGamesScored,
    details: results
  };
}
