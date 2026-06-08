import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";

export default function LeaderboardCard({ quinielaId }) {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quinielaId) return;

    setLoading(true);

    apiFetch(`${process.env.REACT_APP_API_URL}/api/quinielas/${quinielaId}/details`)
      .then(res => res.json())
      .then(data => {
        setLeaders(data.leaderboard || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading leaderboard:", err);
        setLoading(false);
      });
  }, [quinielaId]);

  if (loading) return <div className="card">Loading leaderboard...</div>;

  if (!leaders || leaders.length === 0)
    return <div className="card">No leaderboard data.</div>;

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Leaderboard</h2>

      <ul className="space-y-2">
        {leaders.map((p, idx) => (
          <li key={idx} className="border rounded p-2">
            <div className="font-medium">
              <strong>{idx + 1}. {p.username}--{p.total_points} pts</strong>
            </div>

            <div className="text-xs text-gray-500">
              Games: {p.games_played} • Exact: {p.exact_hits} • Winner: {p.winner_hits}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
