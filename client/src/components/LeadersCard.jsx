import React from "react";
import { useTopLeaders } from "../hooks/useTopLeaders";

export function LeadersCard() {
  const { leaders, loading, error } = useTopLeaders();

  if (loading) return <div className="card">Loading leaders...</div>;
  if (error) return <div className="card error">Error: {error}</div>;

  return (
    <div className="card">
      <h3>Top Leaders</h3>
      <ul className="results-list">
        {leaders.map((leader, index) => (
          <li key={leader.user_id} className="game-item">
            <strong>
              {index + 1}. {leader.username}
            </strong>{" "}
            — {leader.total_points} pts
            <div className="game-meta">{leader.quiniela}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
