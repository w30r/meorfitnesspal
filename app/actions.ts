"use server";

import { ObjectId } from "mongodb";
import { connectToDatabase } from "./lib/mongodb";
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
}

export async function saveFoodLog(foodLog: FormData) {
  try {
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");
    const result = await collection.insertOne(foodLog);
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
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");
    const foodLogs = await collection.find({}).toArray();
    return JSON.parse(JSON.stringify(foodLogs));
  } catch (error) {
    console.error("Failed to get food logs", error);
    throw error;
  }
}

// get total calories by date
export async function getTotalCaloriesByDate(date: string) {
  try {
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");
    const totalCalories = await collection
      .aggregate([
        { $match: { date: date } },
        { $group: { _id: "$date", totalCalories: { $sum: "$calories" } } },
      ])
      .toArray();
    return JSON.parse(JSON.stringify(totalCalories));
  } catch (error) {
    return [{ _id: "takde", totalCalories: 1, status: "none" }];
  }
}

// get total protein by date
export async function getTotalProteinByDate(date: string) {
  try {
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");
    const totalProtein = await collection
      .aggregate([
        { $match: { date: date } },
        { $group: { _id: "$date", totalProtein: { $sum: "$protein" } } },
      ])
      .toArray();
    console.log("Total Protein Data:", totalProtein); // Add logging here
    return JSON.parse(JSON.stringify(totalProtein));
  } catch (error) {
    console.error("Failed to get total protein by date", error);
    return [{ _id: "takde", totalProtein: 1, status: "none" }];
  }
}

// get total carbs by date
export async function getTotalCarbsByDate(date: string) {
  try {
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");
    const totalCarbs = await collection
      .aggregate([
        { $match: { date: date } },
        { $group: { _id: "$date", totalCarbs: { $sum: "$carbs" } } },
      ])
      .toArray();
    console.log("Total Carbs Data:", totalCarbs); // Add logging here
    return JSON.parse(JSON.stringify(totalCarbs));
  } catch (error) {
    console.error("Failed to get total carbs by date", error);
    return [{ _id: "takde", totalCarbs: 1, status: "none" }];
  }
}

// get total fats by date
export async function getTotalFatsByDate(date: string) {
  try {
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");
    const totalFats = await collection
      .aggregate([
        { $match: { date: date } },
        { $group: { _id: "$date", totalFats: { $sum: "$fats" } } },
      ])
      .toArray();
    console.log("Total Fats Data:", totalFats); // Add logging here
    return JSON.parse(JSON.stringify(totalFats));
  } catch (error) {
    console.error("Failed to get total fats by date", error);
    return [{ _id: "takde", totalFats: 1, status: "none" }];
  }
}

// get goal data
export async function getGoalData() {
  try {
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("goal");
    const goalData = await collection.find({}).toArray();
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
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("goal");
    const result = await collection.updateOne(
      {},
      { $set: { calories, protein, carbs, fats } },
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
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");
    const today = new Date().toISOString().split("T")[0];
    const foodLog = await collection.find({ date: today }).toArray();
    return JSON.parse(JSON.stringify(foodLog));
  } catch (error) {
    console.error("Failed to get today's food log", error);
    throw error;
  }
}

export async function getFoodLogbyDate(date: string) {
  try {
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");

    // 1. Fetch the logs
    const foodLog = await collection.find({ date: date }).toArray();

    // 2. Calculate totals using reduce
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

    // 3. Return both the logs and the totals
    return {
      logs: JSON.parse(JSON.stringify(foodLog)),
      ...totals,
    };
  } catch (error) {
    console.error("Failed to get food log by date", error);
    throw error;
  }
}

// delete meal by ID
export async function deleteMealById(mealId: string) {
  try {
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");

    const result = await collection.deleteOne({ _id: new ObjectId(mealId) });

    // This clears the cache and fetches fresh data for the food logs page
    revalidatePath("/foodlogs/[date]", "page");

    return result.deletedCount;
  } catch (error) {
    console.error("Failed to delete meal by ID", error);
    throw error;
  }
}

// last x number of food logs
export async function getLatestFoodLogs(days: number) {
  try {
    const db = await connectToDatabase("meorfitnesspal");

    // 1. Calculate the date threshold
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (days - 1)); // -1 to include today
    const startDateString = startDate.toISOString().split("T")[0];

    // 2. Aggregate data
    const stats = await db
      .collection("foodlog")
      .aggregate([
        {
          // Filter logs within our day range
          $match: {
            date: { $gte: startDateString },
          },
        },
        {
          // Group by date and sum the macros
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
          // Order by most recent date first
          $sort: { _id: -1 },
        },
        {
          // Format the output for the frontend
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
    // Log the actual error on your server console for debugging
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
    const db = await connectToDatabase("meorfitnesspal");
    const logs = await db
      .collection("weightlog")
      .find({})
      .sort({ date: 1 }) // Sort ascending so the graph flows left-to-right
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
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("weightlog");

    // Use updateOne with upsert: true so it updates if date exists, else creates new
    await collection.updateOne(
      { date: date },
      { $set: { weight: weight, date: date } },
      { upsert: true },
    );

    revalidatePath("/weight"); // Assuming your new page is at /weight
    return { success: true };
  } catch (error) {
    console.error("Failed to log weight:", error);
    throw new Error("Failed to save weight entry.");
  }
}

// 3. Delete a weight log
export async function deleteWeightById(id: string) {
  try {
    const db = await connectToDatabase("meorfitnesspal");
    const result = await db
      .collection("weightlog")
      .deleteOne({ _id: new ObjectId(id) });

    revalidatePath("/weight");
    return result.deletedCount;
  } catch (error) {
    console.error("Failed to delete weight log:", error);
    throw error;
  }
}

export async function getCombinedWeightAndCals() {
  const db = await connectToDatabase("meorfitnesspal");

  const weightLogs = await db.collection("weightlog").find().toArray();
  const foodLogs = await db.collection("foodlog").find().toArray();

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
    return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
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
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");
    
    const foods = await collection
      .find({})
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
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");
    
    const foods = await collection
      .find({ isFavorite: true })
      .toArray();
    
    return JSON.parse(JSON.stringify(foods));
  } catch (error) {
    console.error("Failed to get favorite foods", error);
    throw error;
  }
}

export async function toggleFavorite(foodId: string) {
  try {
    const db = await connectToDatabase("meorfitnesspal");
    const collection = db.collection("foodlog");
    
    const food = await collection.findOne({ _id: new ObjectId(foodId) });
    if (!food) throw new Error("Food not found");
    
    const newFavorite = !food.isFavorite;
    
    await collection.updateOne(
      { _id: new ObjectId(foodId) },
      { $set: { isFavorite: newFavorite } }
    );
    
    return newFavorite;
  } catch (error) {
    console.error("Failed to toggle favorite", error);
    throw error;
  }
}
