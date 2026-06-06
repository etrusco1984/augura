import pool from "../db/pool.js";

export async function getCompetitions() {
  const result = await pool.query(
    "SELECT * FROM competitions ORDER BY id"
  );
  return result.rows;
}

export async function getCompetitionById(id) {
  const result = await pool.query(
    "SELECT * FROM competitions WHERE competition_id = $1",
    [id]
  );
  return result.rows[0];
}

export async function getCompetitionByName(name) {
  const result = await pool.query(
    "SELECT * FROM competitions WHERE name = $1",
    [name]
  );
  return result.rows[0];
}

export async function createCompetition({ name, display_name }) {
  const result = await pool.query(
    `INSERT INTO competitions (name, display_name)
     VALUES ($1, $2)
     RETURNING *`,
    [name, display_name]
  );
  return result.rows[0];
}
