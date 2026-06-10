"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getDashboardData } from "@/app/actions";
import type { DashboardData } from "@/app/lib/dashboard";

export function useDashboard(date: string) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [prevDate, setPrevDate] = useState(date);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  if (date !== prevDate) {
    setPrevDate(date);
    setIsLoading(true);
  }

  useEffect(() => {
    abortRef.current = false;

    getDashboardData(date)
      .then((result) => {
        if (!abortRef.current) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (!abortRef.current) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard");
          console.error("useDashboard error:", err);
        }
      })
      .finally(() => {
        if (!abortRef.current) {
          setIsLoading(false);
        }
      });

    return () => {
      abortRef.current = true;
    };
  }, [date]);

  const refetch = useCallback(() => {
    abortRef.current = false;
    setIsLoading(true);

    getDashboardData(date)
      .then((result) => {
        if (!abortRef.current) {
          setData(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (!abortRef.current) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard");
        }
      })
      .finally(() => {
        if (!abortRef.current) {
          setIsLoading(false);
        }
      });
  }, [date]);

  return { data, isLoading, error, refetch };
}
