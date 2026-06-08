import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import Modal from "../components/Modal";
import ChangePassword from "../pages/ChangePassword";

export default function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = useLogout();
  const { user } = new useUser();
  const isAdmin = user?.is_admin === true;
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <>
      <nav className="sidebar-nav">
        <ul>
          <li className="nav-item" onClick={() => navigate("/dashboard")}>
            Dashboard
          </li>

          <li className="nav-item" onClick={() => navigate("/quinielas")}>
            Mis Quinielas
          </li>
          {/*
          <li className="nav-item" onClick={() => navigate("/predictions")}>
            My Predictions
          </li>
          <li className="nav-item" onClick={() => navigate("/results")}>
            Results
          </li>
          */}
        </ul>
        {isAdmin && (
          <div className="sidebar-admin-section">
            <span className="admin-title">Admin Section</span>
            <ul>
              <li className="nav-item" onClick={() => navigate("/admin/games")}>
                Games
              </li>
              <li className="nav-item" onClick={() => navigate("/admin/users")}>
                Users
              </li>
              {/*
              <li className="nav-item" onClick={() => navigate("/admin/invitations")}>
                Invitations
              </li>
              <li className="nav-item" onClick={() => navigate("/admin/settings")}>
                Settings
              </li>
              */}
            </ul>
          </div>
        )}
        <div className="sidebar-footer">
          <span
            className="cursor-pointer text-gray-700 hover:text-blue-600"
            style={{ cursor: "pointer" }}
            onClick={() => setShowPasswordModal(true)}
          >
            Reset Password
          </span>
          <strong> / </strong>
          <span
            className="cursor-pointer text-gray-700 hover:text-red-600"
            style={{ cursor: "pointer" }}
            onClick={handleLogout}
          >
            Logout
          </span>
        </div>
      </nav>

      {
      showPasswordModal && (
        <Modal onClose={() => setShowPasswordModal(false)}>
          <ChangePassword onSuccess={() => setShowPasswordModal(false)} />
        </Modal>
      )}
    </>
  );
}
