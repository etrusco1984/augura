import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";

export default function NextMatchesCard({ quinielaId, userId }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quinielaId) return;

    setLoading(true);

    apiFetch(`${process.env.REACT_APP_API_URL}/api/quinielas/${quinielaId}/details`)
      .then(res => res.json())
      .then(data => {
        setMatches(data.nextMatches || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading next matches:", err);
        setLoading(false);
      });
  }, [quinielaId]);

  if (loading) return <div className="card">Loading next matches...</div>;

  if (!matches || matches.length === 0)
    return <div className="card">No upcoming matches.</div>;

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Next Matches</h2>

      <ul className="space-y-2">
        {matches.map((m, idx) => (
          <li key={idx} className="border rounded p-2">
            <div className="font-medium">
              <strong>
                {m.home_team} vs {m.away_team}
              </strong>
            </div>

            <div className="text-sm text-gray-600">
              {new Date(m.kickoff_at).toLocaleDateString()} — {m.stage_name}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
