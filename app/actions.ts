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
    revalidatePath("/food-logs/[date]", "page");

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
