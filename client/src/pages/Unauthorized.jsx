import LogoutButton from "../components/LogoutButton";
import { useNavigate } from "react-router-dom";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <><div style={{ padding: "2rem" }}>
      <LogoutButton as="span" className="menu-item" />
      <span onClick={() => navigate("/change-password")}>Change Password</span>
    </div>
      <div style={{ padding: "2rem" }}>
        <h1>Unauthorized</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    </>
  );
}
