"use client";

import { Input } from "@/components/ui/input";
import { saveFoodLog, parseFoodWithGemini } from "../../actions";
import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { redirect, useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
} from "lucide-react";
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

const foodEmojiMap: Record<string, string> = {
  // --- Original List (Preserved) ---
  nasi: "🍚",
  rice: "🍚",
  ayam: "🍗",
  chicken: "🍗",
  beef: "🥩",
  rendang: "🥩",
  ikan: "🐟",
  dory: "🐟",
  fish: "🐟",
  telur: "🥚",
  egg: "🥚",
  mee: "🍜",
  mi: "🍜",
  bihun: "🍜",
  laksa: "🍜",
  kway: "🍜",
  roti: "🍞",
  bread: "🍞",
  tosai: "🍞",
  toast: "🍞",
  kopi: "☕",
  coffee: "☕",
  latte: "☕",
  tea: "🍵",
  goreng: "🍳", // Updated from 🤢 for better appetite!
  "milk tea": "🧋",
  keropok: "🥨",
  kerepek: "🥨",
  satay: "🍡",
  burger: "🍔",
  pizza: "🍕",
  sundae: "🍦",
  boba: "🧋",

  // --- 100 New Additions (Malaysian Favorites) ---

  // Rice & Grains
  "nasi lemak": "🍱",
  "nasi kerabu": "🦋",
  "nasi kandar": "🍛",
  "nasi dagang": "🍛",
  "nasi himpit": "🧊",
  "nasi goreng": "🥡",
  "fried rice": "🥡",
  bubur: "🥣",
  porridge: "🥣",
  ketupat: "🎍",
  lemang: "🎋",
  pulut: "🍙",
  "sticky rice": "🍙",

  // Noodles
  "char kway teow": "🔥",
  "curry mee": "🌶️",
  "curry noodle": "🌶️",
  "wantan mee": "🥟",
  "pan mee": "🍜",
  maggi: "🍜",
  indomie: "🍜",
  "lor mee": "🥣",
  "mee rebus": "🍜",
  spaghetti: "🍝",
  pasta: "🍝",

  // Meat & Proteins
  kambing: "🍖",
  lamb: "🍖",
  mutton: "🍖",
  babi: "🥓",
  pork: "🥓",
  duck: "🦆",
  itik: "🦆",
  puyuh: "🐦",
  quail: "🐦",
  nugget: "🍗",
  sosej: "🌭",
  sausage: "🌭",
  meatball: "🧆",
  fishball: "🍡",

  // Seafood
  udang: "🦐",
  prawn: "🦐",
  shrimp: "🦐",
  sotong: "🦑",
  squid: "🦑",
  ketam: "🦀",
  crab: "🦀",
  kerang: "🐚",
  cockles: "🐚",
  clam: "🐚",
  tuna: "🐟",
  salmon: "🍣",

  // Breads & Pastries
  canai: "🫓",
  naan: "🫓",
  capati: "🫓",
  pau: "🥟",
  bun: "🥯",
  karipap: "🥟",
  "curry puff": "🥟",
  kek: "🍰",
  cake: "🍰",
  donut: "🍩",
  waffle: "🧇",
  pancake: "🥞",
  lempeng: "🥞",
  sandwich: "🥪",

  // Fruits (The Malaysian Staples)
  durian: "👑",
  rambutan: "☄️",
  manggis: "🟣",
  mangosteen: "🟣",
  mangga: "🥭",
  mango: "🥭",
  pisang: "🍌",
  banana: "🍌",
  nanas: "🍍",
  pineapple: "🍍",
  tembikai: "🍉",
  watermelon: "🍉",
  betik: "🥭",
  papaya: "🥭",
  kelapa: "🥥",
  coconut: "🥥",
  epal: "🍎",
  apple: "🍎",
  limau: "🍋",
  lime: "🍋",

  // Vegetables & Sides
  sayur: "🥦",
  vegetable: "🥦",
  kentang: "🥔",
  potato: "🥔",
  fries: "🍟",
  salad: "🥗",
  timun: "🥒",
  cucumber: "🥒",
  jagung: "🌽",
  corn: "🌽",
  cendawan: "🍄",
  mushroom: "🍄",
  petai: "🤢", // This deserves the emoji you used earlier!
  kacang: "🥜",
  peanut: "🥜",

  // Desserts & Sweets
  cendol: "🍧",
  "ais kacang": "🍧",
  abc: "🍧",
  "kuih muih": "🍡",
  apam: "🧁",
  puding: "🍮",
  pudding: "🍮",
  coklat: "🍫",
  chocolate: "🍫",
  biskut: "🍪",
  biscuit: "🍪",
  "ice cream": "🍨",
  aiskrim: "🍨",

  // Drinks
  "teh tarik": "☕",
  "teh o": "☕",
  milo: "🧋",
  horlicks: "🥛",
  sirap: "🥤",
  syrup: "🥤",
  bandung: "🌸",
  juice: "🧃",
  jus: "🧃",
  soda: "🥤",
  beer: "🍺",
  wine: "🍷",
  air: "💧",
  water: "💧",
  susu: "🥛",
  milk: "🥛",
  soya: "🥛",

  // Flavors & Miscellaneous
  sambal: "🌶️",
  pedas: "🌶️",
  spicy: "🌶️",
  keju: "🧀",
  cheese: "🧀",
  madu: "🍯",
  honey: "🍯",
  soup: "🍲",
  sup: "🍲",
  garam: "🧂",
  salt: "🧂",
  gula: "🍭",
  sugar: "🍭",
};

const addEmoji = (foodName: string): string => {
  const lower = foodName.toLowerCase();
  for (const keyword of Object.keys(foodEmojiMap)) {
    if (lower.includes(keyword)) {
      return `${foodEmojiMap[keyword]} ${foodName}`;
    }
  }
  return `🍽️ ${foodName}`;
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [step, setStep] = useState(1);
  const [favorites, setFavorites] = useState<SuggestionFood[]>([]);
  const [customFavs, setCustomFavs] = useState<SuggestionFood[]>([]);
  const [recent, setRecent] = useState<SuggestionFood[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiDone, setAiDone] = useState(false);

  useEffect(() => {
    import("../../actions").then(
      ({ getRecentFoods, getFavoriteFoods, getCustomFavorites }) => {
        Promise.all([
          getRecentFoods(15),
          getFavoriteFoods(),
          getCustomFavorites(),
        ])
          .then(([r, f, c]) => {
            setRecent(r || []);
            setFavorites(f || []);
            setCustomFavs(c || []);
            setSuggestionsLoading(false);
          })
          .catch(console.error);
      },
    );
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

  const handleAIParse = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiError("");
    try {
      const result = await parseFoodWithGemini(aiInput);
      if (result.length === 0)
        throw new Error("No foods could be parsed from that description");
      setFoods(result);
      setExpandedFoods(result.map((f: FoodEntry) => f.id));
      setAiDone(true);
      setTimeout(() => setAiDone(false), 2500);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Failed to parse");
    } finally {
      setAiLoading(false);
    }
  };

  const addFromSuggestion = (food: SuggestionFood) => {
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

    setFoods((prev) => {
      const emptyIndex = prev.findIndex(
        (f) => !f.foodName && f.calories === 0 && f.servingSize === 0,
      );
      const newId = Date.now().toString();
      const newFood = {
        id: emptyIndex !== -1 ? prev[emptyIndex].id : newId,
        foodName: capitalizeWords(food.foodName),
        servingSize: serving,
        calories: p100 ? (p100.calories / 100) * serving : food.calories,
        carbs: p100 ? (p100.carbs / 100) * serving : food.carbs,
        protein: p100 ? (p100.protein / 100) * serving : food.protein,
        fats: p100 ? (p100.fats / 100) * serving : food.fats,
        per100g: p100 || undefined,
      };
      if (emptyIndex !== -1) {
        const updated = [...prev];
        updated[emptyIndex] = newFood;
        setExpandedFoods((prevExp) => {
          if (!prevExp.includes(prev[emptyIndex].id)) {
            return [...prevExp, prev[emptyIndex].id];
          }
          return prevExp;
        });
        return updated;
      }
      setExpandedFoods((prevExp) => [...prevExp, newId]);
      return [...prev, newFood];
    });
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

        if (
          (name === "calories" ||
            name === "carbs" ||
            name === "protein" ||
            name === "fats") &&
          updated.servingSize > 0
        ) {
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
          foodName: addEmoji(food.foodName),
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

  const steps = [
    { num: 1, label: "Meal" },
    { num: 2, label: "Food" },
    { num: 3, label: "Review" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/5 via-transparent to-transparent pt-6 pb-8">
        <div className="max-w-xl mx-auto px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (step === 1 ? redirect("/") : setStep(step - 1))}
            className="h-10 w-10 rounded-full hover:bg-primary/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 -mt-4 space-y-4">
        <div className="text-center mb-4">
          <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-4">
            <UtensilsCrossed size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Log Food</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => {
                const d = new Date(formData.date);
                d.setDate(d.getDate() - 1);
                setFormData((prev) => ({
                  ...prev,
                  date: d.toLocaleDateString("en-CA"),
                }));
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-36 h-9 text-center font-medium text-foreground bg-background border-2 border-dashed border-muted-foreground/30 rounded-xl"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => {
                const d = new Date(formData.date);
                d.setDate(d.getDate() + 1);
                setFormData((prev) => ({
                  ...prev,
                  date: d.toLocaleDateString("en-CA"),
                }));
              }}
            >
              <ChevronLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-0 mb-2">
          {steps.map((s, i) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num)}
              className="flex items-center cursor-pointer"
            >
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-colors ${
                  step === s.num
                    ? "bg-primary text-primary-foreground"
                    : step > s.num
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s.num ? <Check className="h-4 w-4" /> : s.num}
              </div>
              <span
                className={`text-xs font-medium ml-1.5 mr-3 ${
                  step === s.num ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={`w-8 h-0.5 mr-3 rounded-full ${
                    step > s.num ? "bg-primary/40" : "bg-muted"
                  }`}
                />
              )}
            </button>
          ))}
        </div>

        {/* Step 1: Meal Selection */}
        {step === 1 && (
          <Card className="border-2 border-border/60 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Which meal are you logging for?
              </p>
              <div className="flex gap-3">
                {[
                  { value: "Breakfast", label: "Breakfast", icon: "🌅" },
                  { value: "Lunch", label: "Lunch", icon: "☀️" },
                  { value: "Dinner", label: "Dinner", icon: "🌙" },
                  { value: "Etc", label: "Snacks", icon: "🍿" },
                ].map((meal) => (
                  <Button
                    key={meal.value}
                    type="button"
                    variant={
                      formData.meal === meal.value ? "default" : "outline"
                    }
                    className={`flex-1 rounded-xl font-medium h-20 flex-col gap-1 ${
                      formData.meal === meal.value ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, meal: meal.value }))
                    }
                  >
                    <span className="text-lg">{meal.icon}</span>
                    {meal.label}
                  </Button>
                ))}
              </div>
              <Button
                className="w-full mt-6 h-12 rounded-xl font-bold"
                disabled={!formData.meal}
                onClick={() => setStep(2)}
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Add Food */}
        {step === 2 && (
          <div className="md:relative md:left-1/2 md:-translate-x-1/2 md:w-[calc(100vw-2rem)] md:max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: AI Parsing + Foods */}
              <div className="space-y-4">
                {/* AI Parsing */}
                <Card className="border-2 border-border/60 shadow-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        AI Parsing
                      </span>
                    </div>
                    <textarea
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="e.g. 200g chicken breast, 150g jasmine rice, 1 tbsp olive oil"
                      className="w-full min-h-[80px] bg-background border-2 border-border/60 rounded-xl p-3 text-sm font-medium resize-none focus:outline-none focus:border-primary/40 transition-colors"
                      rows={3}
                    />
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        onClick={handleAIParse}
                        disabled={aiLoading || !aiInput.trim()}
                        className="h-9 px-4 rounded-xl font-semibold text-xs"
                      >
                        {aiLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                            Parsing...
                          </span>
                        ) : aiDone ? (
                          <span className="flex items-center gap-2">
                            <Check className="h-4 w-4" /> Done
                          </span>
                        ) : (
                          "Parse with AI"
                        )}
                      </Button>
                      {aiError && (
                        <span className="text-xs text-destructive font-medium">
                          {aiError}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {aiDone && (
                  <div className="relative flex justify-center pointer-events-none -my-2">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute h-2.5 w-2.5 rounded-full"
                        style={
                          {
                            backgroundColor: `hsl(${i * 30}, 80%, 60%)`,
                            animation: `particle-burst 0.8s ease-out forwards`,
                            animationDelay: `${i * 0.04}s`,
                            "--rotation": `${i * 30}deg`,
                            opacity: 0,
                          } as React.CSSProperties
                        }
                      />
                    ))}
                  </div>
                )}

                {/* Manual Foods */}
                <Card className="border-2 border-border/60 shadow-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Foods
                      </span>
                    </div>
                    <div className="space-y-3">
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
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Quick Add + Next */}
              <div className="space-y-4 max-w-lg">
                {/* Quick Add */}
                <Card className="border-2 border-border/60 shadow-sm rounded-2xl overflow-hidden">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                        Quick Add
                      </span>
                    </div>
                    <Suggestions
                      favoriteFoods={favorites}
                      customFoods={customFavs}
                      recentFoods={recent}
                      show={showSuggestions}
                      loading={suggestionsLoading}
                      onToggle={() => setShowSuggestions(!showSuggestions)}
                      onSelect={addFromSuggestion}
                    />
                  </CardContent>
                </Card>

                <Button
                  className="w-full h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20"
                  onClick={() => setStep(3)}
                >
                  Next <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <Card className="border-2 border-border/60 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {formData.meal} &middot; {formatDate(formData.date)}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  {foods.filter((f) => f.foodName && f.calories > 0).length >
                  0 ? (
                    foods
                      .filter((f) => f.foodName && f.calories > 0)
                      .map((food) => (
                        <div
                          key={food.id}
                          className="flex items-center justify-between bg-muted/30 rounded-xl p-3"
                        >
                          <div>
                            <p className="font-medium text-sm">
                              {food.foodName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {food.servingSize}g
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">
                              {food.calories.toFixed(0)} kcal
                            </p>
                            <p className="text-xs text-muted-foreground">
                              C: {food.carbs.toFixed(0)}g &middot; P:{" "}
                              {food.protein.toFixed(0)}g &middot; F:{" "}
                              {food.fats.toFixed(0)}g
                            </p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No foods added yet. Go back and add some food.
                    </p>
                  )}
                </div>

                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Total
                    </span>
                    <span className="text-2xl font-black text-foreground">
                      {totals.cal.toFixed(0)}
                      <span className="text-sm font-medium text-muted-foreground ml-1">
                        kcal
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">
                      Carbs:{" "}
                      <span className="text-foreground">
                        {totals.carb.toFixed(0)}g
                      </span>
                    </span>
                    <span className="text-muted-foreground">
                      Protein:{" "}
                      <span className="text-foreground">
                        {totals.pro.toFixed(0)}g
                      </span>
                    </span>
                    <span className="text-muted-foreground">
                      Fats:{" "}
                      <span className="text-foreground">
                        {totals.fat.toFixed(0)}g
                      </span>
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg shadow-primary/20"
                  disabled={isSubmitting}
                >
                  <FaPlus className="mr-2" /> Log{" "}
                  {foods.filter((f) => f.foodName && f.calories > 0).length ||
                    0}{" "}
                  Food
                  {foods.filter((f) => f.foodName && f.calories > 0).length !==
                  1
                    ? "s"
                    : ""}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
