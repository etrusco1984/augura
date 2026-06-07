import { useEffect, useState } from "react";

export function useMyPoints(user_id) {
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user_id) return;

    async function fetchPoints() {
      try {
        const res = await fetch(`/points/user/${user_id}`);
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch points");
        }

        setPoints(data.points);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPoints();
  }, [user_id]);

  return { points, loading, error };
}
