"use server";

import { ObjectId } from "mongodb";
import { connectToDatabase } from "./lib/mongodb";
import { getUserId } from "./lib/session";
import { revalidatePath } from "next/cache";

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

  const weightLogs = await db.collection("weightlog").find({ userId }).toArray();
  const foodLogs = await db.collection("foodlog").find({ userId }).toArray();

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

export async function claimExistingData() {
  try {
    const userId = await getUserId();
    if (!userId) throw new Error("Not authenticated");
    
    const db = await connectToDatabase("meorfitnesspal");
    
    const foodlogCollection = db.collection("foodlog");
    const weightlogCollection = db.collection("weightlog");
    const goalCollection = db.collection("goal");
    
    const foodlogResult = await foodlogCollection.updateMany(
      { userId: { $exists: false } },
      { $set: { userId } }
    );
    
    const weightlogResult = await weightlogCollection.updateMany(
      { userId: { $exists: false } },
      { $set: { userId } }
    );
    
    const goalResult = await goalCollection.updateMany(
      { userId: { $exists: false } },
      { $set: { userId } }
    );
    
    console.log(`Claimed ${foodlogResult.modifiedCount} foodlog, ${weightlogResult.modifiedCount} weightlog, ${goalResult.modifiedCount} goal entries`);
    
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
