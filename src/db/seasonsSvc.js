import pool from "../db/pool.js";

export async function getSeasonsByCompetition(competitionId) {
  const result = await pool.query(
    `SELECT * FROM seasons
     WHERE competition_id = $1
     ORDER BY season_id`,
    [competitionId]
  );
  return result.rows;
}

export async function getSeasonById(id) {
  const result = await pool.query(
    "SELECT * FROM seasons WHERE season_id = $1",
    [id]
  );
  return result.rows[0];
}

export async function getSeasonByName(name) {
  const result = await pool.query(
    "SELECT * FROM seasons WHERE name = $1",
    [name]
  );
  return result.rows[0];
}

export async function createSeason({ competition_id, name, start_date, end_date }) {
  const result = await pool.query(
    `INSERT INTO seasons (competition_id, name, start_date, end_date)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [competition_id, name, start_date, end_date]
  );
  return result.rows[0];
}
