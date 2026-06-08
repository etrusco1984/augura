import { useState, useEffect } from "react";
import { apiFetch } from "../utils/apiFetch";
import { useUser } from "../context/UserContext";

export function useUserQuinielas() {
  const { user } = useUser();
  const [quinielas, setQuinielas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const res = await apiFetch(
          `${process.env.REACT_APP_API_URL}/api/quinielas`
        );
        if (!res.ok) throw new Error("Unable to load quinielas");

        const data = await res.json();
        setQuinielas(data);
      } catch (err) {
        setError("Unable to load quinielas");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  return { quinielas, loading, error };
}
