import express from "express";
import {
  getRoles,
  getRoleById,
  createRole
} from "../db/rolesSvc.js";

const router = express.Router();

// GET /roles
router.get("/", async (req, res) => {
  try {
    const roles = await getRoles();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch roles" });
  }
});

// GET /roles/:id
router.get("/:id", async (req, res) => {
  try {
    const role = await getRoleById(req.params.id);
    if (!role) return res.status(404).json({ error: "Role not found" });
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch role" });
  }
});

// POST /roles
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const newRole = await createRole(name, description);
    res.status(201).json(newRole);
  } catch (err) {
    res.status(500).json({ error: "Failed to create role" });
  }
});

export default router;
