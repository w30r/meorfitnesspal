"use client";

import { Input } from "@/components/ui/input";
import { saveFoodLog } from "../../actions";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, UtensilsCrossed } from "lucide-react";
import FoodCard from "./FoodCard";
import Suggestions from "./Suggestions";

interface Per100g {
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
}

interface FoodEntry {
  id: string;
  foodName: string;
  servingSize: number;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  per100g?: Per100g;
}

interface SuggestionFood {
  _id: string;
  foodName: string;
  servingSize: number;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  per100g?: { calories: number; carbs: number; protein: number; fats: number };
}

interface FormData {
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

const getPer100g = (food: FoodEntry, serving: number): Per100g => {
  if (food.per100g) return food.per100g;
  if (serving > 0) {
    return {
      calories: (food.calories / serving) * 100,
      carbs: (food.carbs / serving) * 100,
      protein: (food.protein / serving) * 100,
      fats: (food.fats / serving) * 100,
    };
  }
  return { calories: 0, carbs: 0, protein: 0, fats: 0 };
};

const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function LogPage() {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const params = useParams();
  const dateParam = Array.isArray(params.date) ? params.date[0] : params.date;
  const defaultDate = dateParam || new Date().toLocaleDateString("en-CA");

  const [formData, setFormData] = useState<FormData>({
    date: defaultDate,
    meal: "",
  });
  const [foods, setFoods] = useState<FoodEntry[]>([
    {
      id: "1",
      foodName: "",
      servingSize: 0,
      calories: 0,
      carbs: 0,
      protein: 0,
      fats: 0,
    },
  ]);
  const [expandedFoods, setExpandedFoods] = useState<string[]>(["1"]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [favorites, setFavorites] = useState<SuggestionFood[]>([]);
  const [recent, setRecent] = useState<SuggestionFood[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);

  useEffect(() => {
    import("../../actions").then(({ getRecentFoods, getFavoriteFoods }) => {
      Promise.all([getRecentFoods(15), getFavoriteFoods()])
        .then(([r, f]) => {
          setRecent(r || []);
          setFavorites(f || []);
          setSuggestionsLoading(false);
        })
        .catch(console.error);
    });
  }, []);

  const parsePaste = (text: string) => {
    const find = (key: string) => {
      const m = text.match(new RegExp(`"${key}"\\s*:\\s*([\\d.]+)`, "i"));
      return m ? parseFloat(m[1]) : 0;
    };
    return {
      calories: find("calories"),
      carbs: find("carbs"),
      protein: find("protein"),
      fats: find("fats"),
    };
  };

  const addFromSuggestion = (food: SuggestionFood) => {
    const id = Date.now().toString();
    const p100 =
      food.per100g ||
      (food.servingSize > 0
        ? {
            calories: (food.calories / food.servingSize) * 100,
            carbs: (food.carbs / food.servingSize) * 100,
            protein: (food.protein / food.servingSize) * 100,
            fats: (food.fats / food.servingSize) * 100,
          }
        : null);
    const serving = food.servingSize || 100;
    setFoods((prev) => [
      ...prev,
      {
        id,
        foodName: capitalizeWords(food.foodName),
        servingSize: serving,
        calories: p100 ? (p100.calories / 100) * serving : food.calories,
        carbs: p100 ? (p100.carbs / 100) * serving : food.carbs,
        protein: p100 ? (p100.protein / 100) * serving : food.protein,
        fats: p100 ? (p100.fats / 100) * serving : food.fats,
        per100g: p100 || undefined,
      },
    ]);
    setExpandedFoods((prev) => [...prev, id]);
  };

  const handlePaste = (text: string, foodId: string) => {
    const macros = parsePaste(text);
    setFoods((prev) =>
      prev.map((f) => {
        if (f.id !== foodId || f.servingSize <= 0) return f;
        return {
          ...f,
          calories: (macros.calories * f.servingSize) / 100,
          carbs: (macros.carbs * f.servingSize) / 100,
          protein: (macros.protein * f.servingSize) / 100,
          fats: (macros.fats * f.servingSize) / 100,
        };
      }),
    );
  };

  const handleServingChange = (foodId: string, grams: number) => {
    setFoods((prev) =>
      prev.map((f) => {
        if (f.id !== foodId) return f;
        
        let p100 = f.per100g;
        if (!p100 && f.servingSize > 0 && f.calories > 0) {
          p100 = {
            calories: (f.calories / f.servingSize) * 100,
            carbs: (f.carbs / f.servingSize) * 100,
            protein: (f.protein / f.servingSize) * 100,
            fats: (f.fats / f.servingSize) * 100,
          };
        }
        
        if (!p100) return { ...f, servingSize: grams };
        
        return {
          ...f,
          servingSize: grams,
          calories: (p100.calories / 100) * grams,
          carbs: (p100.carbs / 100) * grams,
          protein: (p100.protein / 100) * grams,
          fats: (p100.fats / 100) * grams,
          per100g: p100,
        };
      }),
    );
  };

  const handleFoodChange = (
    foodId: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const numFields = ["servingSize", "calories", "carbs", "protein", "fats"];
    const processedValue = name === "foodName" ? capitalizeWords(value) : value;
    setFoods((prev) =>
      prev.map((f) => {
        if (f.id !== foodId) return f;
        
        const updated = {
          ...f,
          [name]: numFields.includes(name) ? Number(value) : processedValue,
        };
        
        if ((name === "calories" || name === "carbs" || name === "protein" || name === "fats") && updated.servingSize > 0) {
          updated.per100g = {
            calories: (updated.calories / updated.servingSize) * 100,
            carbs: (updated.carbs / updated.servingSize) * 100,
            protein: (updated.protein / updated.servingSize) * 100,
            fats: (updated.fats / updated.servingSize) * 100,
          };
        }
        
        return updated;
      }),
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedFoods((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const addFood = () => {
    const id = Date.now().toString();
    setFoods((prev) => [
      ...prev,
      {
        id,
        foodName: "",
        servingSize: 0,
        calories: 0,
        carbs: 0,
        protein: 0,
        fats: 0,
      },
    ]);
    setExpandedFoods((prev) => [...prev, id]);
  };

  const removeFood = (id: string) => {
    setFoods((prev) => prev.filter((f) => f.id !== id));
    setExpandedFoods((prev) => prev.filter((x) => x !== id));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.meal) return alert("Please select a meal");
    const valid = foods.filter((f) => f.foodName && f.calories > 0);
    if (valid.length === 0) return alert("Add at least one food");
    setIsSubmitting(true);
    try {
      for (const food of valid) {
        await saveFoodLog({
          ...food,
          date: formData.date,
          meal: formData.meal,
        });
      }
      router.push("/");
    } catch {
      alert("Failed to log food");
      setIsSubmitting(false);
    }
  };

  const totals = foods.reduce(
    (acc, f) => ({
      cal: acc.cal + f.calories,
      carb: acc.carb + f.carbs,
      pro: acc.pro + f.protein,
      fat: acc.fat + f.fats,
    }),
    { cal: 0, carb: 0, pro: 0, fat: 0 },
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-transparent to-transparent pt-6 pb-8">
        <div className="max-w-xl mx-auto px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => redirect("/")}
            className="h-10 w-10 rounded-full hover:bg-primary/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 -mt-4">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-4">
            <UtensilsCrossed size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Log Food</h1>
          <p className="text-muted-foreground font-medium mt-1">
            {formatDate(formData.date)}
          </p>
        </div>

        <Card className="border-2 shadow-lg shadow-primary/5 rounded-3xl overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Meal Type
                </label>
                <NativeSelect
                  name="meal"
                  value={formData.meal}
                  onChange={handleChange}
                  className="rounded-xl h-12 text-base font-medium"
                >
                  <NativeSelectOption value="">What are you eating?</NativeSelectOption>
                  <NativeSelectOption value="Breakfast">
                    Breakfast
                  </NativeSelectOption>
                  <NativeSelectOption value="lunch">Lunch</NativeSelectOption>
                  <NativeSelectOption value="Dinner">Dinner</NativeSelectOption>
                  <NativeSelectOption value="Etc">Snacks / Etc</NativeSelectOption>
                </NativeSelect>
              </div>

              <Suggestions
                favoriteFoods={favorites}
                recentFoods={recent}
                show={showSuggestions}
                onToggle={() => setShowSuggestions(!showSuggestions)}
                onSelect={addFromSuggestion}
              />

              <div className="space-y-4">
                {foods.map((food, i) => (
                  <FoodCard
                    key={food.id}
                    food={food}
                    index={i}
                    expanded={expandedFoods.includes(food.id)}
                    canDelete={foods.length > 1}
                    textareaRef={textareaRef}
                    onToggleExpand={toggleExpand}
                    onDelete={removeFood}
                    onServingSizeChange={handleServingChange}
                    onFoodChange={handleFoodChange}
                    onPaste={handlePaste}
                  />
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={addFood}
                className="w-full h-12 rounded-xl border-dashed border-2 font-semibold"
              >
                <FaPlus className="mr-2 h-4 w-4" /> Add Another Food
              </Button>

              <div className="bg-muted/50 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Total Calories</span>
                  <span className="text-2xl font-black text-primary">
                    {totals.cal.toFixed(0)}
                    <span className="text-sm font-medium text-muted-foreground ml-1">kcal</span>
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Carbs: <span className="font-bold text-foreground">{totals.carb.toFixed(0)}g</span></span>
                  <span>Protein: <span className="font-bold text-foreground">{totals.pro.toFixed(0)}g</span></span>
                  <span>Fats: <span className="font-bold text-foreground">{totals.fat.toFixed(0)}g</span></span>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20"
                disabled={isSubmitting}
              >
                <FaPlus className="mr-2" /> Log {foods.filter(f => f.foodName && f.calories > 0).length || 0} Food{foods.filter(f => f.foodName && f.calories > 0).length !== 1 ? 's' : ''}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
