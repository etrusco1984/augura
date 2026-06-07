import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import BaseInfoCard from "../components/quinielaDetails/BaseInfoCard";
import NextMatchesCard from "../components/quinielaDetails/NextMatchesCard";
import MyPredictionsCard from "../components/quinielaDetails/MyPredictionsCard";
import LeaderboardCard from "../components/quinielaDetails/LeaderboardCard";
import RecentResultsCard from "../components/quinielaDetails/RecentResultsCard";
import { useUserQuinielas } from "../hooks/useUserQuinielas";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Link } from "react-router-dom";

export default function QuinielasPage({ userId }) {
  const { user } = useUser();

  const { quinielas, loading, error } = useUserQuinielas(user?.user_id);
  const [openId, setOpenId] = useState(null);
  console.log("Quinielas RECEIVED:", quinielas);

  if (!user) {
    return <div className="p-4 text-gray-500">Loading user…</div>;
  }
  if (loading) return <div className="p-4 text-gray-500">Loading…</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <DashboardLayout title="My Quinielas">
        <div classname="table-container">
          <table className="quiniela-table">
            <thead>
              <tr className="border-b bg-gray-100 text-left">
                <th className="p-2">Quiniela</th>
                <th className="p-2">Season</th>
                <th className="p-2">Status</th>
                <th className="p-2">Created at</th>
                <th className="p-2">Points</th>
                <th className="p-2">Rank</th>
                <th className="p-2">Expand</th>
              </tr>
            </thead>

            <tbody>
              {quinielas.map((q) => (
                <React.Fragment key={q.quiniela_id}>
                  <tr className="border-b">
                    <td className="p-2">{q.quiniela_name}</td>
                    <td className="p-2">{q.season_name}</td>
                    <td className="p-2">
                      {q.is_active ? "Active" : "Closed"}
                    </td>
                    <td className="p-2">
                      {new Date(q.created_at).toLocaleDateString() || "—"}
                    </td>
                    <td className="p-2">
                      {q.total_points !== null ? q.total_points : "—"}
                    </td>
                    <td className="p-2">
                      {q.user_rank || "—"}
                    </td>
                    <td className="p-2">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() =>
                          setOpenId(openId === q.quiniela_id ? null : q.quiniela_id)
                        }
                      >
                        {openId === q.quiniela_id ? "▼" : "▶"}
                      </button>
                    </td>
                  </tr>

                  {openId === q.quiniela_id && (
                    <tr className="bg-gray-50 border-b">
                      <td colSpan="7" className="p-4">
                        <div className="space-y-2">
                          <div>• Players: {q.players_count || "—"}</div>
                          <div>• Next game: {q.next_game || "—"}</div>
                          <Link to={`/quinielas/${q.quiniela_id}/details-sheet`}
                            className="mt-2 block text-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            Enter Quiniela
                          </Link> •••
                          <Link
                            to={`/quinielas/${q.quiniela_id}/predictions`}
                            className="mt-2 block text-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            Fill Predictions
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
