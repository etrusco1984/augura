import pool from "../db/pool.js";
import crypto from "crypto";

// CREATE INVITATION
export async function createInvitation({
  quiniela_id,
  email,
  role_id,
  invited_by_user_id
}) {
  const token = crypto.randomBytes(32).toString("hex");

  const result = await pool.query(
    `INSERT INTO invitations (
        quiniela_id,
        email,
        role_id,
        token,
        status,
        invited_by
     )
     VALUES ($1, $2, $3, $4, 'pending', $5)
     RETURNING invitation_id, quiniela_id, email, role_id,
               token, status, invited_by_user_id, created_at`,
    [quiniela_id, email, role_id, token, invited_by_user_id]
  );

  return result.rows[0];
}

// GET ALL INVITATIONS FOR A QUINIELA
export async function getInvitationsForQuiniela(quiniela_id) {
  const result = await pool.query(
    `SELECT i.*, r.name AS role_name, u.username AS invited_by
     FROM invitations i
     JOIN roles r ON i.role_id = r.role_id
     LEFT JOIN users u ON i.invited_by_user_id = u.user_id
     WHERE i.quiniela_id = $1
     ORDER BY i.created_at DESC`,
    [quiniela_id]
  );

  return result.rows;
}

// GET INVITATION BY TOKEN
export async function getInvitationByToken(token) {
  const result = await pool.query(
    `SELECT *
     FROM invitations
     WHERE token = $1`,
    [token]
  );

  return result.rows[0];
}

// MARK INVITATION AS ACCEPTED
export async function acceptInvitation(token) {
  const result = await pool.query(
    `UPDATE invitations
     SET status = 'accepted',
         accepted_at = NOW()
     WHERE token = $1
     RETURNING invitation_id, quiniela_id, email, role_id,
               status, accepted_at`,
    [token]
  );

  return result.rows[0];
}
