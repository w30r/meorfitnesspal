"use client";

import { Input } from "@/components/ui/input";
import {
  saveFoodLog,
  getRecentFoods,
  getFavoriteFoods,
  toggleFavorite,
} from "../../actions";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { Button } from "@/components/ui/button";
import { FaPlus, FaRegHeart, FaHeart } from "react-icons/fa6";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { FaPaste } from "react-icons/fa";
import { ChevronLeft, ChevronDown, ChevronRight, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface FoodEntry {
  id: string;
  foodName: string;
  servingSize: number;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  isFavorite?: boolean;
}

interface SuggestionFood extends FoodEntry {
  _id?: string;
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

let str =
  "give the nutrional facts per 100g in JSON format (use the field names: calories, carbs, protein, fats. and the value in number not string) for ";
str = str.replaceAll(" ", "+");
let str2 =
  "give the nutrional facts for a typical portion in JSON format (use the field names: calories, carbs, protein, fats. and the value in number not string) for ";
str2 = str2.replaceAll(" ", "+");

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
  const [per100g, setPer100g] = useState({
    calories: 0,
    carbs: 0,
    protein: 0,
    fats: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentFoods, setRecentFoods] = useState<SuggestionFood[]>([]);
  const [favoriteFoods, setFavoriteFoods] = useState<SuggestionFood[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        const recent = await getRecentFoods(15);
        const favorites = await getFavoriteFoods();
        setRecentFoods(recent || []);
        setFavoriteFoods(favorites || []);
      } catch (e) {
        console.error("Failed to load suggestions", e);
      }
    };
    loadSuggestions();
  }, []);

  const addFromSuggestion = (food: FoodEntry) => {
    const newId = Date.now().toString();
    setFoods((prev) => [
      ...prev,
      {
        id: newId,
        foodName: food.foodName,
        servingSize: food.servingSize || 0,
        calories: food.calories,
        carbs: food.carbs,
        protein: food.protein,
        fats: food.fats,
      },
    ]);
    setExpandedFoods((prev) => [...prev, newId]);
  };

  const handleToggleFavorite = async (foodId: string) => {
    try {
      await toggleFavorite(foodId);
      const favorites = await getFavoriteFoods();
      setFavoriteFoods(favorites || []);
    } catch (e) {
      console.error("Failed to toggle favorite", e);
    }
  };

  const readClipboard = async (foodId: string) => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        if (textareaRef.current) {
          textareaRef.current.value = text;
        }
        handlePaste(text, foodId);
      }
    } catch (err) {
      console.error("Clipboard access denied", err);
      alert("Please allow clipboard permissions to use this feature.");
    }
  };

  const handlePaste = (pastedText: string, foodId: string) => {
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

    setFoods((prev) =>
      prev.map((f) =>
        f.id === foodId && f.servingSize > 0
          ? {
              ...f,
              calories: (newData.calories * f.servingSize) / 100,
              carbs: (newData.carbs * f.servingSize) / 100,
              protein: (newData.protein * f.servingSize) / 100,
              fats: (newData.fats * f.servingSize) / 100,
            }
          : f,
      ),
    );
  };

  const handleHundredg = (foodId: string, n: number) => {
    setFoods((prev) =>
      prev.map((f) =>
        f.id === foodId
          ? {
              ...f,
              servingSize: n,
              calories: (per100g.calories / 100) * n,
              carbs: (per100g.carbs / 100) * n,
              protein: (per100g.protein / 100) * n,
              fats: (per100g.fats / 100) * n,
            }
          : f,
      ),
    );
  };

  const handleServingSizeChange = (
    foodId: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const servingSize = Number(e.target.value);
    setFoods((prev) =>
      prev.map((f) =>
        f.id === foodId
          ? {
              ...f,
              servingSize: servingSize,
              calories: (servingSize * per100g.calories) / 100,
              carbs: (servingSize * per100g.carbs) / 100,
              protein: (servingSize * per100g.protein) / 100,
              fats: (servingSize * per100g.fats) / 100,
            }
          : f,
      ),
    );
  };

  const handleFoodChange = (
    foodId: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFoods((prev) =>
      prev.map((f) =>
        f.id === foodId
          ? {
              ...f,
              [name]: [
                "servingSize",
                "calories",
                "carbs",
                "protein",
                "fats",
              ].includes(name)
                ? Number(value)
                : value,
            }
          : f,
      ),
    );
  };

  const toggleExpand = (foodId: string) => {
    setExpandedFoods((prev) =>
      prev.includes(foodId)
        ? prev.filter((id) => id !== foodId)
        : [...prev, foodId],
    );
  };

  const addFood = () => {
    const newId = Date.now().toString();
    setFoods((prev) => [
      ...prev,
      {
        id: newId,
        foodName: "",
        servingSize: 0,
        calories: 0,
        carbs: 0,
        protein: 0,
        fats: 0,
      },
    ]);
    setExpandedFoods((prev) => [...prev, newId]);
  };

  const removeFood = (foodId: string) => {
    setFoods((prev) => prev.filter((f) => f.id !== foodId));
    setExpandedFoods((prev) => prev.filter((id) => id !== foodId));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.meal) {
      alert("Please select a meal");
      return;
    }
    const validFoods = foods.filter((f) => f.foodName && f.calories > 0);
    if (validFoods.length === 0) {
      alert("Please add at least one food with calories");
      return;
    }
    setIsSubmitting(true);
    try {
      for (const food of validFoods) {
        await saveFoodLog({
          ...food,
          date: formData.date,
          meal: formData.meal,
        });
      }
      router.push("/");
    } catch (error) {
      console.error("Failed to log food", error);
      alert("Failed to log food.");
      setIsSubmitting(false);
    }
  };

  const totalCalories = foods.reduce((acc, f) => acc + f.calories, 0);
  const totalCarbs = foods.reduce((acc, f) => acc + f.carbs, 0);
  const totalProtein = foods.reduce((acc, f) => acc + f.protein, 0);
  const totalFats = foods.reduce((acc, f) => acc + f.fats, 0);

  return (
    <div className="min-h-screen bg-background dark:bg-background py-8 px-4">
      <Card className="max-w-xl mx-auto shadow-lg">
        <div className="ml-4 mb-2">
          <Button variant="outline" onClick={() => redirect("/")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <CardHeader className="text-center border-b mb-4">
          <CardTitle className="text-2xl font-bold">Log Food</CardTitle>
          <p className="text-muted-foreground font-medium">
            {formatDate(formData.date)}
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <NativeSelect
                name="meal"
                value={formData.meal}
                onChange={handleChange}
              >
                <NativeSelectOption value="">Select meal</NativeSelectOption>
                <NativeSelectOption value="Breakfast">
                  Breakfast
                </NativeSelectOption>
                <NativeSelectOption value="Lunch">lunch</NativeSelectOption>
                <NativeSelectOption value="Dinner">Dinner</NativeSelectOption>
                <NativeSelectOption value="Etc">Etc</NativeSelectOption>
              </NativeSelect>
            </div>

            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[10px]"
                type="button"
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                {showSuggestions ? "Hide" : "Show"} suggestions
              </Button>
            </div>
            {showSuggestions &&
              (favoriteFoods.length > 0 || recentFoods.length > 0) && (
                <div className="space-y-3">
                  {favoriteFoods.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 flex items-center gap-1">
                        <FaHeart className="w-2 h-2" /> Favorites
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {favoriteFoods.map((food) => (
                          <Button
                            key={food._id}
                            variant="outline"
                            size="sm"
                            type="button"
                            className="h-7 text-xs"
                            onClick={() => addFromSuggestion(food)}
                          >
                            {food.foodName}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  {recentFoods.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                        Recent
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {recentFoods.slice(0, 10).map((food) => (
                          <Button
                            key={food._id}
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => addFromSuggestion(food)}
                          >
                            {food.foodName}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            {foods.map((food, index) => (
              <details
                key={food.id}
                className="border border-border rounded-lg overflow-hidden"
                open={expandedFoods.includes(food.id)}
              >
                <summary
                  className="flex items-center justify-between p-3 cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors list-none"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleExpand(food.id);
                  }}
                >
                  <div className="flex items-center gap-2">
                    {expandedFoods.includes(food.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <span className="font-medium">
                      {food.foodName || `Food ${index + 1}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {food.calories.toFixed(0)} kcal
                    </span>
                    {foods.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFood(food.id);
                        }}
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </summary>

                <div className="p-3 space-y-3 border-t border-border">
                  <div className="space-y-2">
                    <Input
                      name="foodName"
                      placeholder="Food name"
                      value={food.foodName}
                      onChange={(e) => handleFoodChange(food.id, e)}
                      className="font-medium"
                    />
                    <div className="flex gap-1">
                      <Button
                        variant="secondary"
                        size="sm"
                        type="button"
                        asChild
                        className="text-xs flex-1"
                      >
                        <a
                          href={`https://www.google.com/search?q=${str}${food.foodName}`}
                          target="_blank"
                        >
                          100g
                        </a>
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        type="button"
                        asChild
                        className="text-xs flex-1"
                      >
                        <a
                          href={`https://www.google.com/search?q=${str2}${food.foodName}`}
                          target="_blank"
                        >
                          Typical
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      <Input
                        name="servingSize"
                        type="number"
                        placeholder="g"
                        value={food.servingSize || ""}
                        onChange={(e) => handleServingSizeChange(food.id, e)}
                        className="w-20 h-8 text-sm"
                      />
                      {[50, 100, 150, 200].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          type="button"
                          onClick={() => handleHundredg(food.id, amount)}
                          className="h-8 text-xs"
                        >
                          {amount}g
                        </Button>
                      ))}
                    </div>
                  </div>

                  <details className="border border-border rounded overflow-hidden">
                    <summary className="flex items-center justify-center p-1 cursor-pointer bg-muted/30 hover:bg-muted/50 text-[10px] text-muted-foreground list-none">
                      <FaPaste className="w-3 h-3 mr-1" /> Data Import
                    </summary>
                    <div className="p-2 border-t border-border space-y-1">
                      <Textarea
                        ref={index === 0 ? textareaRef : undefined}
                        placeholder="Paste JSON..."
                        onChange={(e) => handlePaste(e.target.value, food.id)}
                        className="bg-background font-mono text-[10px] h-12"
                      />
                    </div>
                  </details>

                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <Label className="text-[10px]">Calories</Label>
                      <Input
                        name="calories"
                        type="number"
                        value={food.calories.toFixed(0) || ""}
                        onChange={(e) => handleFoodChange(food.id, e)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-emerald-600">
                        Carbs
                      </Label>
                      <Input
                        name="carbs"
                        type="number"
                        value={food.carbs.toFixed(0) || ""}
                        onChange={(e) => handleFoodChange(food.id, e)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-rose-600">
                        Protein
                      </Label>
                      <Input
                        name="protein"
                        type="number"
                        value={food.protein.toFixed(0) || ""}
                        onChange={(e) => handleFoodChange(food.id, e)}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-[10px] text-amber-600">Fats</Label>
                      <Input
                        name="fats"
                        type="number"
                        value={food.fats.toFixed(0) || ""}
                        onChange={(e) => handleFoodChange(food.id, e)}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </details>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addFood}
              className="w-full"
            >
              <FaPlus className="mr-2 h-3 w-3" /> Add Food
            </Button>

            <div className="flex justify-between text-sm text-muted-foreground pt-2 border-t">
              <span>Total:</span>
              <span>
                {totalCalories.toFixed(0)} kcal | C:{totalCarbs.toFixed(0)} P:
                {totalProtein.toFixed(0)} F:{totalFats.toFixed(0)}
              </span>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold"
              disabled={isSubmitting}
            >
              <FaPlus className="mr-2" /> Log Food
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
