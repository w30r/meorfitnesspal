"use client"

import { PieChart, Pie, Cell, Tooltip } from "recharts"
import {
  ChartContainer,
  type ChartConfig,
} from "@/components/ui/chart"

interface MacroDonutChartProps {
  protein: number
  proteinGoal: number
  carbs: number
  carbsGoal: number
  fats: number
  fatsGoal: number
}

const COLORS = {
  protein: "#22c55e",
  carbs: "#ef4444",
  fats: "#eab308",
}

const chartConfig = {
  protein: { label: "Protein", color: COLORS.protein },
  carbs: { label: "Carbs", color: COLORS.carbs },
  fats: { label: "Fats", color: COLORS.fats },
} satisfies ChartConfig

const LABELS: Record<string, string> = {
  protein: "Protein",
  carbs: "Carbs",
  fats: "Fats",
}

export default function MacroDonutChart({
  protein = 0,
  proteinGoal = 1,
  carbs = 0,
  carbsGoal = 1,
  fats = 0,
  fatsGoal = 1,
}: MacroDonutChartProps) {
  const total = protein + carbs + fats

  if (total === 0) return null

  const data = [
    { name: "protein", value: protein, goal: proteinGoal, fill: COLORS.protein },
    { name: "carbs", value: carbs, goal: carbsGoal, fill: COLORS.carbs },
    { name: "fats", value: fats, goal: fatsGoal, fill: COLORS.fats },
  ]

  return (
    <div className="relative">
      <ChartContainer config={chartConfig} className="min-h-[260px] w-full">
        <PieChart>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              return (
                <div className="rounded-xl border border-border/50 bg-background px-3 py-2 text-xs shadow-xl space-y-1.5">
                  {payload.map((entry) => {
                    const item = entry.payload as { name: string; value: number; goal: number; fill: string }
                    return (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                          style={{ backgroundColor: item.fill }}
                        />
                        <span className="text-muted-foreground">
                          {LABELS[item.name] || item.name}:
                        </span>
                        <span className="font-mono font-medium text-foreground tabular-nums">
                          {item.value.toFixed(1)}g / {item.goal.toFixed(0)}g
                        </span>
                      </div>
                    )
                  })}
                </div>
              )
            }}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={3}
            cornerRadius={6}
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <p className="text-2xl font-black tabular-nums">{total.toFixed(0)}</p>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            total g
          </p>
        </div>
      </div>
    </div>
  )
}
