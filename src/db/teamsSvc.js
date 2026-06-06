import pool from "../db/pool.js";

export async function getTeams() {
  const result = await pool.query(
    "SELECT * FROM teams ORDER BY id"
  );
  return result.rows;
}

export async function getTeamById(id) {
  const result = await pool.query(
    "SELECT * FROM teams WHERE team_id = $1",
    [id]
  );
  return result.rows[0];
}

export async function getTeamByName(name) {
  const result = await pool.query(
    "SELECT * FROM teams WHERE name = $1",
    [name]
  );
  return result.rows[0];
}

export async function createTeam({ name, shortname, logo_url }) {
  const result = await pool.query(
    `INSERT INTO teams (name, shortname, logo_url)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, shortname, logo_url]
  );
  return result.rows[0];
}
