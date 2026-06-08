import { connectToDatabase } from "./mongodb";
import { checkAndUnlockAchievements, computeStats } from "./achievements";
import type { AchievementState } from "./achievements";

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

export interface FoodLogResponse {
  logs: FoodEntry[];
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFats: number;
}

export interface Goal {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface StreakData {
  current: number
  personalBest: number
  last7Days: boolean[]
  nextMilestone: number
  daysUntilNextMilestone: number
}

export interface DashboardData {
  foodLog: FoodLogResponse;
  goal: Goal | null;
  weeklyWeightAvg: number | null;
  prevWeekWeightAvg: number | null;
  steps: number | null;
  activeEnergy: number | null;
  restingEnergy: number | null;
  streak: StreakData;
  achievements: AchievementState[];
  newlyUnlockedAchievements: string[];
}

export async function fetchDashboardData(
  userId: string,
  date: string,
): Promise<DashboardData> {
  const db = await connectToDatabase("meorfitnesspal");

  const foodCollection = db.collection("foodlog");

  const [foodLogs, goalData, weightLogs, recentDates, stepsEntry, energyEntry] = await Promise.all([
    foodCollection.find({ date, userId }).toArray(),
    db.collection("goal").findOne({ userId }),
    db
      .collection("weightlog")
      .find({ userId })
      .sort({ date: 1 })
      .toArray(),
    foodCollection
      .find({ userId })
      .sort({ date: -1 })
      .limit(100)
      .project({ date: 1, _id: 0 })
      .toArray() as Promise<{ date: string }[]>,
    db.collection("stepslog").findOne({ userId, date }),
    db.collection("energylog").findOne({ userId, date }),
  ]);

  const totals = (foodLogs as any[]).reduce(
    (acc, item) => {
      acc.totalCalories += item.calories || 0;
      acc.totalCarbs += item.carbs || 0;
      acc.totalProtein += item.protein || 0;
      acc.totalFats += item.fats || 0;
      return acc;
    },
    { totalCalories: 0, totalCarbs: 0, totalProtein: 0, totalFats: 0 },
  );

  const foodLog: FoodLogResponse = {
    logs: JSON.parse(JSON.stringify(foodLogs)),
    ...totals,
  };

  const goal: Goal | null = goalData
    ? JSON.parse(JSON.stringify(goalData))
    : null;

  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  let weeklyWeightAvg: number | null = null;
  let prevWeekWeightAvg: number | null = null;

  const parseWeightDate = (dateStr: string) => {
    const parts = dateStr.split("-");
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  };

  const thisWeekEntries = (weightLogs as any[]).filter((w) => {
    const d = parseWeightDate(w.date);
    return d >= oneWeekAgo && d <= now;
  });

  const lastWeekEntries = (weightLogs as any[]).filter((w) => {
    const d = parseWeightDate(w.date);
    return d >= twoWeeksAgo && d < oneWeekAgo;
  });

  if (thisWeekEntries.length > 0) {
    weeklyWeightAvg =
      thisWeekEntries.reduce((sum, w) => sum + (w.weight || 0), 0) /
      thisWeekEntries.length;
  }

  if (lastWeekEntries.length > 0) {
    prevWeekWeightAvg =
      lastWeekEntries.reduce((sum, w) => sum + (w.weight || 0), 0) /
      lastWeekEntries.length;
  }

  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;

  let currentStreak = 0;
  if (recentDates.length > 0) {
    const uniqueDates = new Set(recentDates.map((l) => l.date));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayStr = formatDate(today);
    const yesterdayStr = formatDate(yesterday);

    if (uniqueDates.has(todayStr) || uniqueDates.has(yesterdayStr)) {
      let checkDate = uniqueDates.has(todayStr) ? today : yesterday;
      while (uniqueDates.has(formatDate(checkDate))) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }
  }

  // Personal best streak
  const uniqueDates = new Set(recentDates.map((l) => l.date));
  let personalBest = 0;
  if (uniqueDates.size > 0) {
    const sorted = Array.from(uniqueDates).sort();
    let run = 1;
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        run++;
      } else {
        personalBest = Math.max(personalBest, run);
        run = 1;
      }
    }
    personalBest = Math.max(personalBest, run);
  }

  // Last 7 days activity
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last7Days: boolean[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    last7Days.push(uniqueDates.has(formatDate(d)));
  }

  // Next milestone
  const MILESTONES = [7, 14, 21, 30, 60, 90, 100, 365];
  let nextMilestone = 7;
  for (const m of MILESTONES) {
    if (currentStreak < m) {
      nextMilestone = m;
      break;
    }
  }

  const streak: StreakData = {
    current: currentStreak,
    personalBest: Math.max(personalBest, currentStreak),
    last7Days,
    nextMilestone,
    daysUntilNextMilestone: nextMilestone - currentStreak,
  };

  const stats = await computeStats(userId, currentStreak);
  const { achievements, newlyUnlocked } =
    await checkAndUnlockAchievements(userId, stats);

  return {
    foodLog,
    goal,
    weeklyWeightAvg,
    prevWeekWeightAvg,
    steps: (stepsEntry as any)?.steps ?? null,
    activeEnergy: (energyEntry as any)?.activeEnergy ?? null,
    restingEnergy: (energyEntry as any)?.restingEnergy ?? null,
    streak,
    achievements,
    newlyUnlockedAchievements: newlyUnlocked,
  };
}

export interface CalorieTrendDay {
  date: string
  calories: number
  protein: number
  carbs: number
  fats: number
}

export async function getCalorieTrend(
  userId: string,
  days: number = 14,
): Promise<{
  days: CalorieTrendDay[]
  goalCalories: number
}> {
  const db = await connectToDatabase("meorfitnesspal");

  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);

  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;

  const startStr = formatDate(startDate);
  const endStr = formatDate(endDate);

  const logs = await db
    .collection("foodlog")
    .find({ userId, date: { $gte: startStr, $lte: endStr } })
    .sort({ date: 1 })
    .toArray();

  const goal = await db.collection("goal").findOne({ userId });

  const dayMap = new Map<string, CalorieTrendDay>();

  for (const log of logs as any[]) {
    const existing = dayMap.get(log.date) || {
      date: log.date,
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
    };
    existing.calories += log.calories || 0;
    existing.protein += log.protein || 0;
    existing.carbs += log.carbs || 0;
    existing.fats += log.fats || 0;
    dayMap.set(log.date, existing);
  }

  const daysList: CalorieTrendDay[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = formatDate(d);
    const day = dayMap.get(dateStr);
    daysList.push(
      day || { date: dateStr, calories: 0, protein: 0, carbs: 0, fats: 0 },
    );
  }

  return {
    days: JSON.parse(JSON.stringify(daysList)),
    goalCalories: goal?.calories || 2000,
  };
}
