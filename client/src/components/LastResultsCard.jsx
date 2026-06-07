import React from "react";
import { useLastResults } from "../hooks/useLastResults";

export function LastResultsCard() {
  const { lastResults, loading, error } = useLastResults();

  if (loading) return <div className="card">Loading last results...</div>;
  if (error) return <div className="card error">Error: {error}</div>;

  return (
    <div className="card">
      <h3>Last Results</h3>
      <ul className="results-list">
        {lastResults.map((game) => (
          <li key={game.game_id} className="game-item">
            <strong>{game.home_team} {game.home_score}</strong> - <strong>{game.away_score} {game.away_team}</strong>
            <div className="game-meta">
              <span>{new Date(game.match_date).toLocaleDateString()}</span> •{" "}
              <span>{game.stage_name}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
