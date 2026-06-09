import { use, useEffect, useState } from "react";
import { apiFetch } from "../utils/apiFetch";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useUser } from "../context/UserContext";
import "./buttons.css";

export default function PredictionsScreen() {
  const { quiniela_id } = useParams();
  const { user } = useUser(); // Get user_id from context\

  const [games, setGames] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [rows, setRows] = useState([]);
  const [rounds, setRounds] = useState([]);              // ✅ FIXED
  const [activeRoundIndex, setActiveRoundIndex] = useState(0); // ✅ FIXED
  const [loading, setLoading] = useState(true);
  const [savingRound, setSavingRound] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await apiFetch(
          `${process.env.REACT_APP_API_URL}/api/predictions/${quiniela_id}`
        );
        const data = await res.json();
        setGames(data.games);
        setPredictions(data.predictions);

      } catch (err) {
        console.error("Failed to load predictions screen:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [quiniela_id]);


  // Merge games + predictions into rows AND build rounds
  useEffect(() => {
    if (!loading) {
      const merged = games.map(game => {
        const prediction = predictions.find(p => p.game_id === game.game_id);

        const now = new Date();
        const lockDate = new Date(game.route_target);
        const isLocked = game.route_target ? now >= lockDate : false;
        return {
          home_team_id: game.home_team_id,
          away_team_id: game.away_team_id,
          game_id: game.game_id,
          round_id: game.round_id,          // ✅ REQUIRED FOR CAROUSEL
          round_name: game.round_name,      // ✅ REQUIRED FOR CAROUSEL
          home_team: game.home_sn,
          away_team: game.away_sn,
          home_logo: game.home_logo,
          away_logo: game.away_logo,
          match_date: game.match_date,
          target_date: game.target_date,
          stage_name: game.stage_name,
          route_target: game.route_target,
          isLocked,

          prediction_id: prediction?.prediction_id || null,
          predicted_home_score: prediction?.predicted_home_score ?? "",
          predicted_away_score: prediction?.predicted_away_score ?? "",
          predicted_penalty_winner_team_id: prediction?.predicted_penalty_winner_team_id ?? null
        };
      });

      setRows(merged);

      // ✅ BUILD ROUNDS CORRECTLY USING merged (NOT rows)
      const roundsMap = merged.reduce((acc, row) => {
        if (!acc[row.round_id]) {
          acc[row.round_id] = {
            round_id: row.round_id,
            round_name: row.round_name,
            games: []
          };
        }
        acc[row.round_id].games.push(row);
        return acc;
      }, {});

      setRounds(Object.values(roundsMap).sort((a, b) => a.round_id - b.round_id));
    }
  }, [games, predictions, loading]);

  useEffect(() => {
    const activeRound = rounds[activeRoundIndex];
    if (!activeRound) return;

    // Use target_date from the round itself
    const raw = activeRound.games[0]?.route_target;
    const normalized = raw?.replace(" ", "T"); // ensure ISO format
    const lockDate = new Date(
      normalized?.endsWith("Z") ? normalized : normalized + "Z"
    );
    if (isNaN(lockDate.getTime())) {
      setTimeLeft("Undefined");
      return;
    }

    const timer = setInterval(() => {
      const now = new Date();
      const diff = lockDate - now;

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft("00:00:00");
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [rounds, activeRoundIndex]);

  if (loading) return <div>Loading...</div>;


  // Update row state
  function updateRow(gameId, field, value) {
    setRounds(prev => {
      const updated = [...prev];
      updated[activeRoundIndex].games =
        updated[activeRoundIndex].games.map(g =>
          g.game_id === gameId
            ? { ...g, [field]: value }
            : g
        );
      return updated;
    });
  }


  // Save prediction (POST or PATCH)
  async function saveRound() {
    try {
      setSavingRound(true);
      // 1. Get all rows for the active round
      const roundRows = rounds[activeRoundIndex].games;

      // 2. Build bulk payload
      const payload = roundRows.map(r => ({
        prediction_id: r.prediction_id || null,
        user_id: user?.user_id, // You need to get the user_id from context or props
        game_id: r.game_id,
        predicted_home_score: Number(r.predicted_home_score),
        predicted_away_score: Number(r.predicted_away_score),
        predicted_penalty_winner_team_id: r.predicted_penalty_winner_team_id,
        quiniela_id: quiniela_id
      }));

      // 3. Send one bulk request
      const res = await apiFetch(
        `${process.env.REACT_APP_API_URL}/api/predictions/bulk`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      // 4. Backend returns updated prediction_ids
      const updated = await res.json();

      // 5. Update rows state with new prediction_ids
      setRounds(prev => {
        const updatedRounds = [...prev];
        updatedRounds[activeRoundIndex].games =
          updatedRounds[activeRoundIndex].games.map(r => {
            const match = updated.find(u => u.game_id === r.game_id);
            return match ? { ...r, prediction_id: match.prediction_id } : r;
          });
        return updatedRounds;
      });

    } catch (err) {
      console.error("Failed to save round:", err);
    } finally {
      setSavingRound(false);
    }
  }
  const activeRoundId = rounds[activeRoundIndex]?.round_id;
  const rowsForRound = rounds[activeRoundIndex]?.games || [];
  return (
    <DashboardLayout title={`Tiempo restante: ${timeLeft}`}>
      <div className="prediction-screen">

        {/* ⭐ LEFT/RIGHT ARROWS */}
        <div className="flex justify-between items-center px-2 py-2">
          <button
            onClick={() => setActiveRoundIndex(i => Math.max(i - 1, 0))}
            disabled={activeRoundIndex === 0}
            className={`px-3 py-1 rounded ${activeRoundIndex === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-700 text-white"
              }`}
          >
            ◀
          </button>

          <span className="font-semibold text-lg">   {rounds[activeRoundIndex]?.round_name}   </span>

          <button
            onClick={() =>
              setActiveRoundIndex(i =>
                Math.min(i + 1, rounds.length - 1)
              )
            }
            disabled={activeRoundIndex === rounds.length - 1}
            className={`px-3 py-1 rounded ${activeRoundIndex === rounds.length - 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-700 text-white"
              }`}
          >
            ▶
          </button>
          <button
            onClick={saveRound}
            className={`save-btn ${savingRound ? "saving" : ""}`}
            disabled={savingRound || timeLeft === "00:00:00"}
          >
            {savingRound ? <span className="spinner"></span> : `Guardar ${rounds[activeRoundIndex]?.round_name}`}
          </button>
        </div>

        {rowsForRound.map(row => (

          <div key={row.game_id} className="prediction-row">
            <div className="teams">
              <img src={`/flag-icons/${row.home_logo}`} className="team-logo" />
              <span className="team-name"> {row.home_team} </span>

              <input
                type="number"
                value={row.predicted_home_score}
                disabled={row.isLocked}
                onChange={e => updateRow(row.game_id, "predicted_home_score", e.target.value)}
                className="score-input"
              />

              <span className="vs"> <strong>vs</strong> </span>

              <input
                type="number"
                value={row.predicted_away_score}
                disabled={row.isLocked}
                onChange={e => updateRow(row.game_id, "predicted_away_score", e.target.value)}
                className="score-input"
              />

              <span className="team-name"> {row.away_team} </span>
              <img src={`/flag-icons/${row.away_logo}`} className="team-logo" />
            </div>

            {/* PK radio buttons */}
            {row.stage_name === "knockout" &&
              row.predicted_home_score === row.predicted_away_score &&
              !row.isLocked && (
                <div className="pk-radio-group">
                  <label>
                    <input
                      type="radio"
                      name={`pk-${row.game_id}`}
                      value={row.home_team}
                      checked={row.predicted_penalty_winner_team_id === row.home_team_id}
                      onChange={() =>
                        updateRow(row.game_id, "predicted_penalty_winner_team_id", Number(row.home_team_id))
                      }
                    />
                    {row.home_team}
                  </label>

                  <label>
                    <input
                      type="radio"
                      name={`pk-${row.game_id}`}
                      value={row.away_team}
                      checked={row.predicted_penalty_winner_team_id === row.away_team_id}
                      onChange={() =>
                        updateRow(row.game_id, "predicted_penalty_winner_team_id", Number(row.away_team_id))
                      }
                    />
                    {row.away_team}
                  </label>
                </div>
              )}

            {/* Locked PK display */}
            {row.stage_name === "knockout" &&
              row.isLocked &&
              row.predicted_home_score === row.predicted_away_score && (
                <div className="pk-locked">
                  PK Winner: {row.predicted_penalty_winner_team_id}
                </div>
              )}

          </div>
        ))}

      </div>
    </DashboardLayout>
  );
}
