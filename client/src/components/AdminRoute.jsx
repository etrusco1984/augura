import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but NOT admin → redirect to unauthorized page
  if (!user.is_admin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Logged in AND admin → allow access
  return children;
}
