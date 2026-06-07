import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./context/UserContext";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import AdminRoute from "./components/AdminRoute";
import AdminTestPage from "./pages/AdminTestPage";// temporary test page
import Unauthorized from "./pages/Unauthorized";// temporary test page
import ChangePassword from "./pages/ChangePassword";
import AdminResetPassword from "./pages/AdminResetPassword";
import DashboardPage from "./pages/DashboardPage";
import QuinielasPage from "./pages/QuinielasPage";
import QuinielaDetailsPage from "./pages/QuinielaDetailsPage";
import QuinielaDetailsSheetPage from "./pages/QuinielaDetailsSheetPage";
import PredictionScreen from "./pages/PredictionsScreen";
import GamesScreen from "./pages/GamesScreen"
import UpdateGameScore from "./pages/UpdateGameScore";

// import Dashboard later when it exists

function App() {
  const { loading } = useUser();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/quinielas" element={<QuinielasPage />} />
      <Route path="/quinielas/:quinielaId/details" element={<QuinielaDetailsPage />} />
      <Route path="/quinielas/:quinielaId/details-sheet" element={<QuinielaDetailsSheetPage />} />
      <Route path="/quinielas/:quiniela_id/predictions" element={<PredictionScreen />} />



      {/* Admin */}
      <Route
        path="/admin/games"
        element={
          <AdminRoute>
            <GamesScreen />
          </AdminRoute>
        }
      />

      <Route
        path="/admin/games/:season_id/update-scores"
        element={
          <AdminRoute>
            <UpdateGameScore />
          </AdminRoute>
        }
      />

      <Route
        path="/admin-test"
        element={
          <AdminRoute>
            <AdminTestPage />
          </AdminRoute>
        }
      />

      {/*Private Routes*/}
      <Route
        path="/admin/reset-password"
        element={
          <AdminRoute>
            <AdminResetPassword />
          </AdminRoute>
        }
      />
    </Routes>
  );
}

export default App;
