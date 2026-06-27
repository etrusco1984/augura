import pool from "../db/pool.js";

export async function getRoundByGameId(gameId) {
  const result = await pool.query(
    `SELECT round_id, route_target
     FROM v_quiniela_games
     WHERE game_id = $1
     LIMIT 1`,
    [gameId]
  );
  return result.rows[0]||null;
}
