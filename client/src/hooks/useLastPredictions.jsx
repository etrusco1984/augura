import { useEffect, useState } from "react";
import { apiFetch } from "../utils/apiFetch";

export function useLastPredictions(user_id) {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLastPredictions() {
      try {
        const res = await apiFetch(`${process.env.REACT_APP_API_URL}/api/predictions/last`);
        const data = await res.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to fetch last predictions");
        }

        setPredictions(data.predictions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLastPredictions();
  }, [user_id]);

  return { predictions, loading, error };
}
