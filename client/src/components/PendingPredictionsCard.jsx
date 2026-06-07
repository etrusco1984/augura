import React from "react";
import { usePendingPredictions } from "../hooks/usePendingPredictions";

export function PendingPredictionsCard({ user_id }) {
  const { pending, loading, error } = usePendingPredictions(user_id);

  if (!user_id) return null;
  if (loading) return <div className="card">Loading pending predictions...</div>;
  if (error) return <div className="card error">Error: {error}</div>;

  return (
    <div className="card">
      <h3>Pending Predictions</h3>

      <ul className="results-list">
        {pending.map((g) => (
          <li key={g.game_id} className="game-item">
            <strong>
              {g.home_team} vs {g.away_team}
            </strong>

            <div className="game-meta">
              {new Date(g.match_date).toLocaleString()} — {g.season}
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
}
