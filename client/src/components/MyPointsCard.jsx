import React from "react";
import { useMyPoints } from "../hooks/useMyPoints";

export function MyPointsCard({ user_id }) {
  const { points, loading, error } = useMyPoints(user_id);

  if (!user_id) return null;
  if (loading) return <div className="card">Loading points...</div>;
  if (error) return <div className="card error">Error: {error}</div>;

  return (
    <div className="card">
      <h3>My Points</h3>

      <ul className="results-list">
        {points.map((p) => (
          <li key={p.quiniela_id} className="game-item">
            <strong>{p.quiniela_name}</strong>

            <div className="points-line">
              <strong>Points:</strong> {p.total_points}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
