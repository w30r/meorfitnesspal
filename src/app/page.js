"use client";
import React, { useEffect, useState } from "react";
import {
  Beef,
  Bell,
  ChartColumnDecreasing,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  CircleUser,
  EggFried,
  Equal,
  House,
  NotebookPen,
  Pizza,
  Plus,
  SquarePlus,
} from "lucide-react";
import MacroGoals from "./components/MacroGoals";
import Footer from "./components/Footer";
import MealHeader from "./components/MealHeader";
import MealContent from "./components/MealContent";

export default function Home() {
  const [carbs, setCarbs] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fats, setFats] = useState(0);

  useEffect(() => {
    setCarbs(82);
    setProtein(40);
    setFats(80);
  }, []);

  const food = [
    {
      name: "Nasi Goreng Babi",
      calories: 140,
      carbs: 20,
      protein: 10,
      fats: 10,
      servings: 1,
      portion: "plate",
    },
    {
      name: "Nasi Goreng Ayam",
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
        <Equal strokeWidth={1.75} size={20} />
        <div className="flex justify-center items-center gap-2">
          <ChevronLeft strokeWidth={1.75} size={20} />
          <p className="text-xs">Today</p>
          <ChevronRight strokeWidth={1.75} size={20} />
        </div>
        <Bell strokeWidth={1.75} size={20} />
      </div>

      <MacroGoals carbs={carbs} protein={protein} fats={fats} />

      <div>
        <MealHeader mealtime={"Breakfast"} calories={140} />
        <MealContent food={food} />
      </div>
      <div>
        <div className="bg-[#1671e8] px-4 flex justify-between items-center gap-2 py-3 rounded-t-xl text-white outline-1 outline outline-black/10 shadow-md ">
          <div className="flex items-center gap-2">
            <Beef strokeWidth={1.75} size={18} />
            <div>
              <h1 className="font-bold text-xs">Lunch</h1>
              <h1 className="font-light text-xs">520kcal</h1>
            </div>
          </div>
          <CirclePlus
            strokeWidth={1.75}
            className="hover:scale-[1.03] duration-150 "
          />
        </div>
        <div
          id="MEAL-CONTENT"
          className="bg-white px-4 py-2 rounded-b-xl outline-1 outline outline-black/10 shadow-md mb-4"
        >
          <div id="ITEM">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-[#1671e8] px-4 flex justify-between items-center gap-2 py-3 rounded-t-xl text-white outline-1 outline outline-black/10 shadow-md ">
          <div className="flex items-center gap-2">
            <Pizza strokeWidth={1.75} size={18} />
            <div>
              <h1 className="font-bold text-xs">Dinner</h1>
              <h1 className="font-light text-xs">520kcal</h1>
            </div>
          </div>
          <CirclePlus
            strokeWidth={1.75}
            className="hover:scale-[1.03] duration-150 "
          />
        </div>
        <div
          id="MEAL-CONTENT"
          className="bg-white px-4 py-2 rounded-b-xl outline-1 outline outline-black/10 shadow-md mb-4"
        >
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
          <div id="ITEM" className="mb-2">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold text-xs">Nasi Goreng Babi</h1>
              <h1 className="font-light text-xs">140 cals</h1>
            </div>
            <h1 className="font-light text-xs">1 plate</h1>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
