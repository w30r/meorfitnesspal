"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getFoodLogs } from "../actions";
import { Skeleton } from "@/components/ui/skeleton";

interface FoodLog {
  foodName: string;
  servingSize: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  date: string;
  meal: string;
}

export default function FoodLogsPage() {
  const [foodLogs, setFoodLogs] = useState<FoodLog[]>([]);
  console.log("🚀 ~ FoodLogsPage ~ foodLogs:", foodLogs)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFoodLogs = async () => {
      try {
        const logs = await getFoodLogs();
        setFoodLogs(logs);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch food logs", error);
      }
    };

    fetchFoodLogs();
  }, []);

  const groupedLogs = {
    breakfast: foodLogs.filter((log) => log.meal === "Breakfast"),
    lunch: foodLogs.filter((log) => log.meal === "Lunch"),
    dinner: foodLogs.filter((log) => log.meal === "Dinner"),
  };

  return (
    <div className="flex flex-col items-center justify-center max-h-screen overflow-scroll w-full bg-background py-12 ">
      <div className="bg-background">
        <h1 className="text-4xl font-bold mb-8 text-primary dark:text-white ">
          Food Logs
        </h1>
      </div>

      <div className="grid grid-cols-3 gap-4 bg-background">
        <div className="bg-background">
          <h2 className="text-2xl font-bold mb-4 text-primary dark:text-white">
            Breakfast
          </h2>
          {isLoading ? (
            <Skeleton className="w-full h-40" />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {groupedLogs.breakfast.map((log, index) => (
                <Card
                  key={index}
                  className="bg-secondary shadow-md rounded-lg p-4"
                >
                  <h2 className="text-xl font-semibold">{log.foodName}</h2>
                  <div>
                    <p className="text-white">
                      Serving Size: {log.servingSize}
                    </p>
                    <p className="text-white">Calories: {log.calories}</p>
                    <p className="text-white">Carbs: {log.carbs}</p>
                    <p className="text-white">Protein: {log.protein}</p>
                    <p className="text-white">Fats: {log.fats}</p>
                    <p className="text-white">Date: {log.date}</p>
                    <p className="text-white">Meal: {log.meal}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="bg-background">
          <h2 className="text-2xl font-bold mb-4 text-primary dark:text-white">
            Lunch
          </h2>
          {isLoading ? (
            <Skeleton className="w-full h-40" />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {groupedLogs.lunch.map((log, index) => (
                <Card
                  key={index}
                  className="bg-secondary shadow-md rounded-lg p-4"
                >
                  <h2 className="text-xl font-semibold">{log.foodName}</h2>
                  <div>
                    <p className="text-white">
                      Serving Size: {log.servingSize}
                    </p>
                    <p className="text-white">Calories: {log.calories}</p>
                    <p className="text-white">Carbs: {log.carbs}</p>
                    <p className="text-white">Protein: {log.protein}</p>
                    <p className="text-white">Fats: {log.fats}</p>
                    <p className="text-white">Date: {log.date}</p>
                    <p className="text-white">Meal: {log.meal}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="bg-background">
          <h2 className="text-2xl font-bold mb-4 text-primary dark:text-white">
            Dinner
          </h2>
          {isLoading ? (
            <Skeleton className="w-full h-40" />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {groupedLogs.dinner.map((log, index) => (
                <Card
                  key={index}
                  className="bg-secondary shadow-md rounded-lg p-4"
                >
                  <h2 className="text-xl font-semibold">{log.foodName}</h2>
                  <div>
                    <p className="text-white">
                      Serving Size: {log.servingSize}
                    </p>
                    <p className="text-white">Calories: {log.calories}</p>
                    <p className="text-white">Carbs: {log.carbs}</p>
                    <p className="text-white">Protein: {log.protein}</p>
                    <p className="text-white">Fats: {log.fats}</p>
                    <p className="text-white">Date: {log.date}</p>
                    <p className="text-white">Meal: {log.meal}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
