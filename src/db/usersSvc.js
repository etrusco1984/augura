import pool from "../db/pool.js";
import bcrypt from "bcrypt";

export async function getUsers() {
  const result = await pool.query(
    "SELECT user_id, username, email, created_at FROM users ORDER BY user_id"
  );
  return result.rows;
}

export async function getUserById(id) {
  const result = await pool.query(
    "SELECT user_id, username, email, password_hash, created_at FROM users WHERE user_id = $1",
    [id]
  );
  return result.rows[0];
}

export async function getUserByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
}

export async function getUserByName(name) {
  const result = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [email]
  );
  return result.rows[0];
}

export async function createUser({ username, email, password_hash, language_code }) {
  // Validate language
  const allowedLanguages = ["en", "es", "it"];
  const language = language_code || "en";

  if (!allowedLanguages.includes(language)) {
    throw new Error("Invalid language code");
  }

  const result = await pool.query(
    `INSERT INTO users (username, email, password_hash, language_code)
     VALUES ($1, $2, $3, $4)
     RETURNING user_id, username, email, created_at, language_code`,
    [username, email, password_hash, language]
  );

  return result.rows[0];
}

export async function updateUserPassword(id, password) {
  const password_hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `UPDATE users
     SET password_hash = $1
     WHERE user_id = $2
     RETURNING user_id, username, email, created_at, language_code`,
    [password_hash, id]
  );
  return result.rows[0];
}


export async function updateUserLanguage(lang, id) {
  const allowedLanguages = ["en", "es", "it"];
  const language = lang || "en";

  if (!allowedLanguages.includes(language)) {
    throw new Error("Invalid language code");
  }

  const result = await pool.query(
    `UPDATE users
     SET languange_code = $1
     WHERE user_id = $2
     RETURNING user_id, username, email, created_at, language_code`,
    [language, id]
  );
  return result.rows[0];
}

export async function getUserRoles(user_id) {
  const result = await pool.query(
    "SELECT roles FROM user_roles_view WHERE user_id = $1",
    [user_id]
  );

  return result.rows[0]?.roles || [];
}

