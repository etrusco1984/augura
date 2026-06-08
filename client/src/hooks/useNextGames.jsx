import { useEffect, useState } from "react";
import { apiFetch } from "../utils/apiFetch";

export function useNextGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await apiFetch(`${process.env.REACT_APP_API_URL}/api/dashboard/next-games`);
      const data = await res.json();
      setGames(data);
      setLoading(false);
    }
    load();
  }, []);

  return { games, loading };
}
