/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getLatestFoodLogs } from "../actions";
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
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

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
  return (
    <div className="max-w-5xl mx-12 p-4 space-y-6">
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
          </h2>
        </div>
      </div>

      {/* 3. The Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {foodLogs.map((item) => {
          const hasData = item.logCount > 0;
          const isSelected = selectedDay === item.date;

          return (
            <button
              key={item.date}
              onClick={() => setSelectedDay(isSelected ? null : item.date)}
              className={`relative flex flex-col items-center justify-between p-3 rounded-2xl border transition-all active:scale-95 ${
                hasData
                  ? isSelected
                    ? "border-primary ring-2 ring-primary/20 bg-card"
                    : "bg-card border-border shadow-sm"
                  : "bg-muted/30 border-transparent opacity-40"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                {formatDay(item.date)}
              </span>

              <div className="my-2 text-center">
                <span
                  className={`text-xl font-black leading-none ${hasData ? "text-foreground" : "text-muted-foreground/40"}`}
                >
                  {hasData ? Math.round(item.totalCalories) : "—"}
                </span>
              </div>

              <div className="flex w-full justify-between gap-1 mt-1">
                <MacroDot
                  value={item.totalCarbs}
                  color="bg-emerald-500"
                  active={hasData}
                  label=""
                />
                <MacroDot
                  value={item.totalProtein}
                  color="bg-rose-500"
                  active={hasData}
                />
                <MacroDot
                  value={item.totalFats}
                  color="bg-amber-500"
                  active={hasData}
                  label=""
                />
              </div>

              {item.logCount > 1 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                  {item.logCount}
                </span>
              )}
            </button>
          );
        })}
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
            {foodLogs.find((l) => l.date === selectedDay) && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-[10px] text-emerald-500 font-bold">
                    CARBS
                  </p>
                  <p className="text-xl font-bold">
                    {foodLogs &&
                      Math.round(
                        foodLogs.find((l) => l.date === selectedDay).totalCarbs,
                      )}
                    g
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-rose-500 font-bold">PROTEIN</p>
                  <p className="text-xl font-bold">
                    {Math.round(
                      foodLogs.find((l) => l.date === selectedDay).totalProtein,
                    )}
                    g
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-amber-500 font-bold">FATS</p>
                  <p className="text-xl font-bold">
                    {Math.round(
                      foodLogs.find((l) => l.date === selectedDay).totalFats,
                    )}
                    g
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
