import pool from "../db/pool.js";

// Create a prediction
export async function createPrediction(user_id, game_id, predicted_home_score, predicted_away_score, predicted_penalty_winner_team_id, quiniela_id) {
  const result = await pool.query(
    `INSERT INTO predictions (user_id, game_id, predicted_home_score, predicted_away_score, predicted_penalty_winner_team_id, quiniela_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [user_id, game_id, predicted_home_score, predicted_away_score, predicted_penalty_winner_team_id, quiniela_id]
  );
  return result.rows[0];
}

// Update an existing prediction
export async function updatePrediction(predicted_home_score, predicted_away_score, predicted_penalty_winner_team_id, prediction_id) {
  
  const result = await pool.query(
    `UPDATE predictions
     SET predicted_home_score = $1,
         predicted_away_score = $2,
         predicted_penalty_winner_team_id = $3,
         updated_at=NOW()
     WHERE prediction_id = $4
     RETURNING *`,
    [predicted_home_score, predicted_away_score, predicted_penalty_winner_team_id, prediction_id]
  );
  return result.rows[0];
}

// Get a single prediction for a user + match
export async function getPrediction(user_id, match_id) {
  const result = await pool.query(
    `SELECT * FROM predictions
     WHERE user_id = $1 AND match_id = $2`,
    [user_id, match_id]
  );
  return result.rows[0];
}

// Get all predictions for a quiniela
export async function getPredictionsForQuiniela(client, quiniela_id, user_id) {
  let sql, params;

  if (!user_id) {
    sql = `
      SELECT p.*, initcap(u.username) AS username, g.home_team_id, g.away_team_id
      FROM predictions p
      JOIN users u ON p.user_id = u.user_id
      JOIN games g ON p.game_id = g.game_id
      WHERE p.quiniela_id = $1
      ORDER BY g.game_id, u.username ASC
    `;
    params = [quiniela_id];
  } else {
    sql = `
      SELECT p.*, initcap(u.username) AS username, g.home_team_id, g.away_team_id
      FROM predictions p
      JOIN users u ON p.user_id = u.user_id
      JOIN games g ON p.game_id = g.game_id
      WHERE p.quiniela_id = $1 AND p.user_id = $2
      ORDER BY g.game_id, u.username ASC
    `;
    params = [quiniela_id, user_id];
  }

  const { rows } = await client.query(sql, params);
  return rows;
}


export async function getLastPredictions(user_id) {
  const result = await pool.query(
    `SELECT 
        p.prediction_id,
        p.predicted_home_score AS predicted_home,
        p.predicted_away_score AS predicted_away,
        p.predicted_penalty_winner_team_id AS predicted_pk,
        pkt."name"  AS predicted_pk_winner,
        g.game_id,
        ht.shortname AS home_team,
        at.shortname AS away_team,
        g.home_score AS actual_home,
        g.away_score AS actual_away,
        g.match_date,
        s."name"  AS season,
        pts.points
     FROM predictions p
     JOIN games g ON p.game_id  = g.game_id 
     JOIN teams ht ON g.home_team_id = ht.team_id 
     JOIN teams at ON g.away_team_id = at.team_id
     LEFT JOIN teams pkt ON p.predicted_penalty_winner_team_id = pkt.team_id
     JOIN seasons s ON g.season_id = s.season_id 
     LEFT JOIN points pts ON pts.prediction_id = p.prediction_id
     WHERE p.user_id = $1
     ORDER BY g.match_date DESC
     LIMIT 3`,
    [user_id]
  );
  return result.rows;
}

export async function getPendingPredictions(user_id) {
  const result = await pool.query(
    `SELECT 
        g.game_id,
        g.match_date,
        g.home_team_id,
        g.away_team_id,
        ht.shortname AS home_team,
        at.shortname AS away_team,
        s.name AS season
     FROM games g
     JOIN teams ht ON g.home_team_id = ht.team_id
     JOIN teams at ON g.away_team_id = at.team_id
     JOIN seasons s ON g.season_id = s.season_id
     LEFT JOIN predictions p
       ON p.game_id = g.game_id
      AND p.user_id = $1
     WHERE p.prediction_id IS NULL
       AND g.status = 'scheduled'
     ORDER BY g.match_date ASC
     LIMIT 3`,
    [user_id]
  );

  return result.rows;
}

export async function bulkSavePredictions(predictions) {
  const results = [];
  for (const p of predictions) {
    let saved;

    if (p.prediction_id) {
      saved = await updatePrediction(
        p.predicted_home_score,
        p.predicted_away_score,
        p.predicted_penalty_winner_team_id,
        p.prediction_id
      );
    } else {
      saved = await createPrediction(
        p.user_id,
        p.game_id,
        p.predicted_home_score,
        p.predicted_away_score,
        p.predicted_penalty_winner_team_id,
        p.quiniela_id
      );
    }

    results.push({
      game_id: p.game_id,
      prediction_id: saved.prediction_id
    });
  }

  return results;
}
