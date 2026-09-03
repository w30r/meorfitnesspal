"use server";

import { ObjectId } from "mongodb";
import { connectToDatabase } from "./lib/mongodb";
import { getUserId } from "./lib/session";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

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
  isFavorite?: boolean;
  per100g?: {
    calories: number;
    carbs: number;
    protein: number;
    fats: number;
  };
}

// Define the shape of the function response
export interface FoodLogResponse {
  logs: FoodEntry[];
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFats: number;
}

export interface FoodLog {
  foodName: string;
  servingSize: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  date: string;
  meal: string;
}

interface FormData {
  foodName: string;
  servingSize: number;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  date: string;
  meal: string;
  per100g?: {
    calories: number;
    carbs: number;
    protein: number;
    fats: number;
  };
}

export async function saveFoodLog(foodLog: FormData) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");

    let per100g = foodLog.per100g;
    if (!per100g && foodLog.servingSize > 0 && foodLog.calories > 0) {
      per100g = {
        calories: (foodLog.calories / foodLog.servingSize) * 100,
        carbs: (foodLog.carbs / foodLog.servingSize) * 100,
        protein: (foodLog.protein / foodLog.servingSize) * 100,
        fats: (foodLog.fats / foodLog.servingSize) * 100,
      };
    }

    const docToSave = { ...foodLog, userId, per100g };
    const result = await collection.insertOne(docToSave);
    const insertedDocument = await collection.findOne({
      _id: result.insertedId,
    });
    return JSON.parse(JSON.stringify(insertedDocument));
  } catch (error) {
    console.error("Failed to save food log", error);
    throw error;
  }
}

//get food logs
export async function getFoodLogs() {
  try {
    const userId = await getUserId();
    if (!userId) return [];
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");
    const foodLogs = await collection.find({ userId }).toArray();
    return JSON.parse(JSON.stringify(foodLogs));
  } catch (error) {
    console.error("Failed to get food logs", error);
    throw error;
  }
}

// get total calories by date
export async function getTotalCaloriesByDate(date: string) {
  try {
    const userId = await getUserId();
    if (!userId) return [{ _id: date, totalCalories: 0 }];
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");
    const totalCalories = await collection
      .aggregate([
        { $match: { date, userId } },
        { $group: { _id: "$date", totalCalories: { $sum: "$calories" } } },
      ])
      .toArray();
    return JSON.parse(JSON.stringify(totalCalories));
  } catch (error) {
    return [{ _id: "takde", totalCalories: 1, status: "none" }];
  }
}

// calculate streak (consecutive days with food logs)
export async function getStreak() {
  try {
    const userId = await getUserId();
    if (!userId) return 0;
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");

    const logs = (await collection
      .find({ userId })
      .sort({ date: -1 })
      .limit(100)
      .project({ date: 1, _id: 0 })
      .toArray()) as { date: string }[];

    if (!logs || logs.length === 0) return 0;

    const uniqueDates = new Set(logs.map((l) => l.date));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const formatDate = (d: Date) =>
      `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;

    let streak = 0;
    let checkDate = new Date(today);

    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);

    if (!uniqueDates.has(todayStr) && !uniqueDates.has(yesterdayStr)) {
      return 0;
    }

    if (!uniqueDates.has(todayStr)) {
      checkDate = yesterday;
    }

    while (uniqueDates.has(formatDate(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return streak;
  } catch (error) {
    console.error("Failed to get streak", error);
    return 0;
  }
}

// get total protein by date
export async function getTotalProteinByDate(date: string) {
  try {
    const userId = await getUserId();
    if (!userId) return [{ _id: date, totalProtein: 0 }];
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");
    const totalProtein = await collection
      .aggregate([
        { $match: { date, userId } },
        { $group: { _id: "$date", totalProtein: { $sum: "$protein" } } },
      ])
      .toArray();
    return JSON.parse(JSON.stringify(totalProtein));
  } catch (error) {
    console.error("Failed to get total protein by date", error);
    return [{ _id: "takde", totalProtein: 1, status: "none" }];
  }
}

// get total carbs by date
export async function getTotalCarbsByDate(date: string) {
  try {
    const userId = await getUserId();
    if (!userId) return [{ _id: date, totalCarbs: 0 }];
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");
    const totalCarbs = await collection
      .aggregate([
        { $match: { date, userId } },
        { $group: { _id: "$date", totalCarbs: { $sum: "$carbs" } } },
      ])
      .toArray();
    return JSON.parse(JSON.stringify(totalCarbs));
  } catch (error) {
    console.error("Failed to get total carbs by date", error);
    return [{ _id: "takde", totalCarbs: 1, status: "none" }];
  }
}

// get total fats by date
export async function getTotalFatsByDate(date: string) {
  try {
    const userId = await getUserId();
    if (!userId) return [{ _id: date, totalFats: 0 }];
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");
    const totalFats = await collection
      .aggregate([
        { $match: { date, userId } },
        { $group: { _id: "$date", totalFats: { $sum: "$fats" } } },
      ])
      .toArray();
    return JSON.parse(JSON.stringify(totalFats));
  } catch (error) {
    console.error("Failed to get total fats by date", error);
    return [{ _id: "takde", totalFats: 1, status: "none" }];
  }
}

// get goal data
export async function getGoalData() {
  try {
    const userId = await getUserId();
    if (!userId) return null;
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("goal");
    const goalData = await collection.find({ userId }).toArray();
    return JSON.parse(JSON.stringify(goalData));
  } catch (error) {
    console.error("Failed to get goal data", error);
    return null;
  }
}

// update macros and calories goal
export async function updateMacrosAndCaloriesGoal(
  calories: number,
  protein: number,
  carbs: number,
  fats: number,
) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("goal");
    const result = await collection.updateOne(
      { userId },
      { $set: { calories, protein, carbs, fats, userId } },
      { upsert: true },
    );
    return result.modifiedCount;
  } catch (error) {
    console.error("Failed to update macros and calories goal", error);
    throw error;
  }
}

// get today's food log
export async function getTodaysFoodLog() {
  try {
    const userId = await getUserId();
    if (!userId) return [];
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");
    const today = new Date().toISOString().split("T")[0];
    const foodLog = await collection.find({ date: today, userId }).toArray();
    return JSON.parse(JSON.stringify(foodLog));
  } catch (error) {
    console.error("Failed to get today's food log", error);
    throw error;
  }
}

export async function getFoodLogbyDate(date: string) {
  try {
    const userId = await getUserId();
    if (!userId) return { logs: [], totalCalories: 0, totalCarbs: 0, totalProtein: 0, totalFats: 0 };
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");

    const foodLog = await collection.find({ date, userId }).toArray();

    const totals = foodLog.reduce(
      (acc, item) => {
        acc.totalCalories += item.calories || 0;
        acc.totalCarbs += item.carbs || 0;
        acc.totalProtein += item.protein || 0;
        acc.totalFats += item.fats || 0;
        return acc;
      },
      {
        totalCalories: 0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFats: 0,
      },
    );

    return {
      logs: JSON.parse(JSON.stringify(foodLog)),
      ...totals,
    };
  } catch (error) {
    console.error("Failed to get food log by date", error);
    throw error;
  }
}

// delete meal by ID - preserve favorite if marked
export async function deleteMealById(mealId: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");

    // First check if this food is marked as favorite
    const food = await collection.findOne({ _id: new ObjectId(mealId), userId });
    
    // If marked as favorite, copy to favoritefoods collection before deleting
    if (food?.isFavorite) {
      const favCollection = db.collection("favoritefoods");
      await favCollection.insertOne({
        userId,
        foodName: food.foodName,
        servingSize: food.servingSize || 0,
        calories: food.calories || 0,
        carbs: food.carbs || 0,
        protein: food.protein || 0,
        fats: food.fats || 0,
        per100g: food.per100g,
        createdAt: new Date(),
      });
    }

    const result = await collection.deleteOne({ _id: new ObjectId(mealId), userId });

    revalidatePath("/foodlogs/[date]", "page");
    revalidatePath("/favs");

    return result.deletedCount;
  } catch (error) {
    console.error("Failed to delete meal by ID", error);
    throw error;
  }
}

// last x number of food logs
export async function getLatestFoodLogs(days: number) {
  try {
    const userId = await getUserId();
    if (!userId) return { success: true, data: [] };
    
    const db = await connectToDatabase("meorfitnesspal");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    const startDateString = startDate.toISOString().split("T")[0];

    const stats = await db
      .collection("foodlog")
      .aggregate([
        {
          $match: {
            date: { $gte: startDateString },
            userId,
          },
        },
        {
          $group: {
            _id: "$date",
            totalCalories: { $sum: "$calories" },
            totalCarbs: { $sum: "$carbs" },
            totalProtein: { $sum: "$protein" },
            totalFats: { $sum: "$fats" },
            logCount: { $sum: 1 },
          },
        },
        {
          $sort: { _id: -1 },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            totalCalories: 1,
            totalCarbs: 1,
            totalProtein: 1,
            totalFats: 1,
            logCount: 1,
          },
        },
      ])
      .toArray();

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("Error in getLatestFoodLogs:", error);
    return {
      success: false,
      error: "Internal Server Error: Could not fetch logs.",
    };
  }
}

// 1. Fetch all weight logs (sorted by date for the graph)
export async function getWeightLogs() {
  try {
    const userId = await getUserId();
    if (!userId) return [];
    
    const db = await connectToDatabase("meorfitnesspal");
    const logs = await db
      .collection("weightlog")
      .find({ userId })
      .sort({ date: 1 })
      .toArray();

    return logs.map((log) => ({
      ...log,
      _id: log._id.toString(),
    }));
  } catch (error) {
    console.error("Failed to fetch weight logs:", error);
    return [];
  }
}

// 2. Add or Update weight for a specific date
export async function upsertWeight(weight: number, date: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("weightlog");

    await collection.updateOne(
      { date, userId },
      { $set: { weight, date, userId } },
      { upsert: true },
    );

    revalidatePath("/weight");
    return { success: true };
  } catch (error) {
    console.error("Failed to log weight:", error);
    throw new Error("Failed to save weight entry.");
  }
}

// 3. Delete a weight log
export async function deleteWeightById(id: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");
    
    const db = await connectToDatabase("meorfitnesspal");
    const result = await db
      .collection("weightlog")
      .deleteOne({ _id: new ObjectId(id), userId });

    revalidatePath("/weight");
    return result.deletedCount;
  } catch (error) {
    console.error("Failed to delete weight log:", error);
    throw error;
  }
}

export async function getCombinedWeightAndCals() {
  const userId = await getUserId();
  if (!userId) return [];
  
  const db = await connectToDatabase("meorfitnesspal");

  const [weightLogs, foodLogs] = await Promise.all([
    db.collection("weightlog").find({ userId }).toArray(),
    db.collection("foodlog").find({ userId }).toArray(),
  ]);

  // Build daily calories from foodLogs
  const dailyCalories: Record<string, number> = {};

  foodLogs.forEach((log) => {
    const p = Number(log.protein) || 0;
    const c = Number(log.carbs) || 0;
    const f = Number(log.fats) || 0;
    const totalCals = p * 4 + c * 4 + f * 9;

    // Convert YYYY-MM-DD to DD-MM-YYYY to match weightlog
    let dateKey = log.date;
    if (log.date.includes("-") && log.date.split("-")[0].length === 4) {
      const [y, m, d] = log.date.split("-");
      dateKey = `${d}-${m}-${y}`;
    }

    // Normalize (remove leading zeros) to be safe
    const normalizedKey = dateKey.split("-").map(Number).join("-");
    dailyCalories[normalizedKey] =
      (dailyCalories[normalizedKey] || 0) + totalCals;
  });

  // Build daily weights from weightLogs
  const dailyWeights: Record<string, number> = {};
  weightLogs.forEach((w) => {
    const normalizedWeightDate = w.date.split("-").map(Number).join("-");
    dailyWeights[normalizedWeightDate] = w.weight;
  });

  // Collect all unique dates from both weightLogs and foodLogs
  const allDates = new Set<string>();
  Object.keys(dailyCalories).forEach((d) => allDates.add(d));
  Object.keys(dailyWeights).forEach((d) => allDates.add(d));

  // Sort dates chronologically
  const sortedDates = Array.from(allDates).sort((a, b) => {
    const [d1, m1, y1] = a.split("-").map(Number);
    const [d2, m2, y2] = b.split("-").map(Number);
    return (
      new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime()
    );
  });

  // Build combined data with forward-filled weights
  let lastKnownWeight: number | null = null;
  const combined = sortedDates.map((date) => {
    const calories = Math.round(dailyCalories[date] || 0);
    const weight = dailyWeights[date] ?? null;

    // Forward-fill weight: use last known weight if current is null
    if (weight !== null) {
      lastKnownWeight = weight;
    }

    // For display, use the date string as-is
    const displayDate = date.split("-").map(Number).join("-");

    return {
      date: displayDate,
      weight: lastKnownWeight,
      calories,
    };
  });

  return combined;
}

export async function getRecentFoods(limit = 20) {
  try {
    const userId = await getUserId();
    if (!userId) return [];
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");

    const foods = await collection
      .find({ userId })
      .sort({ _id: -1 })
      .limit(limit)
      .toArray();

    return JSON.parse(JSON.stringify(foods));
  } catch (error) {
    console.error("Failed to get recent foods", error);
    throw error;
  }
}

export async function getFavoriteFoods() {
  try {
    const userId = await getUserId();
    if (!userId) return [];
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");

    const foods = await collection.find({ isFavorite: true, userId }).toArray();

    return JSON.parse(JSON.stringify(foods));
  } catch (error) {
    console.error("Failed to get favorite foods", error);
    throw error;
  }
}

export async function toggleFavorite(foodId: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");

    const food = await collection.findOne({ _id: new ObjectId(foodId), userId });
    if (!food) throw new Error("Food not found");

    const newFavorite = !food.isFavorite;

    await collection.updateOne(
      { _id: new ObjectId(foodId), userId },
      { $set: { isFavorite: newFavorite } },
    );

    revalidatePath("/foodlogs/[date]");
    revalidatePath("/favs");

    return newFavorite;
  } catch (error) {
    console.error("Failed to toggle favorite", error);
    throw error;
  }
}

export async function parseFoodWithGemini(mealDescription: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

  const prompt = `You are a precise nutrition database. Parse the given meal description into a JSON array of food items.

Each item must have exactly these fields:
- foodName (string): the food name, capitalized
- servingSize (number): amount in grams (estimate 100g if not specified)
- calories (number): total calories for that serving size
- carbs (number): total carbs in grams for that serving size
- protein (number): total protein in grams for that serving size
- fats (number): total fats in grams for that serving size
- per100g (object): nutritional values per 100g with fields: calories, carbs, protein, fats

Use accurate USDA-standard nutritional data. Return ONLY a valid JSON array, no markdown, no code fences, no extra text.

Meal: "${mealDescription}"`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gemini API error:", errText);
    let detail = `Gemini API returned ${res.status}`;
    try {
      const errJson = JSON.parse(errText);
      detail = errJson?.error?.message || detail;
    } catch {}
    throw new Error(detail);
  }

  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new Error("AI returned empty response");

  const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  const parsed = JSON.parse(cleaned);
  if (!Array.isArray(parsed)) throw new Error("AI response was not an array");

  return parsed.map((item: any, i: number) => ({
    id: Date.now() + i.toString(),
    foodName: item.foodName || "Unknown Food",
    servingSize: item.servingSize || 100,
    calories: item.calories || 0,
    carbs: item.carbs || 0,
    protein: item.protein || 0,
    fats: item.fats || 0,
    per100g: item.per100g || undefined,
  }));
}

// Custom Favorites (separate collection)
export async function getCustomFavorites() {
  try {
    const userId = await getUserId();
    if (!userId) return [];
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("favoritefoods");

    const favorites = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return JSON.parse(JSON.stringify(favorites));
  } catch (error) {
    console.error("Failed to get custom favorites", error);
    throw error;
  }
}

export async function createFavorite(food: {
  foodName: string;
  servingSize: number;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  per100g?: {
    calories: number;
    carbs: number;
    protein: number;
    fats: number;
  };
}) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("favoritefoods");

    const doc = {
      ...food,
      userId,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(doc);
    const insertedDocument = await collection.findOne({
      _id: result.insertedId,
    });

    revalidatePath("/favs");
    return JSON.parse(JSON.stringify(insertedDocument));
  } catch (error) {
    console.error("Failed to create favorite", error);
    throw error;
  }
}

export async function updateFavorite(
  foodId: string,
  food: {
    foodName: string;
    servingSize: number;
    calories: number;
    carbs: number;
    protein: number;
    fats: number;
    per100g?: {
      calories: number;
      carbs: number;
      protein: number;
      fats: number;
    };
  },
) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("favoritefoods");

    await collection.updateOne(
      { _id: new ObjectId(foodId), userId },
      { $set: food },
    );

    revalidatePath("/favs");
    return { success: true };
  } catch (error) {
    console.error("Failed to update favorite", error);
    throw error;
  }
}

export async function deleteFavorite(foodId: string) {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");
    
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("favoritefoods");

    const result = await collection.deleteOne({
      _id: new ObjectId(foodId),
      userId,
    });

    revalidatePath("/favs");
    return result.deletedCount;
  } catch (error) {
    console.error("Failed to delete favorite", error);
    throw error;
  }
}

export interface NutritionInsights {
  success: boolean;
  hasData: boolean;
  message?: string;
  period: { days: number; startDate: string; endDate: string };
  summary: {
    totalDays: number;
    activeDays: number;
    loggingRate: number;
    avgCalories: number;
    avgProtein: number;
    avgCarbs: number;
    avgFats: number;
    proteinPct: number;
    carbsPct: number;
    fatsPct: number;
    minCalories: number;
    maxCalories: number;
    stdDev: number;
  };
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  mealBreakdown: {
    meal: string;
    avgCalories: number;
    avgProtein: number;
    avgCarbs: number;
    avgFats: number;
    count: number;
  }[];
  tdee: {
    estimated: number;
    fromWeight: boolean;
    weightChange: number;
    hasWeightData: boolean;
  };
  recommendations: string[];
}

export async function getNutritionInsights(days: number = 30): Promise<NutritionInsights> {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");

    const db = await connectToDatabase("meorfitnesspal");

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1));
    const startDateStr = startDate.toISOString().split("T")[0];
    const endDateStr = endDate.toISOString().split("T")[0];

    const foodLogs = await db.collection("foodlog")
      .find({ userId, date: { $gte: startDateStr, $lte: endDateStr } })
      .sort({ date: -1 })
      .toArray() as any[];

    const weightLogs = await db.collection("weightlog")
      .find({ userId })
      .sort({ date: 1 })
      .toArray() as any[];

    const goalData = await db.collection("goal").findOne({ userId }) as any;

    if (foodLogs.length === 0) {
      return {
        success: true, hasData: false, message: "No food logs found in this period.",
        period: { days, startDate: startDateStr, endDate: endDateStr },
        summary: { totalDays: 0, activeDays: 0, loggingRate: 0, avgCalories: 0, avgProtein: 0, avgCarbs: 0, avgFats: 0, proteinPct: 0, carbsPct: 0, fatsPct: 0, minCalories: 0, maxCalories: 0, stdDev: 0 },
        goals: { calories: goalData?.calories || 0, protein: goalData?.protein || 0, carbs: goalData?.carbs || 0, fats: goalData?.fats || 0 },
        mealBreakdown: [],
        tdee: { estimated: 0, fromWeight: false, weightChange: 0, hasWeightData: weightLogs.length >= 2 },
        recommendations: ["Start logging your meals to get personalized insights!"],
      };
    }

    const dailyData: Record<string, { calories: number; protein: number; carbs: number; fats: number; meals: Set<string>; logCount: number }> = {};
    for (const log of foodLogs) {
      const d = log.date;
      if (!dailyData[d]) dailyData[d] = { calories: 0, protein: 0, carbs: 0, fats: 0, meals: new Set(), logCount: 0 };
      dailyData[d].calories += log.calories || 0;
      dailyData[d].protein += log.protein || 0;
      dailyData[d].carbs += log.carbs || 0;
      dailyData[d].fats += log.fats || 0;
      dailyData[d].meals.add(log.meal);
      dailyData[d].logCount++;
    }

    const mealData: Record<string, { calories: number; protein: number; carbs: number; fats: number; count: number }> = {};
    for (const log of foodLogs) {
      const meal = log.meal || "Etc";
      if (!mealData[meal]) mealData[meal] = { calories: 0, protein: 0, carbs: 0, fats: 0, count: 0 };
      mealData[meal].calories += log.calories || 0;
      mealData[meal].protein += log.protein || 0;
      mealData[meal].carbs += log.carbs || 0;
      mealData[meal].fats += log.fats || 0;
      mealData[meal].count++;
    }

    const dates = Object.keys(dailyData);
    const activeDays = dates.filter(d => dailyData[d].logCount > 0);
    const numActiveDays = activeDays.length;

    const avgCalories = Math.round(activeDays.reduce((s, d) => s + dailyData[d].calories, 0) / numActiveDays);
    const avgProtein = Math.round(activeDays.reduce((s, d) => s + dailyData[d].protein, 0) / numActiveDays);
    const avgCarbs = Math.round(activeDays.reduce((s, d) => s + dailyData[d].carbs, 0) / numActiveDays);
    const avgFats = Math.round(activeDays.reduce((s, d) => s + dailyData[d].fats, 0) / numActiveDays);

    const totalCalFromMacros = avgProtein * 4 + avgCarbs * 4 + avgFats * 9;
    const proteinPct = totalCalFromMacros > 0 ? Math.round((avgProtein * 4 / totalCalFromMacros) * 100) : 0;
    const carbsPct = totalCalFromMacros > 0 ? Math.round((avgCarbs * 4 / totalCalFromMacros) * 100) : 0;
    const fatsPct = totalCalFromMacros > 0 ? Math.round((avgFats * 9 / totalCalFromMacros) * 100) : 0;

    const calorieValues = activeDays.map(d => dailyData[d].calories);
    const mean = calorieValues.reduce((s, v) => s + v, 0) / calorieValues.length;
    const variance = calorieValues.reduce((s, v) => s + (v - mean) ** 2, 0) / calorieValues.length;
    const stdDev = Math.round(Math.sqrt(variance));
    const minCalories = Math.min(...calorieValues);
    const maxCalories = Math.max(...calorieValues);

    const mealAverages = Object.entries(mealData).reduce<
      { meal: string; avgCalories: number; avgProtein: number; avgCarbs: number; avgFats: number; count: number }[]
    >((acc, [meal, data]) => {
      if (data.count > 0) {
        acc.push({
          meal,
          avgCalories: Math.round(data.calories / data.count),
          avgProtein: Math.round(data.protein / data.count),
          avgCarbs: Math.round(data.carbs / data.count),
          avgFats: Math.round(data.fats / data.count),
          count: data.count,
        });
      }
      return acc;
    }, []);

    // TDEE: filter weight logs within period
    const parseWeightDate = (dateStr: string) => {
      const parts = dateStr.split("-");
      if (parts[0].length === 4) return dateStr;
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    };
    const periodWeightLogs = weightLogs.filter((w: any) => {
      const d = parseWeightDate(w.date);
      return d >= startDateStr && d <= endDateStr;
    }).sort((a: any, b: any) => parseWeightDate(a.date).localeCompare(parseWeightDate(b.date)));

    let estimatedTDEE = avgCalories;
    let weightChange = 0;
    let hasWeightData = false;

    if (periodWeightLogs.length >= 2) {
      const firstWeight = periodWeightLogs[0].weight;
      const lastWeight = periodWeightLogs[periodWeightLogs.length - 1].weight;
      weightChange = lastWeight - firstWeight;
      hasWeightData = true;

      const firstDate = new Date(parseWeightDate(periodWeightLogs[0].date));
      const lastDate = new Date(parseWeightDate(periodWeightLogs[periodWeightLogs.length - 1].date));
      const daysSpan = Math.max(1, (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysSpan >= 3) {
        const dailySurplus = (weightChange / daysSpan) * 7700;
        estimatedTDEE = Math.round(avgCalories - dailySurplus);
      }
    }

    const goalCalories = goalData?.calories || 0;
    const goalProtein = goalData?.protein || 0;
    const goalCarbs = goalData?.carbs || 0;
    const goalFats = goalData?.fats || 0;

    // Generate recommendations
    const recommendations: string[] = [];

    if (goalCalories > 0) {
      const diff = avgCalories - goalCalories;
      if (Math.abs(diff) > 100) {
        if (diff > 0) {
          recommendations.push(`You're averaging <strong>${diff.toLocaleString()} kcal/day over</strong> your ${goalCalories.toLocaleString()} kcal goal. Try slightly smaller portions or swapping high-calorie items for lighter alternatives.`);
        } else {
          recommendations.push(`You're averaging <strong>${Math.abs(diff).toLocaleString()} kcal/day under</strong> your ${goalCalories.toLocaleString()} kcal goal. Nice work staying in a deficit!`);
        }
      } else {
        recommendations.push(`Your average of <strong>${avgCalories.toLocaleString()} kcal/day</strong> is right on target with your ${goalCalories.toLocaleString()} kcal goal. Excellent consistency!`);
      }
    }

    const proteinPctCal = totalCalFromMacros > 0 ? (avgProtein * 4 / totalCalFromMacros) * 100 : 0;
    if (proteinPctCal < 15 && numActiveDays >= 3) {
      recommendations.push(`Protein is only <strong>${Math.round(proteinPctCal)}%</strong> of your calories (aim for 15-30%). Add lean meat, eggs, Greek yogurt, or tofu to meals.`);
    } else if (proteinPctCal > 35) {
      recommendations.push(`Protein is <strong>${Math.round(proteinPctCal)}%</strong> of calories — quite high! Ensure you're getting enough carbs for energy and healthy fats.`);
    }
    if (goalProtein > 0 && avgProtein < goalProtein * 0.8 && numActiveDays >= 3) {
      recommendations.push(`You average <strong>${avgProtein}g protein/day</strong> — below your ${goalProtein}g target. Include a protein source in every meal.`);
    }

    const cv = mean > 0 ? (stdDev / mean) * 100 : 0;
    if (cv > 40 && numActiveDays >= 5) {
      recommendations.push(`Your daily intake varies by <strong>±${stdDev} kcal</strong> (${Math.round(cv)}% CV). More consistent eating habits lead to steadier progress.`);
    } else if (cv < 20 && numActiveDays >= 5) {
      recommendations.push(`Great consistency! Daily intake varies by only <strong>±${stdDev} kcal</strong>. This makes adjustments predictable and effective.`);
    }

    if (hasWeightData && Math.abs(weightChange) > 0.2) {
      const direction = weightChange > 0 ? "gained" : "lost";
      const weeklyRate = Math.abs((weightChange / days) * 7);
      recommendations.push(`You <strong>${direction} ${Math.abs(weightChange).toFixed(1)} kg</strong> over ${days} days (~${weeklyRate.toFixed(2)} kg/week). Estimated TDEE: <strong>${estimatedTDEE.toLocaleString()} kcal/day</strong>.`);

      if (weightChange > 0) {
        recommendations.push(`To <strong>maintain</strong>, aim for <strong>${estimatedTDEE.toLocaleString()} kcal/day</strong>. To <strong>lose ~0.5 kg/week</strong>, target <strong>${Math.max(1200, estimatedTDEE - 500).toLocaleString()} kcal/day</strong>.`);
      } else {
        const deficit = Math.round((Math.abs(weightChange) / days) * 7700);
        recommendations.push(`Your estimated TDEE is <strong>${estimatedTDEE.toLocaleString()} kcal/day</strong> with an average <strong>${deficit}-kcal daily deficit</strong>. Ensure you're eating enough to sustain energy levels.`);
      }
    } else if (hasWeightData) {
      recommendations.push(`Your weight has been <strong>stable</strong>. Your estimated maintenance TDEE is <strong>${estimatedTDEE.toLocaleString()} kcal/day</strong>.`);
    } else {
      recommendations.push(`Log your weight regularly to get a personalized TDEE estimate based on your actual data!`);
    }

    if (mealAverages.length > 1) {
      mealAverages.sort((a, b) => b.avgCalories - a.avgCalories);
      const biggestMeal = mealAverages[0];
      const biggestPct = Math.round((biggestMeal.avgCalories / avgCalories) * 100);
      if (biggestPct > 45 && numActiveDays >= 3) {
        recommendations.push(`Your <strong>${biggestMeal.meal}</strong> averages <strong>${biggestPct}%</strong> of daily intake. Spreading calories more evenly can improve energy and satiety.`);
      }
    }

    const mealsLogged = new Set(foodLogs.map((l: any) => l.meal));
    const mNames = ["Breakfast", "Lunch", "Dinner"];
    const missingMeals = mNames.filter(m => !mealsLogged.has(m));
    if (missingMeals.length > 0 && numActiveDays >= 5) {
      recommendations.push(`You often skip <strong>${missingMeals.join(" & ")}</strong>. Even a light meal helps maintain energy and prevents overeating later.`);
    }

    const loggingRate = Math.round((numActiveDays / days) * 100);
    if (loggingRate < 50) {
      recommendations.push(`You logged food on <strong>${loggingRate}%</strong> of days. More consistent logging = better insights!`);
    } else if (loggingRate >= 80) {
      recommendations.push(`<strong>${loggingRate}% logging rate</strong> — your insights are based on solid data!`);
    }

    return {
      success: true,
      hasData: true,
      period: { days, startDate: startDateStr, endDate: endDateStr },
      summary: {
        totalDays: dates.length,
        activeDays: numActiveDays,
        loggingRate,
        avgCalories,
        avgProtein,
        avgCarbs,
        avgFats,
        proteinPct,
        carbsPct,
        fatsPct,
        minCalories,
        maxCalories,
        stdDev,
      },
      goals: { calories: goalCalories, protein: goalProtein, carbs: goalCarbs, fats: goalFats },
      mealBreakdown: mealAverages,
      tdee: { estimated: estimatedTDEE, fromWeight: hasWeightData, weightChange: Math.round(weightChange * 100) / 100, hasWeightData },
      recommendations,
    };
  } catch (error) {
    console.error("Failed to get nutrition insights", error);
    throw error;
  }
}

export async function getDashboardData(date: string) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return {
        foodLog: { logs: [], totalCalories: 0, totalCarbs: 0, totalProtein: 0, totalFats: 0 },
        goal: null,
        weeklyWeightAvg: null,
        prevWeekWeightAvg: null,
        steps: null,
        activeEnergy: null,
        restingEnergy: null,
        streak: { current: 0, personalBest: 0, last7Days: Array.from({ length: 7 }, () => false), nextMilestone: 7, daysUntilNextMilestone: 7 },
        achievements: [],
        newlyUnlockedAchievements: [],
      };
    }

    const { fetchDashboardData } = await import("./lib/dashboard");
    return fetchDashboardData(userId, date);
  } catch (error) {
    console.error("Failed to get dashboard data", error);
    throw error;
  }
}

export async function getCalorieTrendAction(days: number = 14) {
  try {
    const userId = await getUserId();
    if (!userId) {
      const daysList: { date: string; calories: number; protein: number; carbs: number; fats: number }[] = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
        daysList.push({ date: dateStr, calories: 0, protein: 0, carbs: 0, fats: 0 });
      }
      return { days: daysList, goalCalories: 2000 };
    }

    const { getCalorieTrend } = await import("./lib/dashboard");
    return getCalorieTrend(userId, days);
  } catch (error) {
    console.error("Failed to get calorie trend", error);
    throw error;
  }
}

export async function claimExistingData() {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");
    
    const db = await connectToDatabase("meorfitnesspal");
    
    const foodlogCollection = db.collection("foodlog");
    const weightlogCollection = db.collection("weightlog");
    const goalCollection = db.collection("goal");
    
    const [foodlogResult, weightlogResult, goalResult] = await Promise.all([
      foodlogCollection.updateMany(
        { userId: { $exists: false } },
        { $set: { userId } }
      ),
      weightlogCollection.updateMany(
        { userId: { $exists: false } },
        { $set: { userId } }
      ),
      goalCollection.updateMany(
        { userId: { $exists: false } },
        { $set: { userId } }
      ),
    ]);
    
    after(() => {
      console.log(`Claimed ${foodlogResult.modifiedCount} foodlog, ${weightlogResult.modifiedCount} weightlog, ${goalResult.modifiedCount} goal entries`);
    });
    
    return {
      success: true,
      foodlogClaimed: foodlogResult.modifiedCount,
      weightlogClaimed: weightlogResult.modifiedCount,
      goalClaimed: goalResult.modifiedCount,
    };
  } catch (error) {
    console.error("Failed to claim existing data", error);
    throw error;
  }
}
