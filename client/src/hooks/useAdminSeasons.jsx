import { useState, useEffect } from "react";

export function useAdminSeasons() {
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAdminSeasons() {
      try {
        const res = await fetch("/api/admin/seasons");
        if (!res.ok) throw new Error("Failed to fetch admin seasons");
        const data = await res.json();
        setSeasons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminSeasons();
  }, []);

  return { seasons, loading, error };
}
