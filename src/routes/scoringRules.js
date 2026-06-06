import express from "express";
import { authenticateUser, requireRole } from "../middleware/authMiddleware.js";
import {
  createScoringRule,
  getScoringRules,
  getScoringRuleById,
  updateScoringRule
} from "../db/scoringRulesSvc.js";

const router = express.Router();

// POST /scoring_rules
router.post("/", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const rule = await createScoringRule(req.body);
    res.status(201).json(rule);
  } catch (err) {
    res.status(500).json({ error: "Failed to create scoring rule" });
  }
});

// GET /scoring_rules
router.get("/", authenticateUser, async (req, res) => {
  try {
    const rules = await getScoringRules();
    res.json(rules);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch scoring rules" });
  }
});

// GET /scoring_rules/:id
router.get("/:id", authenticateUser, async (req, res) => {
  try {
    const rule = await getScoringRuleById(req.params.id);
    if (!rule) return res.status(404).json({ error: "Rule not found" });
    res.json(rule);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch scoring rule" });
  }
});

// PATCH /scoring_rules/:id
router.patch("/:id", authenticateUser, requireRole("admin"), async (req, res) => {
  try {
    const updated = await updateScoringRule(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update scoring rule" });
  }
});

export default router;
