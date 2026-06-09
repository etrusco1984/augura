import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";
import BaseInfoCard from "../components/quinielaDetails/BaseInfoCard";
import NextMatchesCard from "../components/quinielaDetails/NextMatchesCard";
//import MyPredictionsCard from "../components/quinielaDetails/MyPredictionsCard";
import LeaderboardCard from "../components/quinielaDetails/LeaderboardCard";
import RecentResultsCard from "../components/quinielaDetails/RecentResultsCard";
import DashboardLayout from "../components/layout/DashboardLayout"; 
import { apiFetch } from "../utils/apiFetch";

export default function QuinielaDetailsPage() {
  const { quinielaId } = useParams();
  const [details, setDetails] = useState(null);
  const { user } = useUser();
  useEffect(() => {
    apiFetch(`${process.env.REACT_APP_API_URL}/api/quinielas/${quinielaId}/details`)
      .then(res => res.json())
      .then(data => setDetails(data));
  }, [quinielaId]);

  if (!details) return <div>Loading...</div>;

  return (
    <div>      
      <DashboardLayout title="Quiniela Details">
        <BaseInfoCard quinielaId={quinielaId} />
        <NextMatchesCard quinielaId={quinielaId} />
        {/*<MyPredictionsCard quinielaId={quinielaId} userId={user.user_id} /> */}
        <LeaderboardCard quinielaId={quinielaId} />
        <RecentResultsCard quinielaId={quinielaId} />
      </DashboardLayout>
    </div>
  );
}
