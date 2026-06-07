import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";

export default function AdminResetPassword() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Only admins can access this page
  useEffect(() => {
    if (!user?.is_admin) {
      navigate("/Unauthorized");
    }
  }, [user, navigate]);

  // Load all users for dropdown
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch("/users/admin", {
          credentials: "include"
        });
        const data = await res.json();
        
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    loadUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedUserId) {
      setError("Please select a user");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`/users/${selectedUserId}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password: newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setSuccess("Password reset successfully");
      setNewPassword("");
      setConfirmPassword("");
      setSelectedUserId("");

    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Admin: Reset User Password</h2>
      <LogoutButton as="span" className="menu-item" />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Select User</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            required
          >
            <option value="">-- Choose a user --</option>
            {users.map((u) => (
              <option key={u.user_id} value={u.user_id}>
                {u.username} ({u.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
}
