import { getUserQuinielas } from "../db/quinielaParticipantsSvc.js";
import { getSeasonByQuiniela } from "../db/quinielasSvc.js";
import { getUpcomingGamesBySeasonIds, getLastResultsBySeason } from "../db/gamesSvc.js";

export async function getNextGames(req, res) {
  try {
    const userId = req.user.user_id; // TEMP for testing // assuming auth middleware sets req.user

    // 1. Get user's quinielas
    const quinielas = await getUserQuinielas(userId);
    const quinielaIds = quinielas.map(q => q.quiniela_id);

    // 2. Get seasons for each quiniela
    const seasons = await Promise.all(
      quinielaIds.map(id => getSeasonByQuiniela(id))
    );
    const seasonIds = seasons.map(s => s.season_id);

    // 3. Get upcoming games
    const games = await getUpcomingGamesBySeasonIds(seasonIds);

    res.json(games);

  } catch (err) {
    console.error("Error in getNextGames:", err);
    res.status(500).json({ error: "Failed to load next games" });
  }
}

export async function getLastResults(req, res) {
  try {
    const userId = req.user.user_id; // TEMP for testing // assuming auth middleware sets req.user

    // 1. Get user's quinielas
    const quinielas = await getUserQuinielas(userId);
    const quinielaIds = quinielas.map(q => q.quiniela_id);

    // 2. Get seasons for each quiniela
    const seasons = await Promise.all(
      quinielaIds.map(id => getSeasonByQuiniela(id))
    );

    const seasonIds = seasons.map(s => s.season_id);

    // 3. Get last results
    const games = await getLastResultsBySeason(seasonIds);

    res.json(games);

  } catch (err) {
    console.error("Error in getLastResults:", err);
    res.status(500).json({ error: "Failed to load last results" });
  }
}