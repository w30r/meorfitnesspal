"use client"

import { useState, useEffect, useRef } from "react"
import { getCalorieTrendAction } from "@/app/actions"
import type { CalorieTrendDay } from "@/app/lib/dashboard"

interface UseCalorieTrendResult {
  data: { days: CalorieTrendDay[]; goalCalories: number } | null
  isLoading: boolean
}

export function useCalorieTrend(): UseCalorieTrendResult {
  const [data, setData] = useState<UseCalorieTrendResult["data"]>(null)
  const [isLoading, setIsLoading] = useState(true)
  const abortRef = useRef(false)

  useEffect(() => {
    abortRef.current = false

    getCalorieTrendAction(14).then((result) => {
      if (!abortRef.current) {
        setData(result)
        setIsLoading(false)
      }
    })

    return () => {
      abortRef.current = true
    }
  }, [])

  return { data, isLoading }
}
