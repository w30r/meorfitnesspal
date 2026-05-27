"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Weight,
  Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import KadUtama from "@/components/kadutama";
import { cn } from "@/lib/utils";
import { BsQuestion } from "react-icons/bs";
import { useDashboard } from "@/hooks/useDashboard";
import {
  CalorieCardSkeleton,
  MacroCardSkeleton,
  MiniCardSkeleton,
} from "@/components/dashboard-skeletons";

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
  const dateInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useDashboard(formatDate(today));

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      const [year, month, day] = newDate.split("-").map(Number);
      setToday(new Date(year, month - 1, day));
    }
  };

  const isToday = formatDate(today) === formatDate(new Date());

  const handlePrevDay = () => {
    const prevDate = new Date(today);
    prevDate.setDate(prevDate.getDate() - 1);
    setToday(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(today);
    nextDate.setDate(nextDate.getDate() + 1);
    setToday(nextDate);
  };

  const handleGoToToday = () => {
    setToday(new Date());
  };

  const foodLog = data?.foodLog ?? null;
  const goal = data?.goal ?? null;
  const weeklyWeightAvg = data?.weeklyWeightAvg ?? null;
  const prevWeekWeightAvg = data?.prevWeekWeightAvg ?? null;
  const streak = data?.streak ?? 0;

  const caloriePercentage = goal
    ? Math.round(((foodLog?.totalCalories || 0) / goal.calories) * 100)
    : 0;

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

          <div
            onClick={() => dateInputRef.current?.showPicker()}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <h1 className="text-sm font-bold uppercase tracking-wider">
                {isToday ? "Today" : formatShortDate(formatDate(today))}
              </h1>
              {!isToday && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGoToToday();
                  }}
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
            <input
              ref={dateInputRef}
              type="date"
              value={formatDate(today)}
              onChange={handleDateChange}
              className="sr-only"
            />
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
        {isLoading ? (
          <>
            <MiniCardSkeleton />
            <MiniCardSkeleton />
            <CalorieCardSkeleton />
            <MacroCardSkeleton />
          </>
        ) : (
          <>
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
                          {Math.abs(
                            weeklyWeightAvg - prevWeekWeightAvg,
                          ).toFixed(1)}
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
                <p className="text-sm text-muted-foreground mt-0">
                  kcal consumed
                </p>

                <div className="w-full mt-4 space-y-2">
                  <div className="flex justify-between text-xs font-bold px-1">
                    <span className="text-primary">
                      {caloriePercentage}% of daily goal
                    </span>
                    <span className="text-muted-foreground">
                      {Math.max(
                        0,
                        (goal?.calories || 0) -
                          (foodLog?.totalCalories || 0),
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
                      style={{
                        width: `${Math.min(caloriePercentage, 100)}%`,
                      }}
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
              <KadUtama
                date={formatDate(today)}
                p={foodLog?.totalProtein || 0}
                pgoal={goal?.protein || 0}
                c={foodLog?.totalCarbs || 0}
                cgoal={goal?.carbs}
                f={foodLog?.totalFats || 0}
                fgoal={goal?.fats}
              />
            </section>
          </>
        )}

        {/* Spacer for bottom nav */}
        <div className="h-20" />
      </main>
    </div>
  );
}
