"use client";
import React, { useEffect, useState } from "react";
import {
  Beef,
  Bell,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Equal,
  Pizza,
} from "lucide-react";
import MacroGoals from "./components/MacroGoals";
import Footer from "./components/Footer";
import MealHeader from "./components/MealHeader";
import MealContent from "./components/MealContent";
import CalorieGoal from "./components/CalorieGoal";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fats, setFats] = useState(0);
  const [goals, setGoals] = useState({
    carbs: 30,
    protein: 40,
    fats: 30,
    calories: 1600,
  });
  const [logs, setLogs] = useState([]);

  // setLogs({
  //   date: "21",

  // })

  useEffect(() => {
    setCarbs(82);
    setProtein(40);
    setFats(80);
  }, []);

  const food = [
    {
      id: 1,
      name: "Nasi Goreng Babi",
      calories: 140,
      carbs: 20,
      protein: 10,
      fats: 10,
      servings: 1,
      portion: "plate",
    },
    {
      id: 2,
      name: "Nasi Goreng Ayam Pedas",
      calories: 140,
      carbs: 20,
      protein: 10,
      fats: 10,
      servings: 1,
      portion: "plate",
    },
  ];

  return (
    <div className="bg-white h-screen w-screen overflow-auto text-black/75 text-sm font-semibold py-12 px-8">
      <div className="bg-white/30  z-10 absolute top-0 backdrop-blur-md left-0  w-full h-[80px] p-4  flex justify-between items-center mb-8">
        <Equal
          strokeWidth={1.75}
          size={20}
          onClick={() => router.push("/settings")}
        />
        <div className="flex justify-center items-center gap-2">
          <ChevronLeft strokeWidth={1.75} size={20} />
          <p className="text-xs">Today</p>
          <ChevronRight strokeWidth={1.75} size={20} />
        </div>
        <Bell strokeWidth={1.75} size={20} />
      </div>

      <CalorieGoal goal={goals.calories} calsConsumed={carbs} />

      <MacroGoals carbs={carbs} protein={protein} fats={fats} />

      <div>
        <MealHeader mealtime={"Breakfast"} calories={140} />
        <MealContent food={food} />
      </div>
      <div>
        <MealHeader mealtime={"Lunch"} calories={140} />
        <MealContent food={food} />
      </div>
      <div>
        <MealHeader mealtime={"Dinner"} calories={140} />
        <MealContent food={food} />
      </div>

      <Footer />
    </div>
  );
}
