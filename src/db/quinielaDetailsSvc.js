import pool from "./pool.js";

export async function getRecentResults(client, userId, quinielaId) {
  const sql = `
    SELECT 
      g.game_id,
      ht.name AS home_team,
      at.name AS away_team,
      pkt.name AS pk_winner,
      g.home_score,
      g.away_score,
      g.match_date,
      pt.points
    FROM games g
    JOIN seasons s 
      ON g.season_id = s.season_id
    JOIN teams ht 
      ON g.home_team_id = ht.team_id
    JOIN teams at 
      ON g.away_team_id = at.team_id
    LEFT JOIN teams pkt 
      ON g.penalty_winner_team_id =pkt.team_id 
    JOIN quinielas q 
      ON q.season_id = s.season_id
    LEFT JOIN points pt 
      ON pt.game_id = g.game_id
      AND pt.user_id = $1
    WHERE q.quiniela_id = $2
      AND g.home_score IS NOT NULL
      AND g.away_score IS NOT NULL
    ORDER BY g.match_date DESC
    LIMIT 5;
  `;

  const {rows} = await client.query(sql, [userId, quinielaId]);
  return rows;
}

export async function getQuinielaBaseInfo(client, quinielaId) {
  const sql = `
    SELECT 
      q.quiniela_id,
      q.name,
      q.is_active,
      s.season_id,
      s.name AS season_name
    FROM quinielas q
    JOIN seasons s 
      ON q.season_id = s.season_id
    WHERE q.quiniela_id = $1
  `;

  const {rows} = await client.query(sql, [quinielaId]);
  return rows[0] || null;
}

export async function getUserParticipation(client, quinielaId, userId) {
  const sql = `
    SELECT 
      u.user_id,
      u.username,
      qp.joined_at
    FROM users u
    JOIN quiniela_participants qp
      ON qp.user_id = u.user_id
    WHERE qp.quiniela_id = $1
      AND qp.user_id = $2
  `;

  const {rows} = await client.query(sql, [quinielaId, userId]);
  return rows[0] || null;
}

export async function getNextMatches(client, quinielaId) {
  const sql = `
    SELECT
      g.game_id,
      th.name AS home_team,
      ta.name AS away_team,
      g.match_date AS kickoff_at,
      s."name"  as stage_name
    FROM games g
    JOIN quinielas q 
      ON g.season_id = q.season_id 
    JOIN teams th
      ON g.home_team_id = th.team_id
    JOIN teams ta
      ON g.away_team_id = ta.team_id
    JOIN stages s
      ON g.stage_id = s.stage_id
    WHERE q.quiniela_id = $1
      AND g.match_date > NOW()
      AND g.status = 'scheduled'
    ORDER BY g.match_date ASC
    LIMIT 5
  `;

  const {rows} = await client.query(sql, [quinielaId]);
  return rows;
}

export async function getUserPredictions(client,quinielaId, userId) {
  const sql = `
    SELECT
      g.game_id,
      th.name AS home_team,
      ta.name AS away_team,
      g.match_date AS kickoff_at,
      p.predicted_home_score AS home_score_pred,
      p.predicted_away_score AS away_score_pred,
      initcap(g.status) AS game_status,
      s."name"  as stage_name
    FROM games g
    JOIN quinielas q
      ON g.season_id = q.season_id
    JOIN teams th
      ON g.home_team_id = th.team_id
    JOIN teams ta
      ON g.away_team_id = ta.team_id
    JOIN stages s
      ON g.stage_id = s.stage_id
    LEFT JOIN predictions p
      ON p.game_id = g.game_id
      AND p.user_id = $2
      AND p.quiniela_id = q.quiniela_id
    WHERE q.quiniela_id = $1
    ORDER BY g.match_date DESC
    LIMIT 5
  `;
  const {rows} = await client.query(sql, [quinielaId, userId]);
  return rows;
}

// Get users in the quiniela leaderboard, along with their total points and breakdown of hits
export async function getLeaderboard(client, quinielaId) {
  const sql = `
    SELECT
      u.user_id,
      case
	      when strpos(u.username, ' ')=0 then u.username
	      else
	      substring(u.username,1,strpos(u.username, ' ')-1) ||' ' || substring(u.username,strpos(u.username, ' ')+1,1)
	    end as username,
      COALESCE(SUM(pt.points), 0) AS total_points,
      COUNT(pt.game_id) AS games_played,
      COUNT(*) FILTER (WHERE pt.is_exact_score) AS exact_hits,
      COUNT(*) FILTER (WHERE pt.is_correct_winner) AS winner_hits,
      COUNT(*) FILTER (WHERE pt.is_correct_penalty) AS penalty_hits
      FROM quiniela_participants qp
      JOIN users u
        ON u.user_id = qp.user_id
      LEFT JOIN points pt
        ON pt.quiniela_id = qp.quiniela_id
        AND pt.user_id = qp.user_id
      WHERE qp.quiniela_id = $1
      GROUP BY u.user_id, u.username
      ORDER BY total_points DESC, exact_hits DESC, winner_hits DESC
  `;
  const {rows} = await client.query(sql, [quinielaId]);

  return rows;
}

// Get all quinielas that a user is participating in, along with their current points and rank
export async function getUserQuinielasFromDB(client, userId) {
  const sql = `
    SELECT 
      q.quiniela_id,
      q.name AS quiniela_name,
      s.name AS season_name,
      q.is_active,
      q.created_at,
      lv.total_points,
      lv.user_rank,
      (
        SELECT COUNT(*) 
        FROM quiniela_participants 
        WHERE quiniela_id = q.quiniela_id
      ) AS players_count
    FROM quinielas q
    JOIN seasons s ON q.season_id = s.season_id
    JOIN quiniela_participants qp ON qp.quiniela_id = q.quiniela_id
    LEFT JOIN leaderboard_view lv 
      ON q.quiniela_id = lv.quiniela_id  
     AND qp.user_id = lv.id_jugador
    WHERE qp.user_id = $1
    ORDER BY q.created_at DESC;
  `;
  const {rows} = await client.query(sql, [userId]);
  return rows;
}

// GET ALL GAMES FOR A QUINIELA (from the view)
export async function getGamesForQuiniela(client, quiniela_id) {
  const sql = await client.query(
    `SELECT *
     FROM v_quiniela_games
     WHERE quiniela_id = $1
     ORDER BY match_date ASC`,
    [quiniela_id]
  );
  return sql.rows;
}