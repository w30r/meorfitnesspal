"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MealCombobox } from "@/components/mealcombobox";
import { saveFoodLog } from "../actions";
import { useRouter } from "next/navigation";

interface FormData {
  foodName: string;
  servingSize: number;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  date: string;
  meal: string;
}

export default function LogPage() {
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    foodName: "",
    servingSize: 0,
    calories: 0,
    carbs: 0,
    protein: 0,
    fats: 0,
    date: formattedDate,
    meal: "",
  });

  const handleChange = (e: {
    target: { name: keyof FormData; value: any };
  }) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "servingSize" ||
        e.target.name === "calories" ||
        e.target.name === "carbs" ||
        e.target.name === "protein" ||
        e.target.name === "fats"
          ? Number(e.target.value)
          : e.target.value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      setFormData({
        ...formData,
        date: new Date().toISOString(),
        meal: formData.meal || "NONE SELECTED", // Ensure meal is set to a default value if not provided
      });

      await saveFoodLog(formData);
      router.push("/"); // Redirect to the front page
      // Optionally, reset the form after successful submission
      setFormData({
        foodName: "",
        servingSize: 0,
        calories: 0,
        carbs: 0,
        protein: 0,
        fats: 0,
        date: "",
        meal: "",
      });
    } catch (error) {
      console.error("Failed to log food", error);
      alert("Failed to log food. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background py-16 px-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
        Log Food {formData.meal}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="meal" className="text-lg font-medium mb-2">
            Meal
          </label>
          <MealCombobox onValueChange={handleChange} />
        </div>
        <div>
          <label htmlFor="foodName" className="text-lg font-medium mb-2">
            Food Name
          </label>
          <Input
            id="foodName"
            name="foodName"
            value={formData.foodName}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
          />
        </div>
        <div>
          <label htmlFor="servingSize" className="text-lg font-medium mb-2">
            Serving Size
          </label>
          <Input
            id="servingSize"
            name="servingSize"
            value={formData.servingSize}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
          />
        </div>
        <div>
          <label htmlFor="calories" className="text-lg font-medium mb-2">
            Calories
          </label>
          <Input
            type="number"
            id="calories"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
          />
        </div>
        <div>
          <label htmlFor="carbs" className="text-lg font-medium mb-2">
            Carbs (g)
          </label>
          <Input
            type="number"
            id="carbs"
            name="carbs"
            value={formData.carbs}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
          />
        </div>
        <div>
          <label htmlFor="protein" className="text-lg font-medium mb-2">
            Protein (g)
          </label>
          <Input
            type="number"
            id="protein"
            name="protein"
            value={formData.protein}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
          />
        </div>
        <div>
          <label htmlFor="fats" className="text-lg font-medium mb-2">
            Fats (g)
          </label>
          <Input
            type="number"
            id="fats"
            name="fats"
            value={formData.fats}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600
dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Log Food
        </button>
      </form>
    </div>
  );
}
