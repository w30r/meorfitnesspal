"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { AchievementState } from "@/app/lib/achievements"

interface AchievementBadgesProps {
  achievements: AchievementState[]
  newlyUnlocked: string[]
  isLoading?: boolean
}

export default function AchievementBadges({
  achievements,
  newlyUnlocked,
  isLoading,
}: AchievementBadgesProps) {
  const [animateIds, setAnimateIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (newlyUnlocked.length > 0) {
      setAnimateIds((prev) => {
        const next = new Set(prev)
        newlyUnlocked.forEach((id) => next.add(id))
        return next
      })
      const timer = setTimeout(() => setAnimateIds(new Set()), 4000)
      return () => clearTimeout(timer)
    }
  }, [newlyUnlocked])

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-24 h-28 rounded-2xl bg-card border border-border animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (achievements.length === 0) return null

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
      {achievements.map((a) => {
        const isNew = animateIds.has(a.id)
        return (
          <div
            key={a.id}
            className={cn(
              "shrink-0 w-24 flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition-all duration-500",
              a.unlockedAt
                ? "bg-card border-border/80"
                : "bg-muted/30 border-border/30 opacity-60",
              isNew && "animate-in zoom-in-110 fade-in",
            )}
          >
            <span className="text-2xl leading-none">{a.icon}</span>
            <span
              className={cn(
                "text-[10px] font-bold text-center leading-tight",
                a.unlockedAt ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {a.name}
            </span>
            <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  a.unlockedAt ? "bg-primary" : "bg-muted-foreground/30",
                )}
                style={{ width: `${a.progress}%` }}
              />
            </div>
            <span className="text-[9px] text-muted-foreground tabular-nums">
              {a.unlockedAt
                ? "Done!"
                : `${Math.min(a.currentValue, a.progressTarget)}/${a.progressTarget}`}
            </span>
          </div>
        )
      })}
    </div>
  )
}
