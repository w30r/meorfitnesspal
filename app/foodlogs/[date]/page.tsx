"use client";
import { deleteMealById, getFoodLogbyDate } from "@/app/actions";
import Link from "next/link";
import { ChevronLeft, Utensils } from "lucide-react"; // Optional: if you have lucide-react
import DateNavigation from "./DateNavigation";
import FoodCard from "./FoodCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

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

// Sub-component for individual food items to keep the main return clean

export default function FoodLogs() {
  const { date } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<FoodLog[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getFoodLogbyDate(date as string);
      setData(response?.logs || []);
      console.log("🚀 ~ fetchData ~ response:", response);
    };
    fetchData();
  }, [date]);

  const meals = ["Breakfast", "Lunch", "Dinner", "Etc"];

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
          <h1 className="ml-4 text-xl font-semibold tracking-tight">
            {formatShortDate(date as string)}
          </h1>
          <div className="">
            <DateNavigation date={date as string} />
          </div>
          <div>
            <Button>Prev</Button>
            <Button>Next</Button>
          </div>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 mt-8 flex flex-col gap-10">
        {meals.map((mealType) => {
          const filteredLogs = data.filter((x: FoodLog) => x.meal === mealType);

          return (
            <section key={mealType} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-border pb-2 justify-between">
                <div className="flex gap-2 items-center justify-center">
                  <Utensils className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold tracking-tight">
                    {mealType}
                  </h2>
                </div>
                <div>
                  <span className="ml-auto text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                    {filteredLogs.length} items
                  </span>
                </div>
              </div>

              <div className="grid gap-4">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log: FoodLog) => (
                    <FoodCard
                      key={log._id}
                      log={log}
                      // onDelete={handleDeleteLog}
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
            </section>
          );
        })}
      </main>
    </div>
  );
}
