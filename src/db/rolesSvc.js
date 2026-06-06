import pool from "../db/pool.js";

export async function getRoles() {
  const result = await pool.query(
    `SELECT role_id, name, description, created_at
     FROM roles
     ORDER BY role_id`
  );
  return result.rows;
}

export async function getRoleById(id) {
  const result = await pool.query(
    `SELECT role_id, name, description, created_at
     FROM roles
     WHERE role_id = $1`,
    [id]
  );
  return result.rows[0];
}

export async function createRole(name, description) {
  const result = await pool.query(
    `INSERT INTO roles (name, description)
     VALUES ($1, $2)
     RETURNING role_id, name, description, created_at`,
    [name, description]
  );
  return result.rows[0];
}
