import { useState, useEffect } from "react";
import api from "../api";
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
        const response = await api.get("/api/quinielas", {
          withCredentials: true, 
        });
        setQuinielas(response.data);
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
