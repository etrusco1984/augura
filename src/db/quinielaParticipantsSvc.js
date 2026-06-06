import pool from "../db/pool.js";

export async function addParticipant(quiniela_id, user_id, role_id) {
  const result = await pool.query(
    `INSERT INTO quiniela_participants (quiniela_id, user_id, role_id)
     VALUES ($1, $2, $3)
     RETURNING participants_id, quiniela_id, user_id, role_id, joined_at`,
    [quiniela_id, user_id, role_id]
  );
  return result.rows[0];
}

export async function getParticipants(quiniela_id) {
  const result = await pool.query(
    `SELECT qp.participants_id,
            qp.quiniela_id,
            qp.user_id,
            qp.role_id,
            qp.joined_at,
            u.username,
            u.email,
            r.role_name
     FROM quiniela_participants qp
     JOIN users u ON qp.user_id = u.user_id
     JOIN roles r ON qp.role_id = r.role_id
     WHERE qp.quiniela_id = $1
     ORDER BY qp.joined_at`,
    [quiniela_id]
  );
  return result.rows;
}

export async function removeParticipant(quiniela_id, user_id) {
  const result = await pool.query(
    `DELETE FROM quiniela_participants
     WHERE quiniela_id = $1 AND user_id = $2
     RETURNING participants_id`,
    [quiniela_id, user_id]
  );
  return result.rows[0];
}

export async function getUserQuinielas(userId) {
  const rows = await pool.query(
    `SELECT q.quiniela_id, q.name
    FROM quinielas q
    JOIN quiniela_participants qp ON qp.quiniela_id = q.quiniela_id
    WHERE qp.user_id = $1`,
    [userId]
  );

  return rows.rows; // [{ quiniela_id, name }, ...]
}
