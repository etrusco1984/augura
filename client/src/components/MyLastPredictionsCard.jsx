import React from "react";
import { useLastPredictions } from "../hooks/useLastPredictions";

export function MyLastPredictionsCard({ user_id }) {
  const { predictions, loading, error } = useLastPredictions(user_id);

  if (loading) return <div className="card">Loading last predictions...</div>;
  if (error) return <div className="card error">Error: {error}</div>;

  return (
    <div className="card">
      <h3>My Last Predictions</h3>

      <ul className="results-list">
        {predictions.map((p) => (
          <li key={p.prediction_id} className="game-item">
            <strong>
              {p.home_team} {p.predicted_home} -{p.predicted_away} {p.away_team}
            </strong>

            <div className="prediction-line">
              <span>
                {p.predicted_home === p.predicted_away && p.predicted_pk
                  ? ` (PK → ${p.predicted_pk_winner})`
                  : ""}
              </span>
            </div>

            <div className="game-meta">
              {new Date(p.match_date).toLocaleDateString()} — {p.season}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
