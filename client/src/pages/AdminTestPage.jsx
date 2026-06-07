import LogoutButton from "../components/LogoutButton";
import { useNavigate, Link } from "react-router-dom";

export default function AdminTestPage() {
  const navigate = useNavigate();

  return (
    <>
      <div style={{ padding: "2rem" }}>
        <LogoutButton as="span" className="menu-item" />
        <span><Link to="/admin/reset-password">Reset User Password</Link></span>
        <span onClick={() => navigate("/change-password")}>Change Password</span>
      </div>
      <div style={{ padding: "2rem" }}>
        <h1>Admin OK</h1>
        <p>You are viewing an admin‑only test page.</p>
      </div>
    </>
  );
}
