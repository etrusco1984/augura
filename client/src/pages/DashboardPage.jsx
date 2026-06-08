import { useUser } from "../context/UserContext";
import DashboardLayout from "../components/layout/DashboardLayout";
import { useNextGames } from "../hooks/useNextGames";
import { useLastResults } from "../hooks/useLastResults";
import Sidebar from "../components/Sidebar";
import { NextGamesCard } from "../components/NextGamesCard";
import { LastResultsCard } from "../components/LastResultsCard";
import { LeadersCard } from "../components/LeadersCard";
import { MyLastPredictionsCard } from "../components/MyLastPredictionsCard";
import { PendingPredictionsCard } from "../components/PendingPredictionsCard";
import { MyPointsCard } from "../components/MyPointsCard";

export default function DashboardPage() {
  const { user, loading } = useUser();
  const { games: nextGames, loading: loadingNext } = useNextGames();
  const { results: lastResults, loading: loadingLast } = useLastResults();
  const isAdmin = user?.is_admin === true;

  if (loading) return null;
  if (!user) return null;
  
  return (
    <DashboardLayout title={ `Dashboard➔${user.username}`}>

      {/* ROW 1 — GLOBAL CONTEXT */}
      <div className="dashboard-cards">
        <LastResultsCard results={lastResults} loading={loadingLast} />
        <NextGamesCard games={nextGames} loading={loadingNext} />
        <LeadersCard />
      </div>

      {/* ROW 2 — PERSONAL PERFORMANCE */}
      <div className="dashboard-cards">
        <MyLastPredictionsCard user_id={user.user_id} />
        <PendingPredictionsCard user_id={user.user_id} />
        <MyPointsCard user_id={user.user_id} />
      </div>
      
      {/* ROW 3 — ADMIN TOOLS */}
      {isAdmin && (
        <div className="dashboard-cards">
          <div className="card admin-card">
            <h3>Admin Tools</h3>
            <div className="admin-buttons">
              <button>Reset Passwords</button>
              <button>Manage Users</button>
              <button>Invitations</button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
