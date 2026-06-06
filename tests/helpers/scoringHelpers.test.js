import {
  getOutcome,
  scoreOutcome,
  scoreExact,
  scorePenalty,
  calculatePoints
} from "../../src/helpers/scoringHelpers.js";

describe("scoring helpers", () => {
  const rules = {
    points_for_outcome: 1,
    points_for_exact: 2,
    points_for_penalty: 1
  };

  // getOutcome
  describe("getOutcome", () => {
    test("returns HOME when home > away", () => {
      expect(getOutcome(2, 1)).toBe("HOME");
    });

    test("returns AWAY when away > home", () => {
      expect(getOutcome(1, 3)).toBe("AWAY");
    });

    test("returns DRAW when equal", () => {
      expect(getOutcome(2, 2)).toBe("DRAW");
    });
  });

  // scoreOutcome
  describe("scoreOutcome", () => {
    test("gives 1 point for correct outcome", () => {
      const prediction = {
        predicted_home_score: 2,
        predicted_away_score: 1
      };

      const game = {
        home_score: 3,
        away_score: 0
      };

      // both HOME
      expect(scoreOutcome(prediction, game)).toBe(1);
    });

    test("gives 0 for wrong outcome", () => {
      const prediction = {
        predicted_home_score: 2,
        predicted_away_score: 1
      };

      const game = {
        home_score: 0,
        away_score: 3
      };

      // prediction = HOME, actual = AWAY
      expect(scoreOutcome(prediction, game)).toBe(0);
    });
  });


  // scoreExact
  describe("scoreExact", () => {
    test("gives 1 point for exact score", () => {
      const prediction = {
        predicted_home_score: 2,
        predicted_away_score: 1
      };

      const game = {
        home_score: 2,
        away_score: 1
      };

      expect(scoreExact(prediction, game)).toBe(1);
    });

    test("gives 0 for non-exact score", () => {
      const prediction = {
        predicted_home_score: 2,
        predicted_away_score: 1
      };

      const game = {
        home_score: 3,
        away_score: 1
      };

      expect(scoreExact(prediction, game)).toBe(0);
    });
  });


  // scorePenalty
  describe("scorePenalty", () => {
    test("gives 1 point for correct penalty winner", () => {
      const prediction = {
        predicted_penalty_winner_team_id: 5
      };

      const game = {
        penalty_winner_team_id: 5
      };

      expect(scorePenalty(prediction, game)).toBe(1);
    });

    test("gives 0 for wrong penalty winner", () => {
      const prediction = {
        predicted_penalty_winner_team_id: 5
      };

      const game = {
        penalty_winner_team_id: 7
      };

      expect(scorePenalty(prediction, game)).toBe(0);
    });

    test("gives 0 when actual has no penalty winner", () => {
      const prediction = {
        predicted_penalty_winner_team_id: 5
      };

      const game = {
        penalty_winner_team_id: null
      };

      expect(scorePenalty(prediction, game)).toBe(0);
    });
  });


  // calculatePoints
  describe("calculatePoints", () => {
    const rules = {
      use_correct_outcome: true,
      use_exact_score: true,
      use_penalty_winner: true
    };

    test("combines outcome + exact + penalty when match is a draw", () => {
      const prediction = {
        predicted_home_score: 1,
        predicted_away_score: 1,
        predicted_penalty_winner_team_id: 5
      };

      const actual = {
        home_score: 1,
        away_score: 1,
        penalty_winner_team_id: 5
      };

      // outcome = 1, exact = 1, penalty = 1 → total = 3
      expect(calculatePoints(prediction, actual, rules)).toBe(3);
    });

    test("does NOT award penalty points when match is NOT a draw", () => {
      const prediction = {
        predicted_home_score: 2,
        predicted_away_score: 1,
        predicted_penalty_winner_team_id: 5
      };

      const actual = {
        home_score: 2,
        away_score: 1,
        penalty_winner_team_id: 5 // impossible, but test ensures we ignore it
      };

      // outcome = 1, exact = 1, penalty = 0 → total = 2
      expect(calculatePoints(prediction, actual, rules)).toBe(2);
    });

    test("returns 0 when everything is wrong", () => {
      const prediction = {
        predicted_home_score: 0,
        predicted_away_score: 3,
        predicted_penalty_winner_team_id: 9
      };

      const actual = {
        home_score: 2,
        away_score: 1,
        penalty_winner_team_id: null
      };

      expect(calculatePoints(prediction, actual, rules)).toBe(0);
    });

    test("scores outcome correctly even without exact or penalty", () => {
      const rulesOutcomeOnly = {
        use_correct_outcome: true,
        use_exact_score: false,
        use_penalty_winner: false
      };

      const prediction = {
        predicted_home_score: 3,
        predicted_away_score: 0,
        predicted_penalty_winner_team_id: null
      };

      const actual = {
        home_score: 2,
        away_score: 1,
        penalty_winner_team_id: null
      };

      // both HOME → outcome = 1
      expect(calculatePoints(prediction, actual, rulesOutcomeOnly)).toBe(1);
    });
  });
});
