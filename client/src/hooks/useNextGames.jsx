import { useEffect, useState } from "react";

export function useNextGames() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/dashboard/next-games");
      const data = await res.json();
      setGames(data);
      setLoading(false);
    }
    load();
  }, []);

  return { games, loading };
}
