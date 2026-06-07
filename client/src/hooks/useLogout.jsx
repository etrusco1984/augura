import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export function useLogout() {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return handleLogout;
}
