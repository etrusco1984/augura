import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import Modal from "../components/Modal";
import ChangePassword from "../pages/ChangePassword";

export default function Sidebar({ closeSidebar }) {
  const navigate = useNavigate();
  const handleLogout = useLogout();
  const { user } = new useUser();
  const isAdmin = user?.is_admin === true;
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <>
      <nav className="sidebar-nav">
        <ul>
          <li className="nav-item" onClick={() => { navigate("/dashboard"); closeSidebar(); }}>
            Dashboard
          </li>

          <li className="nav-item" onClick={() => { navigate("/quinielas"); closeSidebar(); }}>
            Mis Quinielas
          </li>
        </ul>

        {isAdmin && (
          <div className="sidebar-admin-section">
            <span className="admin-title">Admin Section</span>
            <ul>
              <li className="nav-item" onClick={() => { navigate("/admin/games"); closeSidebar(); }}>
                Games
              </li>
              <li className="nav-item" onClick={() => { navigate("/admin/users"); closeSidebar(); }}>
                Users
              </li>
            </ul>
          </div>
        )}

        <div className="sidebar-footer">
          <span 
            style={{ cursor: "pointer" }}
            onClick={() => { setShowPasswordModal(true); closeSidebar(); }}>
            Reset Password
          </span>
          <strong> / </strong>
          <span 
            style={{ cursor: "pointer" }}
            onClick={handleLogout}>
            Logout
          </span>
        </div>
      </nav>

      {showPasswordModal && (
        <Modal onClose={() => setShowPasswordModal(false)}>
          <ChangePassword onSuccess={() => setShowPasswordModal(false)} />
        </Modal>
      )}
    </>
  );
}
