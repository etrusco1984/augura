import express from "express";
import {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser
} from "../db/usersSvc.js";
import { updateUserPassword } from "../db/usersSvc.js";
import { authenticateUser, requireRole } from "../middleware/authMiddleware.js";
import bcrypt from "bcrypt";

const router = express.Router();

// GET /users
router.get("/", authenticateUser, async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /users4Admin
router.get("/admin", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /users/email/:email
router.get("/email/:email", authenticateUser, async (req, res) => {
  try {
    const user = await getUserByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Do NOT return password_hash
    const { password_hash, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// GET /users/:id
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// POST /users
router.post("/", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const newUser = await createUser({ name, email, password });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// PATCH /users/:id/password
router.patch("/:id/password", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const { password } = req.body;
    
    const updated = await updateUserPassword(
      req.params.id,
      password
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update password" });
  }
});

// PATCH /users/:id/change-password
router.patch("/:id/change-password", authenticateUser, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const loggedUserId = req.user.user_id;

    if (loggedUserId !== Number(req.params.id)) {
      return res.status(403).json({ error: "Not allowed" });
    }
    
    const user = await getUserById(loggedUserId);
    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) {
      return res.status(400).json({ error: "Current password incorrect" });
    }
    const updated = await updateUserPassword(loggedUserId, newPassword);
    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: "Failed to update password" });
  }
});


export default router;
