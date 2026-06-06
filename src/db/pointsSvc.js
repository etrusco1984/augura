import pool from "./pool.js";

// INSERT POINTS (used after scoring a game)
export async function insertPoints({
  prediction_id,
  points,
  quiniela_id,
  user_id,
  game_id
}) {
  const result = await pool.query(
    `INSERT INTO points (
        prediction_id,
        points,
        quiniela_id,
        user_id,
        game_id
     )
     VALUES ($1, $2, $3, $4, $5)
     RETURNING point_id, prediction_id, points,
               quiniela_id, user_id, game_id, calculated_at`,
    [prediction_id, points, quiniela_id, user_id, game_id]
  );

  return result.rows[0];
}

// UPDATE POINTS (if recalculated)
export async function updatePoints({
  prediction_id,
  points
}) {
  const result = await pool.query(
    `UPDATE points
     SET points = $1,
         calculated_at = NOW()
     WHERE prediction_id = $2
     RETURNING point_id, prediction_id, points,
               quiniela_id, user_id, game_id, calculated_at`,
    [points, prediction_id]
  );

  return result.rows[0];
}

// GET ALL POINTS FOR A QUINIELA
export async function getPointsForQuiniela(quiniela_id) {
  const result = await pool.query(
    `SELECT *
     FROM points
     WHERE quiniela_id = $1
     ORDER BY user_id, game_id`,
    [quiniela_id]
  );

  return result.rows;
}

// GET ALL POINTS FOR A USER IN A QUINIELA
export async function getPointsForUser(quiniela_id, user_id) {
  const result = await pool.query(
    `SELECT *
     FROM points
     WHERE quiniela_id = $1
       AND user_id = $2
     ORDER BY game_id`,
    [quiniela_id, user_id]
  );

  return result.rows;
}

// GET POINTS FOR A SPECIFIC GAME
export async function getPointsForGame(quiniela_id, game_id) {
  const result = await pool.query(
    `SELECT *
     FROM points
     WHERE quiniela_id = $1
       AND game_id = $2
     ORDER BY user_id`,
    [quiniela_id, game_id]
  );

  return result.rows;
}

export async function getTotalPointsForUser(user_id) {
  const result = await pool.query(
    `SELECT 
        q.quiniela_id,
        q.name AS quiniela_name,
        COALESCE(SUM(p.points), 0) AS total_points
     FROM quinielas q
     LEFT JOIN predictions pr ON pr.quiniela_id = q.quiniela_id
     LEFT JOIN points p ON p.prediction_id = pr.prediction_id
     WHERE pr.user_id = $1
     GROUP BY q.quiniela_id, q.name
     ORDER BY q.name`,
    [user_id]
  );

  return result.rows;
}
