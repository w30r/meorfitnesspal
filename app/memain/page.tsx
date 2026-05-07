/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getGoalData, getLatestFoodLogs } from "../actions";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
interface DailyStats {
  date: string;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFats: number;
  logCount: number;
}

const fillMissingDays = (data: DailyStats[], days: number) => {
  const fullData: DailyStats[] = [];
  const now = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    const existingDay = data.find((item) => item.date === dateStr);

    if (existingDay) {
      fullData.push(existingDay);
    } else {
      fullData.push({
        date: dateStr,
        totalCalories: 0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFats: 0,
        logCount: 0,
      });
    }
  }
  return fullData;
};
const PERIODS = [7, 14, 30, 90];

export default function Page() {
  const [foodLogs, setFoodLogs] = useState<DailyStats[]>([]);
  const [days, setDays] = useState(30);
  const [calorieGoal, setCalorieGoal] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const currentLog = foodLogs?.find((l) => l.date === selectedDay);

  useEffect(() => {
    const fetchGoal = async () => {
      const res = await getGoalData();
      console.log("🚀 ~ fetchGoal ~ res:", res);
      setCalorieGoal(res[0]?.calories || (1499 as number));
    };
    fetchGoal();
  }, []);

  console.log("🚀 ~ Page ~ calorieGoal:", calorieGoal);

  const formatDay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
  };
  // Calculate Average
  const activeDays = foodLogs.filter((d) => d.logCount > 0);
  const avgCalories = activeDays.length
    ? Math.round(
        activeDays.reduce((acc, curr) => acc + curr.totalCalories, 0) /
          activeDays.length,
      )
    : 0;

  const handlePeriodChange = (p: number) => {
    // Native-like haptic feedback
    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
    setDays(p);
  };

  function MacroDot({
    value,
    color,
    active,
  }: {
    value: number;
    color: string;
    label: string;
    active: boolean;
  }) {
    if (!active) return <div className="h-1 w-full rounded-full bg-muted" />;

    return (
      <div className="flex flex-col items-center flex-1">
        <div className={`h-1 w-full rounded-full ${color} mb-1`} />
        <span className="text-[8px] font-bold opacity-80">
          {Math.round(value)}
        </span>
      </div>
    );
  }

  useEffect(() => {
    const getData = async () => {
      const response = await getLatestFoodLogs(days);

      if (response.success && response.data) {
        // --- THIS IS WHERE THE MAGIC HAPPENS ---
        const completedData = fillMissingDays(
          response.data as DailyStats[],
          days,
        );
        setFoodLogs(completedData);
        // ---------------------------------------
      } else {
        setFoodLogs([]);
      }
    };
    getData();
  }, [days]);

  console.log("🚀 ~ Page ~ foodLogs:", foodLogs);

  const getHeatClass = (calories: number, goal: number) => {
    if (calories === 0) return "bg-muted/10 text-muted-foreground/40";
    const ratio = calories / goal;

    if (ratio < 0.3) return "bg-primary/10 text-primary";
    if (ratio < 0.6) return "bg-primary/30 text-primary";
    if (ratio < 0.9) return "bg-primary/60 text-primary-foreground";
    return "bg-primary text-primary-foreground font-black shadow-inner"; // "Goal" state
  };
  return (
    <div className="max-w-5xl mx-12 p-4 space-y-6 ">
      {/* 1. Period Selector Container */}
      <div className="flex flex-col items-center gap-4">
        <Button
          className="self-start"
          variant="outline"
          onClick={() => redirect("/")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="bg-muted p-1 rounded-xl flex w-full max-w-sm">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                days === p
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}D
            </button>
          ))}
        </div>
        {/* 2. Mini Summary Info */}
        <div className="text-center animate-in fade-in slide-in-from-top-1">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            Average Daily Intake
          </p>
          <h2 className="text-4xl font-black">
            {avgCalories}{" "}
            <span className="text-sm font-medium text-muted-foreground">
              kcal
            </span>
            {/* <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
              You should be losing {calorieGoal - avgCalories} kcal
            </p> */}
          </h2>
        </div>
      </div>

      {/* 3. The Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-10 gap-2">
        {foodLogs.map((item) => {
          const hasData = item.logCount > 0;
          const isSelected = selectedDay === item.date;
          const heatClass = getHeatClass(item.totalCalories, calorieGoal);

          return (
            <button
              key={item.date}
              onClick={() => setSelectedDay(isSelected ? null : item.date)}
              className={`
          aspect-square flex flex-col items-center justify-center rounded-xl border transition-all active:scale-95
          ${heatClass}
          ${isSelected ? "ring-2 ring-ring ring-offset-2 scale-105 z-10" : "border-transparent"}
        `}
            >
              <span className="text-[9px] uppercase opacity-60 font-bold mb-0.5">
                {new Date(item.date).toLocaleDateString("en-US", {
                  day: "numeric",
                })}
              </span>

              <span className="text-sm font-bold leading-none">
                {hasData ? Math.round(item.totalCalories) : "—"}
              </span>

              {/* Small indicator dots for macros at the bottom of the square */}
              {hasData && (
                <div className="flex gap-0.5 mt-1">
                  <div className="h-1 w-1 rounded-full bg-current opacity-40" />
                  <div className="h-1 w-1 rounded-full bg-current opacity-40" />
                  <div className="h-1 w-1 rounded-full bg-current opacity-40" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground self-end">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-sm bg-muted/20" />
          <div className="h-3 w-3 rounded-sm bg-purple-900/30" />
          <div className="h-3 w-3 rounded-sm bg-purple-700/50" />
          <div className="h-3 w-3 rounded-sm bg-purple-500" />
          <div className="h-3 w-3 rounded-sm bg-purple-400" />
        </div>
        <span>More (Goal)</span>
      </div>

      {/* 4. Detail View (Drawer-like) */}
      {selectedDay && (
        <div className="fixed bottom-6 left-4 right-4 animate-in fade-in slide-in-from-bottom-4">
          <Card className="p-4 shadow-2xl border-t-4 border-primary bg-card/95 backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-black text-lg">
                {formatDay(selectedDay)} Details
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-xs text-muted-foreground"
              >
                Close
              </button>
            </div>
            {/* Find the actual log from the array to show specific macro numbers */}
            {currentLog && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-[10px] text-emerald-500 font-bold">
                    CARBS
                  </p>
                  <p className="text-xl font-bold">
                    {/* 3. TypeScript now knows currentLog is safe to use */}
                    {Math.round(currentLog.totalCarbs)}g
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-rose-500 font-bold">PROTEIN</p>
                  <p className="text-xl font-bold">
                    {Math.round(currentLog.totalProtein)}g
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-amber-500 font-bold">FATS</p>
                  <p className="text-xl font-bold">
                    {Math.round(currentLog.totalFats)}g
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
