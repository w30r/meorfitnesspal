"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { CalorieTrendDay } from "@/app/lib/dashboard";

interface CalorieTrendChartProps {
  days: CalorieTrendDay[];
  goalCalories: number;
}

function formatDateLabel(dateStr: string) {
  const [, month, day] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${parseInt(day)} ${months[parseInt(month) - 1].slice(0, 3)}`;
}

export default function CalorieTrendChart({ days, goalCalories }: CalorieTrendChartProps) {
  const maxCalories = Math.max(
    ...days.map((d) => d.calories),
    goalCalories,
  );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={days} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="calorieFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="var(--color-border)"
          strokeOpacity={0.4}
        />

        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
          tickFormatter={formatDateLabel}
          interval="preserveStartEnd"
          minTickGap={30}
        />

        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
          tickFormatter={(v) => `${v}`}
          domain={[0, Math.ceil(maxCalories * 1.15)]}
          width={36}
        />

        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload?.length) return null;
            const day = payload[0]?.payload as CalorieTrendDay | undefined;
            if (!day) return null;

            return (
              <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-lg text-xs space-y-1">
                <p className="font-bold text-foreground">{formatDateLabel(String(label))}</p>
                <p className="text-chart-1 font-semibold">
                  {day.calories.toFixed(0)} kcal
                  <span className="text-muted-foreground font-normal ml-1">
                    / {goalCalories} goal
                  </span>
                </p>
                <div className="text-muted-foreground space-y-0.5 pt-0.5 border-t border-border/50">
                  <p>P: {day.protein.toFixed(0)}g</p>
                  <p>C: {day.carbs.toFixed(0)}g</p>
                  <p>F: {day.fats.toFixed(0)}g</p>
                </div>
              </div>
            );
          }}
        />

        <ReferenceLine
          y={goalCalories}
          stroke="var(--color-muted-foreground)"
          strokeDasharray="6 3"
          strokeOpacity={0.5}
          strokeWidth={1.5}
          label={{
            value: "goal",
            position: "insideTopRight",
            fill: "var(--color-muted-foreground)",
            fontSize: 9,
            fontWeight: 600,
          }}
        />

        <Area
          type="monotone"
          dataKey="calories"
          stroke="var(--color-chart-1)"
          strokeWidth={2}
          fill="url(#calorieFill)"
          dot={false}
          activeDot={{
            r: 4,
            fill: "var(--color-chart-1)",
            stroke: "var(--color-card)",
            strokeWidth: 2,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
