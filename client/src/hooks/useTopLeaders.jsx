import { useEffect, useState } from "react";
import { apiFetch } from "../utils/apiFetch";

export function useTopLeaders() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopLeaders() {
      try {
        const res = await apiFetch(`${process.env.REACT_APP_API_URL}/leaderboard/top`);
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch leaders");
        }

        setLeaders(data.leaders);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTopLeaders();
  }, []);

  return { leaders, loading, error };
}
