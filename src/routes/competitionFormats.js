import express from "express";
import { authenticateUser, requireRole } from "../middleware/authMiddleware.js";
import {
  getCompetitionFormats,
  getCompetitionFormatById,
  getCompetitionFormatByName,
  createCompetitionFormat
} from "../db/competitionFormatsSvc.js";

const router = express.Router();

// GET /competition-formats
router.get("/", authenticateUser, async (req, res) => {
  try {
    const formats = await getCompetitionFormats();
    res.json(formats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch competition formats" });
  }
});

// GET /competition-formats/:id
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const format = await getCompetitionFormatById(req.params.id);
    if (!format) {
      return res.status(404).json({ error: "Format not found" });
    }
    res.json(format);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch competition format" });
  }
});

// GET /competition-formats/name/:name
router.get("/name/:name", authenticateUser, async (req, res) => {
  try {
    const format = await getCompetitionFormatByName(req.params.name);
    if (!format) {
      return res.status(404).json({ error: "Format not found" });
    }
    res.json(format);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch competition format" });
  }
});

// POST /competition-formats
router.post("/", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const { name, description, legs } = req.body;
    const newFormat = await createCompetitionFormat({
      name,
      description,
      legs
    });
    res.status(201).json(newFormat);
  } catch (err) {
    res.status(500).json({ error: "Failed to create competition format" });
  }
});

export default router;
