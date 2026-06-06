import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";

import {
  createInvitation,
  getInvitationsForQuiniela,
  getInvitationByToken,
  acceptInvitation
} from "../db/invitationsSvc.js";

const router = express.Router();

// POST /invitations
router.post("/", authenticateUser, async (req, res) => {
  try {
    const invitation = await createInvitation(req.body);
    res.status(201).json(invitation);
  } catch (err) {
    res.status(500).json({ error: "Failed to create invitation" });
  }
});

// GET /invitations/quiniela/:quiniela_id
router.get("/quiniela/:quiniela_id", authenticateUser, async (req, res) => {
  try {
    const list = await getInvitationsForQuiniela(req.params.quiniela_id);
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch invitations" });
  }
});

// GET /invitations/token/:token
router.get("/token/:token", authenticateUser, async (req, res) => {
  try {
    const invitation = await getInvitationByToken(req.params.token);
    if (!invitation) return res.status(404).json({ error: "Invalid token" });
    res.json(invitation);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch invitation" });
  }
});

// PATCH /invitations/accept/:token
router.patch("/accept/:token", authenticateUser, async (req, res) => {
  try {
    const updated = await acceptInvitation(req.params.token);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to accept invitation" });
  }
});

export default router;
