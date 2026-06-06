import express from "express";
import { getNextGames } from "../controllers/dashboardController.js";
import { getLastResults } from "../controllers/dashboardController.js";

const router = express.Router();

router.get("/next-games", getNextGames);
router.get("/last-results", getLastResults);

export default router;
