import pool from "./pool.js";

export async function createQuiniela({ season_id, name }) {
  const result = await pool.query(
    `INSERT INTO quinielas (season_id, name)
     VALUES ($1, $2)
     RETURNING quiniela_id, season_id, name, created_at, is_active`,
    [season_id, name]
  );
  return result.rows[0];
}

export async function getQuinielaById(id) {
  const result = await pool.query(
    `SELECT * FROM quinielas WHERE quiniela_id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function getQuinielasBySeason(season_id) {
  const result = await pool.query(
    `SELECT * FROM quinielas
     WHERE season_id = $1
     ORDER BY created_at`,
    [season_id]
  );
  return result.rows;
}

export async function deactivateQuiniela(id) {
  const result = await pool.query(
    `UPDATE quinielas
     SET is_active = FALSE
     WHERE quiniela_id = $1
     RETURNING quiniela_id, name, is_active`,
    [id]
  );
  return result.rows[0];
}

export async function getSeasonByQuiniela(id_quiniela) {
  const result = await pool.query(
    `SELECT season_id
    FROM quinielas
    WHERE quiniela_id=$1;`,
    [id_quiniela]
  );
  return result.rows[0];
}

export async function getUserQuinielas(userId) {
  const query = `
    SELECT 
      q.quiniela_id,
      q.name AS quiniela_name,
      s.name AS season_name,
      q.is_active,
      lv.total_points AS user_points,
      lv.jugador
    FROM quinielas q
    JOIN seasons s 
      ON s.season_id = q.season_id
    JOIN quiniela_participants qp 
      ON qp.quiniela_id = q.quiniela_id
    LEFT JOIN leaderboard_view lv  
      ON lv.quiniela_id = q.quiniela_id 
     AND lv.id_jugador = $1
    WHERE qp.user_id = $1
    ORDER BY q.quiniela_id ASC;
  `;

  const result = await pool.query(query, [userId]);
  return result.rows;
}