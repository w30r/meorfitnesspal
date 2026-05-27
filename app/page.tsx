"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Weight,
  Apple,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import KadUtama from "@/components/kadutama";
import MacroDonutChart from "@/components/charts/MacroDonutChart";
import AchievementBadges from "@/components/AchievementBadges";
import StreakCard from "@/components/StreakCard";
import CalorieTrendChart from "@/components/charts/CalorieTrendChart";
import { cn } from "@/lib/utils";
import { BsQuestion } from "react-icons/bs";
import { useDashboard } from "@/hooks/useDashboard";
import { useCalorieTrend } from "@/hooks/useCalorieTrend";
import {
  CalorieCardSkeleton,
  MacroCardSkeleton,
  MiniCardSkeleton,
  DonutCardSkeleton,
  AchievementsSkeleton,
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

  const { data: trendData, isLoading: trendLoading } = useCalorieTrend();

  const foodLog = data?.foodLog ?? null;
  const goal = data?.goal ?? null;
  const weeklyWeightAvg = data?.weeklyWeightAvg ?? null;
  const prevWeekWeightAvg = data?.prevWeekWeightAvg ?? null;
  const streak = data?.streak ?? null;
  const achievements = data?.achievements ?? [];
  const newlyUnlocked = data?.newlyUnlockedAchievements ?? [];

  const caloriePercentage = goal
    ? Math.round(((foodLog?.totalCalories || 0) / goal.calories) * 100)
    : 0;

  const hasMacros = foodLog && (foodLog.totalProtein > 0 || foodLog.totalCarbs > 0 || foodLog.totalFats > 0);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Date Navigation Header */}
      <header className="sticky top-0 z-20 w-full bg-background/80 backdrop-blur-sm border-b border-border supports-backdrop-filter:bg-background/30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
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

      <main className="max-w-7xl mx-auto px-4 pt-4 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-min">
            <div className="flex gap-3 md:col-span-2 lg:col-span-3">
              <MiniCardSkeleton className="flex-1" />
              <MiniCardSkeleton className="flex-1" />
            </div>
            <CalorieCardSkeleton />
            <MacroCardSkeleton />
            <DonutCardSkeleton />
            <div className="bg-card border border-border rounded-[2.5rem] p-4 shadow-sm md:col-span-2 lg:col-span-3 animate-pulse">
              <div className="h-3 w-32 bg-muted-foreground/20 rounded mb-3" />
              <div className="h-[220px] bg-muted-foreground/10 rounded-lg" />
            </div>
            <AchievementsSkeleton className="md:col-span-2 lg:col-span-3" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 auto-rows-min">
            {/* Mini stats row */}
            <div className="flex gap-3 md:col-span-2 lg:col-span-3">
              {/* Weekly Weight Average - Mini */}
              {weeklyWeightAvg ? (
                <Link href="/weight" className="flex-1 min-w-0">
                  <div className="bg-card border border-border rounded-[2.5rem] p-4 shadow-sm h-full animate-in fade-in slide-in-from-bottom-1 duration-500">
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
              ) : (
                <Link href="/logweight" className="flex-1 min-w-0">
                  <div className="bg-card border border-dashed border-border/50 rounded-[2.5rem] p-4 shadow-sm h-full flex items-center justify-center gap-2 text-muted-foreground hover:border-border transition-colors">
                    <Weight className="h-4 w-4" />
                    <span className="text-xs font-medium">Log your weight</span>
                  </div>
                </Link>
              )}

              {/* Streak Card */}
              {streak && streak.current > 0 ? (
                <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-bottom-1 duration-500 delay-75 flex">
                  <StreakCard data={streak} />
                </div>
              ) : (
                <Link href={`/logfood/${formatDate(today)}`} className="flex-1 min-w-0">
                  <div className="bg-card border border-dashed border-border/50 rounded-[2.5rem] p-4 shadow-sm h-full flex items-center justify-center gap-2 text-muted-foreground hover:border-border transition-colors">
                    <Apple className="h-4 w-4" />
                    <span className="text-xs font-medium">Log your first meal</span>
                  </div>
                </Link>
              )}
            </div>

            {/* Main Calorie Ring/Progress Card */}
            <section className="relative overflow-hidden bg-card border border-border rounded-[2.5rem] p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
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
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl" />
            </section>

            {/* Macros Section */}
            <section className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
              {foodLog ? (
                <KadUtama
                  date={formatDate(today)}
                  p={foodLog?.totalProtein || 0}
                  pgoal={goal?.protein || 0}
                  c={foodLog?.totalCarbs || 0}
                  cgoal={goal?.carbs}
                  f={foodLog?.totalFats || 0}
                  fgoal={goal?.fats}
                />
              ) : (
                <Link href={`/logfood/${formatDate(today)}`}>
                  <div className="bg-card border border-dashed border-border/50 rounded-[2.5rem] p-6 shadow-sm flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-border transition-colors min-h-[200px]">
                    <Plus className="h-6 w-6" />
                    <span className="text-xs font-medium">Log a meal to see macros</span>
                  </div>
                </Link>
              )}
            </section>

            {/* Macro Distribution Donut */}
            <section className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
              {hasMacros ? (
                <div className="relative overflow-hidden bg-card border border-border rounded-[2.5rem] p-4 shadow-sm h-full">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground text-center mb-2">
                    Macro Distribution
                  </h3>
                  <MacroDonutChart
                    protein={foodLog!.totalProtein}
                    proteinGoal={goal?.protein || 0}
                    carbs={foodLog!.totalCarbs}
                    carbsGoal={goal?.carbs || 0}
                    fats={foodLog!.totalFats}
                    fatsGoal={goal?.fats || 0}
                  />
                </div>
              ) : (
                <div className="bg-card border border-dashed border-border/50 rounded-[2.5rem] p-4 shadow-sm h-full flex flex-col items-center justify-center gap-2 text-muted-foreground min-h-[200px]">
                  <Apple className="h-6 w-6" />
                  <span className="text-xs font-medium text-center">No macros logged yet today</span>
                </div>
              )}
            </section>

            {/* Calorie Trend Chart */}
            <section className="relative overflow-hidden bg-card border border-border rounded-[2.5rem] p-4 shadow-sm md:col-span-2 lg:col-span-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-125">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                14-Day Calorie Trend
              </h3>
              {trendLoading ? (
                <div className="h-[220px] flex items-center justify-center">
                  <div className="h-32 w-full bg-muted/30 rounded-lg animate-pulse" />
                </div>
              ) : trendData && trendData.days.some((d) => d.calories > 0) ? (
                <CalorieTrendChart days={trendData.days} goalCalories={trendData.goalCalories} />
              ) : (
                <div className="h-[220px] flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <span className="text-lg">📊</span>
                  <span className="text-xs font-medium">No data yet — log meals to see your calorie trend</span>
                </div>
              )}
            </section>

            {/* Achievements */}
            <section className="md:col-span-2 lg:col-span-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-250">
              {achievements.length > 0 ? (
                <div className="relative overflow-hidden bg-card border border-border rounded-[2.5rem] p-4 shadow-sm">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                    Achievements
                  </h3>
                  <AchievementBadges
                    achievements={achievements}
                    newlyUnlocked={newlyUnlocked}
                  />
                </div>
              ) : (
                <div className="bg-card border border-dashed border-border/50 rounded-[2.5rem] p-4 shadow-sm flex flex-col items-center justify-center gap-2 text-muted-foreground py-6">
                  <span className="text-2xl">🏆</span>
                  <span className="text-xs font-medium">Log meals and build streaks to earn achievements!</span>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
