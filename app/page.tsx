// app/page.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getFoodLogbyDate, getGoalData } from "./actions";
import KadUtama from "@/components/kadutama";
import { Card } from "@/components/ui/card";

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

// Define the shape of the function response
export interface FoodLogResponse {
  logs: FoodEntry[];
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFats: number;
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Home() {
  const [today, setToday] = useState(new Date());
  const [goal, setGoal] = useState<any>(null);
  const [isGoalLoading, setIsGoalLoading] = useState(true);
  const [foodLog, setFoodLog] = useState<FoodLogResponse | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFoodLogbyDate(formatDate(today));
        console.log("🚀 ~ fetchData ~ foodLog:", data);
        setFoodLog(data);
      } catch {
        console.error("Failed to get food log by date");
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
        console.log("🚀 ~ fetchData ~ goal:", data);
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
    const prevDate = new Date(today);
    prevDate.setDate(prevDate.getDate() + 1);
    setToday(prevDate);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-background dark:bg-background py-20 px-8">
      <header className="text-4xl font-bold mb-8 text-foreground">
        MeorFitnessPal
      </header>
      <div className=" mb-4 flex items-center justify-between min-w-screen px-8 h-4">
        {/* Go to previous day */}
        <Button variant="outline" onClick={handlePrevDay}>
          <h1>{"<"}</h1>
        </Button>
        <h1>
          {formatDate(today) === formatDate(new Date())
            ? "Today"
            : formatDate(today)}
        </h1>
        {/* Go to next day */}
        <Button variant="outline" onClick={handleNextDay}>
          <h1>{">"}</h1>
        </Button>
      </div>

      {isGoalLoading ? (
        <p>Loading...</p>
      ) : (
        <KadUtama
          p={foodLog?.totalProtein || 0}
          pgoal={goal?.protein || 0}
          c={foodLog?.totalCarbs || 0}
          cgoal={goal?.carbs}
          f={foodLog?.totalFats || 0}
          fgoal={goal?.fats}
        />
      )}

      <div className="flex-1 overflow-auto w-screen px-4 ">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {foodLog?.logs?.map((item: any) => (
          <Card
            className="flex flex-col items-start justify-center bg-card text-foreground rounded-xl px-4 py-2 font-bold gap-1 m-4"
            key={item._id}
          >
            <h1>{item.foodName}</h1>
            <h1>
              <span className="text-success">{item.protein}P</span>/
              <span className="text-destructive">{item.carbs}C</span>/
              <span className="text-warning">{item.fats}F</span>
            </h1>
            <p>({item.calories} kcal)</p>
          </Card>
        ))}
      </div>

      <div className="flex space-x-4 mt-8">
        <Link href="/logfood">
          <Button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">
            Log Food
          </Button>
        </Link>
        <Link href="/goals">
          <Button variant="outline">Set Goals</Button>
        </Link>
        <Link href="/charts">
          <Button variant="default">Charts</Button>
        </Link>
      </div>
    </div>
  );
}
