export function NextGamesCard({ games }) {
  if (!games || games.length === 0) {
    return (
      <div className="card next-games-card">
        <h3>Next Games</h3>
        <p>No upcoming games.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Next Games</h3>
      <ul className="results-list">
        {games.map((g) => (
          <li key={g.game_id} className="game-item">            
            <strong>{g.home_team} vs {g.away_team}</strong>
            <div className="game-meta">
              {new Date(g.match_date).toLocaleDateString()} — {g.stage_name}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
