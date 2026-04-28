"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Target,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFoodLogbyDate, getGoalData } from "./actions";
import KadUtama from "@/components/kadutama";
import QuickAdd from "@/components/QuickAdd";

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

  const isToday = formatDate(today) === formatDate(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFoodLogbyDate(formatDate(today));
        setFoodLog(data);
      } catch {
        console.error("Failed to get food log");
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

  const caloriePercentage = goal
    ? Math.round(((foodLog?.totalCalories || 0) / goal.calories) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background text-foreground pb-10">
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

      <main className="max-w-2xl mx-auto px-4 pt-8 space-y-6">
        {/* Main Calorie Ring/Progress Card */}
        <section className="relative overflow-hidden bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
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
            <p className="text-sm text-muted-foreground mt-1">kcal consumed</p>

            <div className="w-full mt-8 space-y-2">
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
                  className="h-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(caloriePercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>
          {/* Subtle background decoration */}
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

        {/* Action Grid */}
        <nav className="grid grid-cols-4 gap-4 pt-2">
          <Link href={`/logfood/${formatDate(today)}`} className="group">
            <div className="flex flex-col items-center justify-center gap-3 h-28 rounded-[2rem] bg-primary text-primary-foreground transition-transform active:scale-95 shadow-lg shadow-primary/20">
              <PlusCircle className="h-7 w-7" />
              <span className="text-xs font-bold uppercase tracking-tight">
                Add Food
              </span>
            </div>
          </Link>

          <Dialog>
            <DialogTrigger>
              <div className="flex flex-col items-center justify-center gap-3 h-28 rounded-[2rem] bg-chart-5 border border-border transition-all hover:border-primary/50 active:scale-95">
                <PlusCircle className="h-7 w-7 text-primary-foreground group-hover:text-primary transition-colors" />

                <span className="text-xs font-bold uppercase tracking-tight text-primary-foreground">
                  Quick Add
                </span>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Quick Add</DialogTitle>
                <DialogDescription>
                  Put as many details as possible!
                </DialogDescription>
              </DialogHeader>
              <div>
                <QuickAdd />
              </div>
            </DialogContent>
          </Dialog>

          <Link href="/goals" className="group">
            <div className="flex flex-col items-center justify-center gap-3 h-28 rounded-[2rem] bg-card border border-border transition-all hover:border-primary/50 active:scale-95">
              <Target className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-xs font-bold uppercase tracking-tight text-muted-foreground">
                Goals
              </span>
            </div>
          </Link>

          <Link href="/charts" className="group">
            <div className="flex flex-col items-center justify-center gap-3 h-28 rounded-[2rem] bg-card border border-border transition-all hover:border-primary/50 active:scale-95">
              <BarChart3 className="h-7 w-7 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-xs font-bold uppercase tracking-tight text-muted-foreground">
                Stats
              </span>
            </div>
          </Link>
        </nav>

        {/* Quick View Link */}
        <Link href={`/foodlogs/${formatDate(today)}`} className="block">
          <Button
            variant="ghost"
            className="w-full py-6 text-muted-foreground hover:text-primary rounded-2xl border border-dashed border-border hover:border-primary/50"
          >
            View Detailed Food Logs
          </Button>
        </Link>
      </main>
    </div>
  );
}
