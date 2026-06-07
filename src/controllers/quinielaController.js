// src/controllers/quinielaController.js
import pool from "../db/pool.js";
import {
  getNextMatches,
  getLeaderboard,
  getRecentResults,
  getQuinielaBaseInfo,
  getUserParticipation,
  getUserQuinielasFromDB,
  getGamesForQuiniela
} from "../db/quinielaDetailsSvc.js";
import { getPredictionsForQuiniela } from "../db/predictionsSvc.js";

export async function getQuinielaDetails(req, res) {
  const { quinielaId } = req.params;
  const { userId } = req.user;

  const client = await pool.connect();

  try {
    const baseInfo = await getQuinielaBaseInfo(client, quinielaId);
    const participation = await getUserParticipation(client, quinielaId, userId);
    const nextMatches = await getNextMatches(client, quinielaId, userId);
    const allPredictions = await getPredictionsForQuiniela(client, quinielaId);
    const leaderboard = await getLeaderboard(client, quinielaId);
    const recentResults = await getRecentResults(client, userId, quinielaId);
    const games = await getGamesForQuiniela(client, quinielaId);

    res.json({
      baseInfo,
      participation,
      nextMatches,
      allPredictions,
      leaderboard,
      recentResults,
      games
    });

  } catch (err) {
    console.error("Error in getQuinielaDetails:", err);
    res.status(500).json({ error: "Internal server error" });

  } finally {
    client.release();
  }
}

export async function getUserQuinielas(req, res) {
  const client = await pool.connect();
  try {
    const userId = req.user.user_id;    
    const quinielas = await getUserQuinielasFromDB(client, userId);
    res.json(quinielas);
  } catch (err) {
    console.error("Error fetching user quinielas:", err);
    res.status(500).json({ error: "Failed to fetch user quinielas" });
  } finally{
    client.release();
  }
}
