"use client";

import { Input } from "@/components/ui/input";
import { saveFoodLog } from "../actions";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useRouter, useSearchParams } from "next/navigation"; // 1. Import useSearchParams
import { useState, useEffect } from "react";

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

let str =
  "give the nutrional facts per 100g in JSON format (use the field names: calories, carbs, protein, fats. and the value in number not string) for ";
str = str.replaceAll(" ", "+");
let str2 =
  "give the nutrional facts for a typical portion in JSON format (use the field names: calories, carbs, protein, fats. and the value in number not string) for ";
str2 = str2.replaceAll(" ", "+");

export default function LogPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // 2. Initialize hook
  const dateParam = searchParams.get("date");
  const defaultDate = dateParam || new Date().toLocaleDateString("en-CA");
  const [formData, setFormData] = useState<FormData>({
    foodName: "",
    servingSize: 0,
    calories: 0,
    carbs: 0,
    protein: 0,
    fats: 0,
    date: defaultDate, // 3. Use it here
    meal: "",
  });
  const [per100g, setPer100g] = useState({
    calories: 0,
    carbs: 0,
    protein: 0,
    fats: 0,
  });

  function updateFields() {
    setFormData((prev) => ({
      ...prev,
      calories: per100g.calories,
      carbs: per100g.carbs,
      protein: per100g.protein,
      fats: per100g.fats,
    }));
  }

  const handleHundredg = (n: number) => {
    setFormData((prev) => ({
      ...prev,
      servingSize: n,
      calories: (per100g.calories / 100) * formData.servingSize,
      carbs: (per100g.carbs / 100) * formData.servingSize,
      protein: (per100g.protein / 100) * formData.servingSize,
      fats: (per100g.fats / 100) * formData.servingSize,
    }));
    updateFields();
  };

  const handlePaste = (pastedText: string) => {
    // Regex explains:
    // "key": -> matches the label
    // \s*[:\s]\s* -> matches colon with any surrounding spaces
    // ([\d.]+) -> captures the number (including decimals)
    const findValue = (key: string) => {
      const regex = new RegExp(`"${key}"\\s*:\\s*([\\d.]+)`, "i");
      const match = pastedText.match(regex);
      return match ? parseFloat(match[1]) : 0;
    };

    setPer100g((prev) => ({
      ...prev,
      calories: findValue("calories"),
      carbs: findValue("carbs"),
      protein: findValue("protein"),
      fats: findValue("fats"),
    }));
  };

  const handleServingSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const servingSize = Number(event.target.value);
    setFormData((prev) => ({
      ...prev,
      servingSize: servingSize,
      calories: (servingSize * per100g.calories) / 100,
      carbs: (servingSize * per100g.carbs) / 100,
      protein: (servingSize * per100g.protein) / 100,
      fats: (servingSize * per100g.fats) / 100,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
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
    // error if no meal
    if (!formData.meal) {
      alert("Please select a meal");
      return;
    }
    e.preventDefault();
    try {
      setFormData({
        ...formData,
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
    <div className="flex flex-col items-center justify-center bg-background px-8">
      <h1 className="text-4xl font-bold  text-gray-800 dark:text-white">
        Log Food
      </h1>
      <h1 className="mb-8">{formData.date}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="meal" className="text-lg font-medium mb-2">
            Meal
          </label>
          {/* <MealCombobox onValueChange={handleChange} /> */}
          <NativeSelect
            name="meal"
            value={formData.meal}
            onChange={handleChange}
          >
            <NativeSelectOption value="">Select meal</NativeSelectOption>
            <NativeSelectOption value="Breakfast">Breakfast</NativeSelectOption>
            <NativeSelectOption value="Lunch">Lunch</NativeSelectOption>
            <NativeSelectOption value="Dinner">Dinner</NativeSelectOption>
            <NativeSelectOption value="Etc">Etc</NativeSelectOption>
          </NativeSelect>
        </div>
        <div className="flex flex-col">
          <label htmlFor="foodName" className="text-lg font-medium mb-2">
            Food Name
          </label>
          <div className="flex gap-4">
            <Input
              id="foodName"
              name="foodName"
              value={formData.foodName}
              onChange={handleChange}
              autoComplete="off"
              className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2 w-64"
            />
            <Button variant="default" className="w-24 font-bold" asChild>
              <a
                href={`https://www.google.com/search?q=${str}+${formData.foodName.replaceAll(
                  " ",
                  "+",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaMagnifyingGlass /> 100
              </a>
            </Button>
            <Button variant="default" className="w-24 font-bold" asChild>
              <a
                href={`https://www.google.com/search?q=${str2}+${formData.foodName.replaceAll(
                  " ",
                  "+",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaMagnifyingGlass /> Typical
              </a>
            </Button>
          </div>
        </div>
        <div>
          <Textarea
            placeholder="Paste JSON from Google here..."
            onChange={(e) => handlePaste(e.target.value)}
            className="your-styling-here"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="servingSize" className="text-lg font-medium mb-2">
            Food mass (g)
          </label>
          <div className="flex gap-2">
            <Input
              autoComplete="off"
              id="servingSize"
              name="servingSize"
              type="number"
              value={formData.servingSize}
              onChange={handleServingSizeChange}
              className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2 w-1/4 autocomplete-off"
            />
            <Button
              variant="outline"
              onClick={() => handleHundredg(50)}
              type="button"
            >
              50g
            </Button>
            <Button
              variant="outline"
              onClick={() => handleHundredg(100)}
              type="button"
            >
              100g
            </Button>
            <Button
              variant="outline"
              onClick={() => handleHundredg(150)}
              type="button"
            >
              150g
            </Button>
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="calories" className="text-lg font-medium mb-2">
            Calories
          </label>
          <Input
            autoComplete="off"
            type="number"
            id="calories"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2 w-36"
          />
        </div>
        <div className="flex w-lg items-center justify-between gap-12">
          <div className="w-1/3">
            <label
              htmlFor="carbs"
              className="text-lg font-medium mb-2 text-success"
            >
              Carbs (g)
            </label>
            <Input
              autoComplete="off"
              type="number"
              id="carbs"
              name="carbs"
              value={formData.carbs}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
            />
          </div>
          <div className="w-1/3">
            <label
              htmlFor="protein"
              className="text-lg font-medium mb-2 text-destructive"
            >
              Protein (g)
            </label>
            <Input
              autoComplete="off"
              type="number"
              id="protein"
              name="protein"
              value={formData.protein}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
            />
          </div>
          <div className="w-1/3">
            <label
              htmlFor="fats"
              className="text-lg font-medium mb-2 text-warning"
            >
              Fats (g)
            </label>
            <Input
              autoComplete="off"
              type="number"
              id="fats"
              name="fats"
              value={formData.fats}
              onChange={() => handleChange}
              className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
            />
          </div>
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
