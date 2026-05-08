"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Weight,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getFoodLogbyDate,
  getGoalData,
  getWeightLogs,
  getStreak,
} from "./actions";
import KadUtama from "@/components/kadutama";
import { cn } from "@/lib/utils";
import { BsQuestion } from "react-icons/bs";

// Interfaces remain unchanged for functionality
export interface FoodEntry {
  _id: string;
  foodName: string;
  servingSize: string | number;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  date: string;
  meal: string;
}

export interface FoodLogResponse {
  logs: FoodEntry[];
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFats: number;
}

interface Goal {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatShortDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${day} ${months[parseInt(month) - 1]} ${year}`;
}

export default function Home() {
  const [today, setToday] = useState(new Date());
  const [goal, setGoal] = useState<Goal | null>(null);
  const [foodLog, setFoodLog] = useState<FoodLogResponse | null>(null);
  const [isGoalLoading, setIsGoalLoading] = useState(true);
  const [weeklyWeightAvg, setWeeklyWeightAvg] = useState<number | null>(null);
  const [prevWeekWeightAvg, setPrevWeekWeightAvg] = useState<number | null>(
    null,
  );
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dateLoading, setDateLoading] = useState(false);

  const isToday = formatDate(today) === formatDate(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDateLoading(true);
        const data = await getFoodLogbyDate(formatDate(today));
        setFoodLog(data);
        setLoading(false);
      } catch {
        console.error("Failed to get food log");
        setLoading(false);
      } finally {
        setDateLoading(false);
      }
    };
    fetchData();
  }, [today]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGoalData();
        setGoal(data[0]);
        setIsGoalLoading(false);
      } catch {
        console.error("Failed to get goal data");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchWeightData = async () => {
      try {
        const weightData = (await getWeightLogs()) as unknown as {
          date: string;
          weight: number;
        }[];
        if (weightData && weightData.length > 0) {
          const now = new Date();
          const oneWeekAgo = new Date(now);
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const twoWeeksAgo = new Date(now);
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

          const thisWeekEntries = weightData.filter((w) => {
            const parts = w.date.split("-");
            const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            return d >= oneWeekAgo && d <= now;
          });

          const lastWeekEntries = weightData.filter((w) => {
            const parts = w.date.split("-");
            const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            return d >= twoWeeksAgo && d < oneWeekAgo;
          });

          if (thisWeekEntries.length > 0) {
            const avg =
              thisWeekEntries.reduce((sum, w) => sum + (w.weight || 0), 0) /
              thisWeekEntries.length;
            setWeeklyWeightAvg(avg);
          }

          if (lastWeekEntries.length > 0) {
            const avg =
              lastWeekEntries.reduce((sum, w) => sum + (w.weight || 0), 0) /
              lastWeekEntries.length;
            setPrevWeekWeightAvg(avg);
          }
        }
      } catch {
        console.error("Failed to get weight data");
      }
    };
    fetchWeightData();
  }, []);

  useEffect(() => {
    const fetchStreak = async () => {
      try {
        const streakCount = await getStreak();
        console.log("🚀 ~ fetchStreak ~ streakCount:", streakCount);
        setStreak(streakCount);
      } catch {
        console.error("Failed to get streak");
      }
    };
    fetchStreak();
  }, []);

  const handlePrevDay = () => {
    const prevDate = new Date(today);
    prevDate.setDate(prevDate.getDate() - 1);
    setToday(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + 1);
    setToday(nextDate); // Fixed: was prevDate
  };

  const handleGoToToday = () => {
    setToday(new Date());
  };

  const caloriePercentage = goal
    ? Math.round(((foodLog?.totalCalories || 0) / goal.calories) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Date Navigation Header */}
      <header className="sticky top-0 z-20 w-full bg-background/80 backdrop-blur-sm border-b border-border supports-backdrop-filter:bg-background/30">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevDay}
            className="hover:bg-accent rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <h1 className="text-sm font-bold uppercase tracking-wider">
                {isToday ? "Today" : formatShortDate(formatDate(today))}
              </h1>
              {!isToday && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGoToToday}
                  className="text-[10px] h-6 px-2 font-medium"
                >
                  Today
                </Button>
              )}
            </div>
            {isToday && (
              <span className="text-[10px] text-muted-foreground font-medium">
                {formatShortDate(formatDate(today))}
              </span>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextDay}
            className="hover:bg-accent rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-4 space-y-3">
        {/* Mini Stats Column - This Week's Avg + Streak */}
        <div className="space-y-8">
          {/* Weekly Weight Average - Mini */}
          {weeklyWeightAvg && (
            <Link href="/weight">
              <div className="bg-card border border-border rounded-[2.5rem] p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      This Week&apos;s Avg
                    </span>
                  </div>
                  {prevWeekWeightAvg && (
                    <p
                      className={cn(
                        "text-xs font-medium",
                        weeklyWeightAvg < prevWeekWeightAvg
                          ? "text-green-500"
                          : "text-red-500",
                      )}
                    >
                      {weeklyWeightAvg < prevWeekWeightAvg ? "↓" : "↑"}{" "}
                      {Math.abs(weeklyWeightAvg - prevWeekWeightAvg).toFixed(1)}
                      kg
                    </p>
                  )}
                </div>
                <p className="text-2xl font-black mt-1">
                  {weeklyWeightAvg.toFixed(1)}
                  <span className="text-sm font-medium text-muted-foreground ml-1">
                    kg
                  </span>
                </p>
              </div>
            </Link>
          )}

          {/* Streak - Mini */}
          {streak > 0 && (
            <div className="bg-card border border-border rounded-[2.5rem] p-4 shadow-sm mt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Current Streak
                  </span>
                </div>
              </div>
              <p className="text-2xl font-black mt-1">
                {streak}
                <span className="text-sm font-medium text-muted-foreground ml-1">
                  day{streak !== 1 ? "s" : ""}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Main Calorie Ring/Progress Card */}
        <section className="relative overflow-hidden bg-card border border-border rounded-[2.5rem] p-4 shadow-sm">
          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Energy Balance
            </h2>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-black tracking-tighter text-foreground">
                {foodLog?.totalCalories?.toFixed(0) || 0}
              </span>
              <span className="text-xl font-medium text-muted-foreground italic">
                / {goal?.calories || 0}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0">kcal consumed</p>

            <div className="w-full mt-4 space-y-2">
              <div className="flex justify-between text-xs font-bold px-1">
                <span className="text-primary">
                  {caloriePercentage}% of daily goal
                </span>
                <span className="text-muted-foreground">
                  {Math.max(
                    0,
                    (goal?.calories || 0) - (foodLog?.totalCalories || 0),
                  ).toFixed(0)}{" "}
                  left
                </span>
              </div>
              <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-700 ease-out",
                    "bg-primary",
                    caloriePercentage > 50 &&
                      "bg-linear-to-r from-primary to-orange-500",
                    caloriePercentage > 80 && "from-primary to-red-500",
                    caloriePercentage >= 100 && "bg-red-500",
                  )}
                  style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
                />
              </div>
              <div className="mt-4">
                {foodLog && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="flex-1 text-xs"
                  >
                    <a
                      href={`https://www.google.com/search?q=give+me+suggestion+on+what+to+eat.+i+have+${(1500 - foodLog!.totalCalories).toFixed(0)}+kcal+left+to+eat+and+i+have+eaten+${(foodLog?.totalProtein).toFixed(0)}+g+out+of+${goal?.protein?.toFixed(0)}+g+of+protein+as+of+now+for+today.`}
                      target="_blank"
                    >
                      <BsQuestion className="mr-2" /> Suggestion
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
        </section>

        {/* Macros Section */}
        <section className="w-full">
          {isGoalLoading ? (
            <div className="h-48 w-full animate-pulse bg-muted rounded-[2.5rem]" />
          ) : (
            <KadUtama
              date={formatDate(today)}
              p={foodLog?.totalProtein || 0}
              pgoal={goal?.protein || 0}
              c={foodLog?.totalCarbs || 0}
              cgoal={goal?.carbs}
              f={foodLog?.totalFats || 0}
              fgoal={goal?.fats}
            />
          )}
        </section>

        {dateLoading && (
          <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
            <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Spacer for bottom nav */}
        <div className="h-20" />
      </main>
    </div>
  );
}
