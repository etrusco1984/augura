import pool from "../db/pool.js";

export async function getStagesBySeason(seasonId) {
  const result = await pool.query(
    `SELECT * FROM stages
     WHERE season_id = $1
     ORDER BY id`,
    [seasonId]
  );
  return result.rows;
}

export async function getStageById(id) {
  const result = await pool.query(
    "SELECT * FROM stages WHERE stage_id = $1",
    [id]
  );
  return result.rows[0];
}

export async function getStageByName(name) {
  const result = await pool.query(
    "SELECT * FROM stages WHERE name = $1",
    [name]
  );
  return result.rows[0];
}

export async function createStage({ season_id, name, format_id, order_index }) {
  const result = await pool.query(
    `INSERT INTO stages (season_id, name, format_id, order_index)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [season_id, name, format_id, order_index]
  );
  return result.rows[0];
}
