import express from "express";
import pool from "../db.js";
import requireRole from "../middleware/requireRole.js";

const router = express.Router();

// GET all roles
router.get("/", requireRole("admin"), async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM roles ORDER BY role_id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching roles:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// CREATE a new role
router.post("/", requireRole("admin"), async (req, res) => {
  const { role_name } = req.body;

  if (!role_name) {
    return res.status(400).json({ error: "role_name is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO roles (role_name) VALUES ($1) RETURNING *",
      [role_name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error creating role:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a role
router.delete("/:id", requireRole("admin"), async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM roles WHERE role_id = $1", [id]);
    res.json({ message: "Role deleted" });
  } catch (err) {
    console.error("Error deleting role:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
