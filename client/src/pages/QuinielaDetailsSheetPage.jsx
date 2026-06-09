import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import LeaderboardCard from "../components/quinielaDetails/LeaderboardCard";
import QuinielaSheetTable from "../components/quinielaDetails/QuinielaSheetTable";
import { apiFetch } from "../utils/apiFetch";

export default function QuinielaDetailsSheetPage() {
  const { quinielaId } = useParams();
  const { user } = useUser();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    apiFetch(`${process.env.REACT_APP_API_URL}/api/quinielas/${quinielaId}/details`)
      .then(res => res.json())
      .then(data => setDetails(data));
  }, [quinielaId]);

  if (!details) return <div>Loading...</div>;

  const { name, season_name, is_active } = details.baseInfo || {};

  return (
    <DashboardLayout title={name}>
      {/* HEADER */}
      <div className="qd-header">
        <div className="qd-subinfo">
          <span>Season: <strong>{season_name} •••</strong></span>
          <span> Status: <strong>{is_active ? "Active" : "Closed"}</strong></span>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="qd-grid">

        {/* LEFT COLUMN — Excel-style table */}
        <div className="qd-table-wrapper">
          {/* Placeholder — you will plug in your new table here */}
          <div className="qd-table-placeholder">
            <QuinielaSheetTable
              games={details.games}
              allPredictions={details.allPredictions}
            />
          </div>
        </div>

        {/* RIGHT COLUMN — Ranking Summary */}
        <div className="qd-ranking-wrapper">
          <LeaderboardCard quinielaId={quinielaId} />
        </div>

      </div>
    </DashboardLayout>
  );
}
