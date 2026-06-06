// src/routes/adminGames.js
import express from "express";
import {
  getAllAdminSeasons,
  getAdminGames,
  updateAdminGameScore,
  updateAdminGameMetadata
} from "../controllers/adminGamesController.js";
import { authenticateUser, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/seasons", authenticateUser, requireRole("admin"), getAllAdminSeasons);
router.get("/games/:seasonId", authenticateUser, requireRole("admin"), getAdminGames);
router.patch("/games/:id/score", authenticateUser, requireRole("admin"), updateAdminGameScore);
router.patch("/games/:id/metadata", authenticateUser, requireRole("admin"), updateAdminGameMetadata);

export default router;
