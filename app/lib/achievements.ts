import { connectToDatabase } from "./mongodb";

export interface AchievementState {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: number | null
  progress: number
  progressTarget: number
  currentValue: number
}

interface AchievementStats {
  totalLogs: number
  currentStreak: number
  totalDaysLogged: number
  totalWeights: number
  breakfastCount: number
}

interface AchievementDef {
  id: string
  name: string
  description: string
  icon: string
  progressTarget: number
  value: (stats: AchievementStats) => number
  unlockedIf: (stats: AchievementStats) => boolean
}

const DEFINITIONS: AchievementDef[] = [
  {
    id: "first_log",
    name: "First Bite",
    description: "Log your very first meal",
    icon: "🍽️",
    progressTarget: 1,
    value: (s) => s.totalLogs,
    unlockedIf: (s) => s.totalLogs >= 1,
  },
  {
    id: "ten_meals",
    name: "Getting Started",
    description: "Log 10 meals",
    icon: "📋",
    progressTarget: 10,
    value: (s) => s.totalLogs,
    unlockedIf: (s) => s.totalLogs >= 10,
  },
  {
    id: "fifty_meals",
    name: "Half Century",
    description: "Log 50 meals",
    icon: "📊",
    progressTarget: 50,
    value: (s) => s.totalLogs,
    unlockedIf: (s) => s.totalLogs >= 50,
  },
  {
    id: "streak_7",
    name: "On a Roll",
    description: "7-day logging streak",
    icon: "🔥",
    progressTarget: 7,
    value: (s) => s.currentStreak,
    unlockedIf: (s) => s.currentStreak >= 7,
  },
  {
    id: "streak_30",
    name: "Unstoppable",
    description: "30-day logging streak",
    icon: "💪",
    progressTarget: 30,
    value: (s) => s.currentStreak,
    unlockedIf: (s) => s.currentStreak >= 30,
  },
  {
    id: "weight_warrior",
    name: "Weight Warrior",
    description: "Log your first weight entry",
    icon: "⚖️",
    progressTarget: 1,
    value: (s) => s.totalWeights,
    unlockedIf: (s) => s.totalWeights >= 1,
  },
  {
    id: "dedicated",
    name: "Dedicated",
    description: "Log food on 100 different days",
    icon: "⭐",
    progressTarget: 100,
    value: (s) => s.totalDaysLogged,
    unlockedIf: (s) => s.totalDaysLogged >= 100,
  },
  {
    id: "early_bird",
    name: "Early Bird",
    description: "Log breakfast 5 times",
    icon: "🌅",
    progressTarget: 5,
    value: (s) => s.breakfastCount,
    unlockedIf: (s) => s.breakfastCount >= 5,
  },
]

export async function computeStats(
  userId: string,
  currentStreak: number,
): Promise<AchievementStats> {
  const db = await connectToDatabase("meorfitnesspal")

  const [totalLogs, totalWeights, breakfastCount, uniqueDates] =
    await Promise.all([
      db.collection("foodlog").countDocuments({ userId }),
      db.collection("weightlog").countDocuments({ userId }),
      db.collection("foodlog").countDocuments({ userId, meal: "Breakfast" }),
      db
        .collection("foodlog")
        .distinct("date", { userId }) as Promise<string[]>,
    ])

  return {
    totalLogs,
    currentStreak,
    totalDaysLogged: uniqueDates.length,
    totalWeights,
    breakfastCount,
  }
}

export async function checkAndUnlockAchievements(
  userId: string,
  stats: AchievementStats,
): Promise<{ achievements: AchievementState[], newlyUnlocked: string[] }> {
  const db = await connectToDatabase("meorfitnesspal")
  const collection = db.collection("achievements")

  const doc = await collection.findOne({ userId })
  const stored = (doc?.achievements as Record<string, AchievementState>) ?? {}
  const now = Date.now()

  const newlyUnlocked: string[] = []
  const updated: Record<string, AchievementState> = {}

  for (const def of DEFINITIONS) {
    const currentValue = def.value(stats)
    const progress = Math.min(
      100,
      Math.round((currentValue / def.progressTarget) * 100),
    )
    const wasUnlocked = stored[def.id]?.unlockedAt != null
    const shouldUnlock = def.unlockedIf(stats)
    const unlockedAt = wasUnlocked
      ? stored[def.id].unlockedAt
      : shouldUnlock
        ? now
        : null

    if (!wasUnlocked && shouldUnlock) {
      newlyUnlocked.push(def.id)
    }

    updated[def.id] = {
      id: def.id,
      name: def.name,
      description: def.description,
      icon: def.icon,
      unlockedAt,
      progress: shouldUnlock ? 100 : progress,
      progressTarget: def.progressTarget,
      currentValue,
    }
  }

  await collection.updateOne(
    { userId },
    {
      $set: {
        userId,
        achievements: updated,
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  )

  return {
    achievements: Object.values(updated),
    newlyUnlocked,
  }
}

export async function getAchievements(
  userId: string,
): Promise<AchievementState[]> {
  const db = await connectToDatabase("meorfitnesspal")
  const doc = await db.collection("achievements").findOne({ userId })
  if (!doc?.achievements) return []
  return Object.values(doc.achievements as Record<string, AchievementState>)
}
