import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";

import {
  addParticipant,
  getParticipants,
  removeParticipant
} from "../db/quinielaParticipantsSvc.js";

const router = express.Router();

// POST /quiniela_participants
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { quiniela_id, user_id, role_id } = req.body;
    const added = await addParticipant(quiniela_id, user_id, role_id);
    res.status(201).json(added);
  } catch (err) {
    res.status(500).json({ error: "Failed to add participant" });
  }
});

// GET /quiniela_participants/:quiniela_id
router.get("/:quiniela_id", authenticateUser, async (req, res) => {
  try {
    const list = await getParticipants(req.params.quiniela_id);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch participants" });
  }
});

// DELETE /quiniela_participants/:quiniela_id/:user_id
router.delete("/:quiniela_id/:user_id", authenticateUser, async (req, res) => {
  try {
    const removed = await removeParticipant(
      req.params.quiniela_id,
      req.params.user_id
    );
    res.json(removed);
  } catch (err) {
    res.status(500).json({ error: "Failed to remove participant" });
  }
});

export default router;
