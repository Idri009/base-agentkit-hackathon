
import { useState, useEffect, useCallback } from "react";
import type { Strategy } from "@/app/types/strategy";

export function useStrategies() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStrategies = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch("/api/strategies");
    const data = await res.json();
    setStrategies(data);
    console.log("useStrategies.ts",data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);
 
  return { strategies, isLoading, loadStrategies: fetchStrategies, setStrategies };
}

