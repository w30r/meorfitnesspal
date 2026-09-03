"use client";
import { deleteMealById, getFoodLogbyDate } from "@/app/actions";
import Link from "next/link";
import { ChevronDown, ChevronLeft, Plus, Utensils } from "lucide-react"; // Optional: if you have lucide-react
import DateNavigation from "./DateNavigation";
import FoodCard from "./FoodCard";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface FoodLog {
  _id: string;
  foodName: string;
  servingSize: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  date: string;
  meal: string;
  isFavorite?: boolean;
}

function formatShortDate(dateStr: string) {
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

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getDayName(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return dayNames[date.getDay()];
}

// Sub-component for individual food items to keep the main return clean

export default function FoodLogs() {
  const { date } = useParams();
  const router = useRouter();
  const dateInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<FoodLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMeals, setExpandedMeals] = useState<string[]>([]);

  const toggleMeal = (meal: string) => {
    setExpandedMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (newDate) {
      router.push(`/foodlogs/${newDate}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getFoodLogbyDate(date as string);
      setData(response?.logs || []);
      setLoading(false);
      console.log("🚀 ~ fetchData ~ response:", response);
    };
    fetchData();
  }, [date]);

  const meals = ["Breakfast", "Lunch", "Dinner", "Etc"];

  const handleDeleteLog = (id: string) => {
    setData((prev) => prev.filter((log) => log._id !== id));
  };

  const handleToggleFavorite = (id: string) => {
    setData((prev) =>
      prev.map((log) =>
        log._id === id ? { ...log, isFavorite: !log.isFavorite } : log
      )
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Header Section */}
      <header className="sticky top-0 z-10 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center max-w-2xl mx-auto px-4 justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
          <button
            onClick={() => dateInputRef.current?.showPicker()}
            className="flex flex-col items-center cursor-pointer"
          >
            <h1 className="text-xl font-semibold tracking-tight">
              {formatShortDate(date as string)}
            </h1>
            <span className="text-xs text-muted-foreground">
              {getDayName(date as string)}
            </span>
            <input
              ref={dateInputRef}
              type="date"
              value={date as string}
              onChange={handleDateChange}
              className="sr-only"
            />
          </button>
          <div className="flex items-center gap-2">
            <Link
              href={`/logfood/${date}`}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow transition-transform hover:scale-105 active:scale-95"
            >
              <Plus className="h-5 w-5" />
            </Link>
            <DateNavigation date={date as string} />
          </div>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 mt-8 flex flex-col gap-10">
        {loading ? (
          <>
            {meals.map((mealType) => (
              <section key={mealType} className="flex flex-col gap-4">
                <div className="flex items-center gap-2 border-b border-border pb-2 justify-between">
                  <div className="flex gap-2 items-center justify-center">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
                <div className="grid gap-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-32 w-full rounded-xl" />
                  ))}
                </div>
              </section>
            ))}
          </>
        ) : (
          meals.map((mealType) => {
            const filteredLogs = data.filter((x: FoodLog) => x.meal?.toLowerCase() === mealType.toLowerCase());
            const totalCalories = filteredLogs.reduce((sum, log) => sum + (log.calories || 0), 0);

            const isExpanded = expandedMeals.includes(mealType);

            return (
              <section key={mealType} className="flex flex-col gap-4">
                <button
                  onClick={() => toggleMeal(mealType)}
                  className="flex items-center gap-2 border-b border-border pb-2 justify-between w-full text-left"
                >
                  <div className="flex gap-2 items-center justify-center">
                    <Utensils className="h-5 w-5 text-primary" />
                    <h2 className="text-2xl font-bold tracking-tight">
                      {mealType}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">
                      {totalCalories.toFixed(0)} kcal
                    </span>
                    <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                      {filteredLogs.length} items
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform ${isExpanded ? "" : "-rotate-90"}`}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="grid gap-4">
                    {filteredLogs.length > 0 ? (
                      filteredLogs.map((log: FoodLog) => (
                        <FoodCard
                          key={log._id}
                          log={log}
                          onDelete={handleDeleteLog}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 rounded-xl border  border-border bg-muted/30">
                        <p className="text-sm text-muted-foreground">
                          No {mealType} logged yet.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            );
          })
        )}
      </main>


    </div>
  );
}
