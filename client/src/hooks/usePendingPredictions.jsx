import { useEffect, useState } from "react";

export function usePendingPredictions(user_id) {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user_id) return;

    async function fetchPending() {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/predictions/pending/${user_id}`);
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch pending predictions");
        }

        setPending(data.pending);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPending();
  }, [user_id]);

  return { pending, loading, error };
}
