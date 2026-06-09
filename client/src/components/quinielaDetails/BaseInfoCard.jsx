import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/apiFetch";

export default function BaseInfoCard({ quinielaId }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!quinielaId) return; // wait until ID exists

    setLoading(true);

    apiFetch(`${process.env.REACT_APP_API_URL}/api/quinielas/${quinielaId}/details`)
      .then(res => res.json())
      .then(data => {
        setInfo(data.baseInfo);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading base info:", err);
        setLoading(false);
      });
  }, [quinielaId]);

  if (loading) return <div className="card">Loading base info...</div>;

  if (!info) return <div className="card">No base info available.</div>;

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-2">Base Info</h2>
      <div className="text-sm text-gray-700 space-y-1">
        <div><strong>Name:</strong> {info.name}</div>
        <div><strong>Season:</strong> {info.season_name}</div>
        <div><strong>Active:</strong> {info.is_active ? "Yes" : "No"}</div>
      </div>
    </div>
  );
}
