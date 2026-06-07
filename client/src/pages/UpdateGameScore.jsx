import { useEffect, useState } from "react";
import api from "../api";
import { useParams } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import "./buttons.css";

export default function UpdateGameScore() {
    const { season_id } = useParams();
    const [games, setGames] = useState([]);
    const [rounds, setRounds] = useState([]);
    const [activeRoundIndex, setActiveRoundIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [savingGameId, setSavingGameId] = useState(null);

    // Load all games for this season
    useEffect(() => {
        async function loadGames() {

            try {
                console.log("Fetching:", `/api/admin/season/${season_id}`);
                const res = await api.get(`/api/admin/games/${season_id}`, { withCredentials: true });
                setGames(res.data);

                console.log("Response:", res.data);
            } catch (err) {
                console.error("Failed to load games:", err);
            } finally {
                setLoading(false);
            }
        }

        loadGames();
    }, [season_id]);

    // Build rounds structure
    useEffect(() => {
        if (!loading) {
            const roundsMap = games.reduce((acc, g) => {
                if (!acc[g.round_id]) {
                    acc[g.round_id] = {
                        round_id: g.round_id,
                        round_name: g.round_name,
                        games: []
                    };
                }
                acc[g.round_id].games.push({
                    ...g,
                    home_score: g.home_score ?? "",
                    away_score: g.away_score ?? "",
                    penalty_winner_team_id: g.penalty_winner_team_id ?? null
                });
                return acc;
            }, {});

            const sorted = Object.values(roundsMap).sort(
                (a, b) => a.round_id - b.round_id
            );

            setRounds(sorted);
        }
    }, [games, loading]);

    if (loading) return <div>Loading...</div>;

    const rowsForRound = rounds[activeRoundIndex]?.games || [];

    // Update local state for a single row
    function updateRow(gameId, field, value) {
        setRounds(prev => {
            const updated = [...prev];
            updated[activeRoundIndex].games =
                updated[activeRoundIndex].games.map(g =>
                    g.game_id === gameId ? { ...g, [field]: value } : g
                );
            return updated;
        });
    }

    // Save a single game score
    async function saveSingleGame(game) {
        try {
            setSavingGameId(game.game_id)

            const payload = {
                home_score: Number(game.home_score),
                away_score: Number(game.away_score),
                penalty_winner_team_id: game.penalty_winner_team_id
            };

            await api.patch(
                `/api/admin/games/${game.game_id}/score`,
                payload,
                { withCredentials: true }
            );


            console.log("Saved game:", game.game_id);
        } catch (err) {
            console.error("Failed to save game:", err);
        } finally {
            setSavingGameId(null)
        }

    }

    return (
        <DashboardLayout title="Update Game Scores">
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

                    <span className="font-semibold text-lg">
                        {rounds[activeRoundIndex]?.round_name}
                    </span>

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
                </div>

                {/* ⭐ GAME ROWS */}
                {rowsForRound.map(row => (
                    <div key={row.game_id} className="prediction-row">

                        {/* ⭐ Everything in one horizontal row */}
                        <div className="teams">
                            <img src={`/flag-icons/${row.home_logo}`} className="team-logo" />
                            <span className="team-name">{row.home_sn}</span>

                            <input
                                type="number"
                                value={row.home_score}
                                onChange={e =>
                                    updateRow(row.game_id, "home_score", e.target.value)
                                }
                                className="score-input"
                            />

                            <span className="vs"><strong>vs</strong></span>

                            <input
                                type="number"
                                value={row.away_score}
                                onChange={e =>
                                    updateRow(row.game_id, "away_score", e.target.value)
                                }
                                className="score-input"
                            />

                            <span className="team-name">{row.away_sn}</span>
                            <img src={`/flag-icons/${row.away_logo}`} className="team-logo" />

                            {/* ⭐ Save button inline */}
                            <button
                                onClick={() => saveSingleGame(row)}
                                className={`save-btn ${savingGameId === row.game_id ? "saving" : ""}`}
                                disabled={savingGameId === row.game_id}
                            >
                                {savingGameId === row.game_id ? (
                                    <span className="spinner"></span>
                                ) : (
                                    "Save"
                                )}
                            </button>
                        </div>

                        {/* ⭐ PK radio buttons (only if knockout AND tie) */}
                        {row.stage_name === "knockout" &&
                            Number(row.home_score) === Number(row.away_score) && (
                                <div className="pk-radio-group mt-2">
                                    <label>
                                        <input
                                            type="radio"
                                            name={`pk-${row.game_id}`}
                                            checked={row.penalty_winner_team_id === row.home_team_id}
                                            onChange={() =>
                                                updateRow(
                                                    row.game_id,
                                                    "penalty_winner_team_id",
                                                    row.home_team_id
                                                )
                                            }
                                        />
                                        {row.home_sn}
                                    </label>

                                    <label>
                                        <input
                                            type="radio"
                                            name={`pk-${row.game_id}`}
                                            checked={row.penalty_winner_team_id === row.away_team_id}
                                            onChange={() =>
                                                updateRow(
                                                    row.game_id,
                                                    "penalty_winner_team_id",
                                                    row.away_team_id
                                                )
                                            }
                                        />
                                        {row.away_sn}
                                    </label>
                                </div>
                            )}
                    </div>
                ))}

            </div>
        </DashboardLayout>
    );
}
