import express from "express";
import { authenticateUser,requireRole } from "../middleware/authMiddleware.js";

import {
  createQuiniela,
  getQuinielaById,
  getQuinielasBySeason,
  deactivateQuiniela
} from "../db/quinielasSvc.js";

import { 
  getQuinielaDetails,
  getUserQuinielas
} from "../controllers/quinielaController.js";

const router = express.Router();

// POST /quinielas
router.post("/", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const { season_id, name } = req.body;
    const newQ = await createQuiniela({ season_id, name });
    res.status(201).json(newQ);
  } catch (err) {
    res.status(500).json({ error: "Failed to create quiniela" });
  }
});

// GET /quinielas/season/:season_id
router.get("/season/:season_id", authenticateUser, async (req, res) => {
  try {
    const list = await getQuinielasBySeason(req.params.season_id);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quinielas" });
  }
});

// GET /quinielas/user
router.get("/", authenticateUser, getUserQuinielas);

// GET /quinielas/:quinielaId/details
router.get("/:quinielaId/details", authenticateUser, getQuinielaDetails);

// GET /quinielas/:id
router.get("/:id",authenticateUser, async (req, res) => {
  try {
    const q = await getQuinielaById(req.params.id);
    if (!q) return res.status(404).json({ error: "Quiniela not found" });
    res.json(q);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quiniela" });
  }
});
// PATCH /quinielas/:id/deactivate
router.patch("/:id/deactivate", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const updated = await deactivateQuiniela(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to deactivate quiniela" });
  }
});

export default router;