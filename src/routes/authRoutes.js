import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getUserRoles, getUserByEmail, createUser } from "../db/usersSvc.js";

const router = express.Router();

// -----------------------------
// LOGIN
// -----------------------------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const roles = await getUserRoles(user.user_id);
    const is_admin = roles.includes("admin");

    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        language_code: user.language_code,
        roles,
        is_admin
      },
      process.env.JWT_SECRET,
      { expiresIn: "45m" }
    );

    res.json({
      token,
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        language_code: user.language_code,
        roles,
        is_admin
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// -----------------------------
// LOGOUT (no-op for token auth)
// -----------------------------
router.post("/logout", (req, res) => {
  res.json({ success: true });
});

// -----------------------------
// ME (validate token)
// -----------------------------
router.get("/me", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ user: null });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    res.json({
      user: {
        user_id: payload.user_id,
        username: payload.username,
        email: payload.email,
        language_code: payload.language_code,
        roles: payload.roles,
        is_admin: payload.is_admin
      }
    });

  } catch (err) {
    return res.status(401).json({ user: null });
  }
});

// -----------------------------
// REGISTER
// -----------------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, lang } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      username: name,
      email,
      password_hash,
      language_code: lang || "en"
    });

    const roles = await getUserRoles(newUser.user_id);
    const is_admin = roles.includes("admin");

    const token = jwt.sign(
      {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        language_code: newUser.language_code,
        roles,
        is_admin
      },
      process.env.JWT_SECRET,
      { expiresIn: "45m" }
    );

    res.json({
      token,
      user: {
        user_id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        language_code: newUser.language_code,
        roles,
        is_admin
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

export default router;
