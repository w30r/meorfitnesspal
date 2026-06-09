"use client"

import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import type { StreakData } from "@/app/lib/dashboard"

interface StreakCardProps {
  data: StreakData
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function getDayLabel(index: number): string {
  const today = new Date().getDay()
  const dayIndex = (today - (6 - index) + 7) % 7
  return DAY_LABELS[dayIndex]
}

export default function StreakCard({ data }: StreakCardProps) {
  if (data.current === 0) return null

  const { current, personalBest, last7Days, nextMilestone, daysUntilNextMilestone } = data

  const showMilestone = daysUntilNextMilestone > 0 && daysUntilNextMilestone <= 7

  return (
    <div className="bg-card border border-border rounded-[2.5rem] p-4 shadow-sm h-full aspect-square">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Streak
          </span>
        </div>
        {personalBest > current && (
          <span className="text-[10px] text-muted-foreground font-medium">
            Best: {personalBest}d
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-4xl font-black tabular-nums">{current}</span>
        <span className="text-sm font-medium text-muted-foreground">
          day{current !== 1 ? "s" : ""}
        </span>
      </div>

      {showMilestone && (
        <p className="text-[11px] text-muted-foreground mb-3 font-medium">
          {daysUntilNextMilestone} more day{daysUntilNextMilestone !== 1 ? "s" : ""} to{" "}
          <span className="text-orange-400 font-bold">{nextMilestone}-day</span> streak!
        </p>
      )}

      <div className="flex items-center gap-1.5">
        {last7Days.map((active, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full transition-colors",
              active
                ? "bg-orange-500 shadow-sm shadow-orange-500/30"
                : i === 6
                  ? "bg-muted-foreground/20 ring-1 ring-border"
                  : "bg-muted-foreground/10",
            )}
            title={`${getDayLabel(i)}${active ? " (logged)" : ""}`}
          />
        ))}
      </div>
    </div>
  )
}
