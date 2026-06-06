import pool from "./pool.js";

export async function getTeamsBySeason(seasonId) {
  const result = await pool.query(
    `SELECT ts.*, t.name, t.shortname, t.logo_url
     FROM team_seasons ts
     JOIN teams t ON ts.team_id = t.id
     WHERE ts.season_id = $1
     ORDER BY t.name`,
    [seasonId]
  );
  return result.rows;
}

export async function getTeamSeasonById(id) {
  const result = await pool.query(
    "SELECT * FROM team_seasons WHERE ts_id = $1",
    [id]
  );
  return result.rows[0];
}

export async function createTeamSeason({ team_id, season_id }) {
  const result = await pool.query(
    `INSERT INTO team_seasons (team_id, season_id)
     VALUES ($1, $2)
     RETURNING *`,
    [team_id, season_id]
  );
  return result.rows[0];
}
