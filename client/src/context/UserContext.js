import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on page load
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/auth/me", {
          method: "GET",
          credentials: "include"
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  // Login function
  async function login(email, password) {
    const res = await fetch("/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await res.json();
    setUser(data.user);
    return data.user;
  }

  // Logout function
  async function logout() {
    await fetch("/auth/logout", {
      method: "POST",
      credentials: "include"
    });

    setUser(null);

    const handleLogout = async () => {
      await logout();
      navigate("/login");
    };
  }

  // Register function
  async function register(name, email, password, lang = "en") {
    const res = await fetch("/auth/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, lang })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Registration failed");
    }

    const data = await res.json();
    setUser(data);
    return data;
  }

  return (
    <UserContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
