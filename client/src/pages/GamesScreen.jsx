import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useAdminSeasons } from "../hooks/useAdminSeasons";

export default function GamesScreen() {
  const { seasons, loading, error } = useAdminSeasons();
  const [openId, setOpenId] = useState(null);

  if (loading) return <div className="p-4 text-gray-500">Loading…</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <DashboardLayout title="Games Overview">
        <div className="table-container">
          <table className="quiniela-table">
            <thead>
              <tr className="border-b bg-gray-100 text-left">
                <th className="p-2">Quiniela</th>
                <th className="p-2">Season</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created at</th>
                <th className="p-2">Expand</th>
              </tr>
            </thead>

            <tbody>
              {seasons.map((s) => (
                <React.Fragment key={s.quiniela_id}>
                  <tr className="border-b">
                    <td className="p-2">{s.quiniela_name}</td>
                    <td className="p-2">{s.season_name}</td>
                    <td className="p-2">
                      {s.is_active ? "Active" : "Closed"}
                    </td>
                    <td className="p-2">
                      {new Date(s.created_at).toLocaleDateString() || "—"}
                    </td>
                    <td className="p-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() =>
                          setOpenId(openId === s.quiniela_id ? null : s.quiniela_id)
                        }
                      >
                        {openId === s.quiniela_id ? "▼" : "▶"}
                      </button>
                    </td>
                  </tr>

                  {openId === s.quiniela_id && (
                    <tr className="bg-gray-50 border-b">
                      <td colSpan="5" className="p-4">
                        <div className="space-y-3">

                          <Link
                            to={`/admin/games/${s.season_id}/update-scores`}
                            className="block text-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                          >
                            Update Scores 
                          </Link>
                          •••
                          <Link
                            to={`/admin/games/${s.season_id}/manage`}
                            className="block text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                          >
                             Manage Games
                          </Link>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardLayout>
    </div>
  );
}
