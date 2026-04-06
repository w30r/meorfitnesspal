"use client";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
} from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function Charts() {
  const chartData = [
    { date: "01 Jan", totalCalories: 1186, weight: 105.4 },
    { date: "02 Jan", totalCalories: 1305, weight: 102.4 },
    { date: "03 Jan", totalCalories: 1237, weight: 105.4 },
    { date: "04 Jan", totalCalories: 1173, weight: 102.4 },
    { date: "05 Jan", totalCalories: 1209, weight: 105.4 },
    { date: "06 Jan", totalCalories: 1214, weight: 105.4 },
  ];
  const chartConfig = {
    totalCalories: {
      label: "KCAL",
      color: "var(--primary)",
    },
  } satisfies ChartConfig;
  return (
    <div className="flex flex-col items-center min-h-screen  bg-background dark:bg-background py-20 px-8">
      <h1 className="font-mono text-3xl">Charts</h1>
      <main className="bg-pink-300/0 min-w-screen px-24">
        <ChartContainer config={chartConfig} className="min-h-50 w-auto">
          <AreaChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={true}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area dataKey="totalCalories" fill="var(--secondary)" radius={4} />
            <Area
              dataKey="weight"
              stroke="var(--color-chart-5)"
              fill="var(--color-totalCalories)"
              radius={4}
            />
          </AreaChart>
        </ChartContainer>
      </main>
    </div>
  );
}
