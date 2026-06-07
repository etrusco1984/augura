import { useEffect, useState } from "react";

export default function MyPredictionsCard({ quinielaId, userId }) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quinielaId || !userId) return;

    setLoading(true);

    fetch(`/api/quinielas/${quinielaId}/details`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setPredictions(data.userPredictions || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading predictions:", err);
        setLoading(false);
      });
  }, [quinielaId, userId]);

  if (loading) return <div className="card">Loading my predictions...</div>;

  if (!predictions || predictions.length === 0)
    return <div className="card">You have no predictions yet.</div>;

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">My Predictions</h2>

      <ul className="space-y-2">
        {predictions.map((p, idx) => (
          <li key={idx} className="border rounded p-2">
            <div className="font-medium">
              <strong>
                {p.home_team} {p.predicted_home} – {p.predicted_away} {p.away_team}
              </strong>
            </div>

            {p.predicted_home === p.predicted_away && p.predicted_pk && (
              <div className="text-sm text-gray-600">
                PK Winner: {p.predicted_pk}
              </div>
            )}

            <div className="text-xs text-gray-500">
              {new Date(p.kickoff_at).toLocaleDateString()} — {p.stage_name}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
