import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

export default function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = useLogout();

  return (
    <nav className="sidebar-nav">
      <ul>
        <li className="nav-item" onClick={() => navigate("/dashboard")}>
          Dashboard
        </li>
        <li className="nav-item" onClick={() => navigate("/quinielas")}>
          My Quinielas
        </li>
        <li className="nav-item" onClick={() => navigate("/predictions")}>
          My Predictions
        </li>
        <li className="nav-item" onClick={() => navigate("/results")}>
          Results
        </li>
      </ul>

      <div className="sidebar-admin-section">
        <span className="admin-title">Admin Section</span>
        <ul>
          <li className="nav-item" onClick={() => navigate("/admin/games")}>
            Games
          </li>
          <li className="nav-item" onClick={() => navigate("/admin/users")}>
            Users
          </li>
          <li className="nav-item" onClick={() => navigate("/admin/invitations")}>
            Invitations
          </li>
          <li className="nav-item" onClick={() => navigate("/admin/settings")}>
            Settings
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <span
          className="cursor-pointer text-gray-700 hover:text-red-600"
          style={{ cursor: "pointer" }}
          onClick={handleLogout}
        >
          Logout
        </span>
      </div>
    </nav>
  );
}
