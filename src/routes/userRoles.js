import express from "express";
import { authenticateUser, requireRole } from "../middleware/authMiddleware.js";
import {
  assignUserRole,
  getUserRoles,
  getUserRolesInQuiniela,
  removeUserRole
} from "../db/userRolesSvc.js";

const router = express.Router();

// POST /user_roles
router.post("/", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const role = await assignUserRole(req.body);
    res.status(201).json(role);
  } catch (err) {
    res.status(500).json({ error: "Failed to assign role" });
  }
});

// GET /user_roles/user/:user_id
router.get("/user/:user_id", authenticateUser, async (req, res) => {
  try {
    // Prevent normal users from accessing other users' roles
    if (req.user.user_id !== req.params.user_id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden" });
    }

    const roles = await getUserRoles(req.params.user_id);
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user roles" });
  }
});


// GET /user_roles/user/:user_id/quiniela/:quiniela_id
router.get("/user/:user_id/quiniela/:quiniela_id", authenticateUser, async (req, res) => {
  try {
    const roles = await getUserRolesInQuiniela(
      req.params.user_id,
      req.params.quiniela_id
    );
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user roles for quiniela" });
  }
});

// DELETE /user_roles/:user_role_id
router.delete("/:user_role_id", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const removed = await removeUserRole(req.params.user_role_id);
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove user role" });
  }
});

export default router;
