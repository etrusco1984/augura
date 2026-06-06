import pool from "../db/pool.js";

export async function getLeaderboard(quiniela_id) {
  const result = await pool.query(
    `SELECT id_jugador AS user_id,
            jugador AS username,
            total_points
     FROM leaderboard_view
     WHERE quiniela_id = $1
     ORDER BY total_points DESC`,
    [quiniela_id]
  );

  return result.rows;
}

export async function getTopLeaders() {
  const result = await pool.query(
    `SELECT 
        id_jugador AS user_id,
        jugador AS username,
        total_points,
        quiniela
     FROM leaderboard_view
     ORDER BY total_points DESC
     LIMIT 4`
  );

  return result.rows;
}
