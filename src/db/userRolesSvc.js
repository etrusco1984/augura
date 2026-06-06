import pool from "../db/pool.js";

// ASSIGN ROLE
export async function assignUserRole({ user_id, role_id, quiniela_id }) {
  const result = await pool.query(
    `INSERT INTO user_roles (user_id, role_id, quiniela_id)
     VALUES ($1, $2, $3)
     RETURNING user_role_id, user_id, role_id, quiniela_id, assigned_at`,
    [user_id, role_id, quiniela_id]
  );

  return result.rows[0];
}

// GET ROLES FOR A USER
export async function getUserRoles(user_id) {
  const result = await pool.query(
    `SELECT ur.*, r.name AS role_name, r.description
     FROM user_roles ur
     JOIN roles r ON ur.role_id = r.role_id
     WHERE ur.user_id = $1
     ORDER BY ur.assigned_at DESC`,
    [user_id]
  );

  return result.rows;
}

// GET ROLES FOR A USER IN A SPECIFIC QUINIELA
export async function getUserRolesInQuiniela(user_id, quiniela_id) {
  const result = await pool.query(
    `SELECT ur.*, r.name AS role_name, r.description
     FROM user_roles ur
     JOIN roles r ON ur.role_id = r.role_id
     WHERE ur.user_id = $1 AND ur.quiniela_id = $2`,
    [user_id, quiniela_id]
  );

  return result.rows;
}

// REMOVE ROLE
export async function removeUserRole(user_role_id) {
  const result = await pool.query(
    `DELETE FROM user_roles
     WHERE user_role_id = $1
     RETURNING user_role_id`,
    [user_role_id]
  );

  return result.rows[0];
}
