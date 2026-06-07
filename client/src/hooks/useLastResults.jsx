import { useState, useEffect } from "react";

export function useLastResults() {
  const [lastResults, setLastResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLastResults() {
      try {
        const response = await fetch("/api/dashboard/last-results", {
          credentials: "include",
        });

          if (!response.ok) {
            throw new Error("Failed to fetch last results");
          }

          const data = await response.json();
          setLastResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLastResults();
  }, []);

  return { lastResults, loading, error };
}
