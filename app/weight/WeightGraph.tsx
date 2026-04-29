"use client";

import {
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Bar,
} from "recharts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WeightGraph = ({ data }: { data: any[] }) => {
  return (
    <div className="h-100 w-full pt-4 outline-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          className="outline-none select-none touch-none"
        >
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="hsl(var(--border))"
          />

          <XAxis dataKey="date" axisLine={false} tickLine={false} dy={10} />

          {/* Left Axis - Weight */}
          <YAxis yAxisId="left" domain={["dataMin - 2", "dataMax + 2"]} hide />

          {/* Right Axis - Calories */}
          <YAxis yAxisId="right" orientation="right" hide />

          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              backgroundColor: "hsl(var(--card))",
            }}
          />
          <Legend verticalAlign="top" height={36} />

          {/* Calories as subtle bars in the background */}
          <Bar
            yAxisId="right"
            activeBar={false}
            dataKey="calories"
            fill="var(--accent)"
            opacity={0.2}
            radius={[4, 4, 0, 0]}
            name="Calories In"
          />

          {/* Weight as the sharp focus line */}
          <Area
            activeDot={false}
            yAxisId="left"
            type="monotone"
            dataKey="weight"
            stroke="var(--primary)"
            strokeWidth={4}
            fill="url(#colorWeight)"
            name="Weight (kg)"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeightGraph;
