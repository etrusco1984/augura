import pool from "../db/pool.js";

export async function getCompetitionFormats() {
  const result = await pool.query(
    "SELECT * FROM competition_formats ORDER BY id"
  );
  return result.rows;
}

export async function getCompetitionFormatById(id) {
  const result = await pool.query(
    "SELECT * FROM competition_formats WHERE format_id = $1",
    [id]
  );
  return result.rows[0];
}

export async function getCompetitionFormatByName(name) {
  const result = await pool.query(
    "SELECT * FROM competition_formats WHERE name = $1",
    [name]
  );
  return result.rows[0];
}

export async function createCompetitionFormat({ name, description, legs }) {
  const result = await pool.query(
    `INSERT INTO competition_formats (name, description, legs)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, description, legs]
  );
  return result.rows[0];
}
