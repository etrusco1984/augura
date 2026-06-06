// Determine match outcome: "home", "away", or "draw"
export function getOutcome(home, away) {
  if (home === away) return "DRAW";
  return home > away ? "HOME" : "AWAY";
}

// 1 point if predicted outcome matches actual outcome
export function scoreOutcome(prediction, game) {
  const actual = getOutcome(game.home_score, game.away_score);
  const predicted = getOutcome(
    prediction.predicted_home_score,
    prediction.predicted_away_score
  );

  return actual === predicted ? 1 : 0;
}

// 1 point if exact score matches
export function scoreExact(prediction, game) {
  const exact =
    prediction.predicted_home_score === game.home_score &&
    prediction.predicted_away_score === game.away_score;

  return exact ? 1 : 0;
}

// 1 point if penalty winner matches (only if game has a penalty winner)
export function scorePenalty(prediction, game) {
  // Penalties only apply if the match ended in a draw
  const isDraw = game.home_score === game.away_score;
  if (!isDraw) return 0;

  // If the actual game has no penalty winner, no points
  if (!game.penalty_winner_team_id) return 0;

  // If the prediction has no penalty winner, no points
  if (!prediction.predicted_penalty_winner_team_id) return 0;

  return prediction.predicted_penalty_winner_team_id ===
    game.penalty_winner_team_id ? 1 : 0;
}

// Main scoring function: applies rule flags
export function calculatePoints(prediction, game, rule) {
  let points = 0;

  if (rule.use_correct_outcome) {
    points += scoreOutcome(prediction, game);
  }

  if (rule.use_exact_score) {
    points += scoreExact(prediction, game);
  }

  if (rule.use_penalty_winner) {
    points += scorePenalty(prediction, game);
  }

  return points;
}
