"use client";

import { Input } from "@/components/ui/input";
import { saveFoodLog } from "../../actions";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FaMagnifyingGlass, FaPlus } from "react-icons/fa6";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
// Assuming you have these standard UI components or similar
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

let str =
  "give the nutrional facts per 100g in JSON format (use the field names: calories, carbs, protein, fats. and the value in number not string) for ";
str = str.replaceAll(" ", "+");
let str2 =
  "give the nutrional facts for a typical portion in JSON format (use the field names: calories, carbs, protein, fats. and the value in number not string) for ";
str2 = str2.replaceAll(" ", "+");

export default function LogPage() {
  const router = useRouter();
  const params = useParams();
  const dateParam = Array.isArray(params.date) ? params.date[0] : params.date;
  const defaultDate = dateParam || new Date().toLocaleDateString("en-CA");

  const [formData, setFormData] = useState<FormData>({
    foodName: "",
    servingSize: 0,
    calories: 0,
    carbs: 0,
    protein: 0,
    fats: 0,
    date: defaultDate,
    meal: "",
  });

  const [per100g, setPer100g] = useState({
    calories: 0,
    carbs: 0,
    protein: 0,
    fats: 0,
  });

  const handlePaste = (pastedText: string) => {
    const findValue = (key: string) => {
      const regex = new RegExp(`"${key}"\\s*:\\s*([\\d.]+)`, "i");
      const match = pastedText.match(regex);
      return match ? parseFloat(match[1]) : 0;
    };

    const newData = {
      calories: findValue("calories"),
      carbs: findValue("carbs"),
      protein: findValue("protein"),
      fats: findValue("fats"),
    };

    setPer100g(newData);
    // Auto-calculate if serving size already exists
    if (formData.servingSize > 0) {
      setFormData((prev) => ({
        ...prev,
        calories: (newData.calories * prev.servingSize) / 100,
        carbs: (newData.carbs * prev.servingSize) / 100,
        protein: (newData.protein * prev.servingSize) / 100,
        fats: (newData.fats * prev.servingSize) / 100,
      }));
    }
  };

  const handleHundredg = (n: number) => {
    setFormData((prev) => ({
      ...prev,
      servingSize: n,
      calories: (per100g.calories / 100) * n,
      carbs: (per100g.carbs / 100) * n,
      protein: (per100g.protein / 100) * n,
      fats: (per100g.fats / 100) * n,
    }));
  };

  const handleServingSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const servingSize = Number(e.target.value);
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["servingSize", "calories", "carbs", "protein", "fats"].includes(
        name,
      )
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.meal) {
      alert("Please select a meal");
      return;
    }
    try {
      await saveFoodLog(formData);
      router.push("/");
    } catch (error) {
      console.error("Failed to log food", error);
      alert("Failed to log food.");
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background py-12 px-4">
      <Card className="max-w-xl mx-auto shadow-lg">
        <CardHeader className="text-center border-b mb-6">
          <CardTitle className="text-3xl font-bold">Log Food</CardTitle>
          <p className="text-muted-foreground font-medium">
            {formatDate(formData.date)}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Meal Selection */}
            <div className="space-y-2">
              <Label htmlFor="meal">Which meal is this?</Label>
              <NativeSelect
                name="meal"
                value={formData.meal}
                onChange={handleChange}
              >
                <NativeSelectOption value="">Select meal</NativeSelectOption>
                <NativeSelectOption value="Breakfast">
                  Breakfast
                </NativeSelectOption>
                <NativeSelectOption value="Lunch">Lunch</NativeSelectOption>
                <NativeSelectOption value="Dinner">Dinner</NativeSelectOption>
                <NativeSelectOption value="Etc">Etc</NativeSelectOption>
              </NativeSelect>
            </div>

            {/* Food Name & Search */}
            <div className="space-y-2">
              <Label htmlFor="foodName">Food Name</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="foodName"
                  name="foodName"
                  placeholder="e.g. Chicken Breast"
                  value={formData.foodName}
                  onChange={handleChange}
                  autoComplete="off"
                  className="flex-1"
                />
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    asChild
                    className="flex-1"
                  >
                    <a
                      href={`https://www.google.com/search?q=${str}+${formData.foodName}`}
                      target="_blank"
                    >
                      <FaMagnifyingGlass className="mr-2" /> 100g
                    </a>
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    asChild
                    className="flex-1"
                  >
                    <a
                      href={`https://www.google.com/search?q=${str2}+${formData.foodName}`}
                      target="_blank"
                    >
                      <FaMagnifyingGlass className="mr-2" /> Typical
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* JSON Input Area */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Data Import
              </Label>
              <Textarea
                placeholder="Paste JSON result here to auto-fill..."
                onChange={(e) => handlePaste(e.target.value)}
                className="bg-background dark:bg-background font-mono text-xs"
              />
            </div>

            <hr className="opacity-50" />

            {/* Mass / Serving Size */}
            <div className="space-y-3">
              <Label htmlFor="servingSize">Portion Size (grams)</Label>
              <div className="flex flex-wrap gap-2">
                <Input
                  id="servingSize"
                  name="servingSize"
                  type="number"
                  value={formData.servingSize || ""}
                  onChange={handleServingSizeChange}
                  className="w-24 font-bold text-lg"
                />
                {[50, 100, 150, 200].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => handleHundredg(amount)}
                  >
                    {amount}g
                  </Button>
                ))}
              </div>
            </div>

            {/* Nutrition Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  type="number"
                  id="calories"
                  name="calories"
                  value={formData.calories.toFixed(1) || ""}
                  onChange={handleChange}
                  className="text-xl h-12 border-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="carbs"
                  className="text-emerald-600 dark:text-emerald-400"
                >
                  Carbs (g)
                </Label>
                <Input
                  id="carbs"
                  name="carbs"
                  type="number"
                  value={formData.carbs.toFixed(1) || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="protein"
                  className="text-rose-600 dark:text-rose-400"
                >
                  Protein (g)
                </Label>
                <Input
                  id="protein"
                  name="protein"
                  type="number"
                  value={formData.protein.toFixed(1) || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="fats"
                  className="text-amber-600 dark:text-amber-400"
                >
                  Fats (g)
                </Label>
                <Input
                  id="fats"
                  name="fats"
                  type="number"
                  value={formData.fats.toFixed(1) || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold mt-4"
            >
              <FaPlus className="mr-2" /> Log Food
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
