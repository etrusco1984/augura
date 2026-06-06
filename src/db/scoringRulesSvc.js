import pool from "../db/pool.js";

// CREATE RULE
export async function createScoringRule({
  name,
  description,
  use_correct_outcome,
  use_exact_score,
  use_penalty_winner
}) {
  const result = await pool.query(
    `INSERT INTO scoring_rules (
        name,
        description,
        use_correct_outcome,
        use_exact_score,
        use_penalty_winner
     )
     VALUES ($1, $2, $3, $4, $5)
     RETURNING rule_id, name, description,
               use_correct_outcome, use_exact_score,
               use_penalty_winner, created_at`,
    [
      name,
      description,
      use_correct_outcome,
      use_exact_score,
      use_penalty_winner
    ]
  );

  return result.rows[0];
}

// GET ALL RULES
export async function getScoringRules() {
  const result = await pool.query(
    `SELECT rule_id, name, description,
            use_correct_outcome, use_exact_score,
            use_penalty_winner, created_at
     FROM scoring_rules
     ORDER BY rule_id`
  );

  return result.rows;
}

// GET RULE BY ID
export async function getScoringRuleById(rule_id) {
  const result = await pool.query(
    `SELECT rule_id, name, description,
            use_correct_outcome, use_exact_score,
            use_penalty_winner, created_at
     FROM scoring_rules
     WHERE rule_id = $1`,
    [rule_id]
  );

  return result.rows[0];
}

// UPDATE RULE
export async function updateScoringRule(rule_id, {
  name,
  description,
  use_correct_outcome,
  use_exact_score,
  use_penalty_winner
}) {
  const result = await pool.query(
    `UPDATE scoring_rules
     SET name = $1,
         description = $2,
         use_correct_outcome = $3,
         use_exact_score = $4,
         use_penalty_winner = $5
     WHERE rule_id = $6
     RETURNING rule_id, name, description,
               use_correct_outcome, use_exact_score,
               use_penalty_winner, created_at`,
    [
      name,
      description,
      use_correct_outcome,
      use_exact_score,
      use_penalty_winner,
      rule_id
    ]
  );

  return result.rows[0];
}
