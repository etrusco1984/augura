import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";

export default function QuinielaRecentResultsCard({ quinielaId }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`${process.env.REACT_APP_API_URL}/api/quinielas/${quinielaId}/details`)
      .then(res => res.json())
      .then(data => {
        setResults(data.recentResults);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading recent results:", err);
        setLoading(false);
      });
  }, [quinielaId]);

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Recent Results</h2>

      {loading && <p>Loading...</p>}

      {!loading && results.length === 0 && (
        <p className="text-gray-500">No recent results available.</p>
      )}

      {!loading && results.length > 0 && (
        <ul className="space-y-2">
          {results.map((r, idx) => (
            <li key={idx} className="border rounded p-2">
              <div className="font-medium">
                <strong>{r.home_team} {r.home_score} - {r.away_score} {r.away_team}</strong>--{new Date(r.match_date).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
