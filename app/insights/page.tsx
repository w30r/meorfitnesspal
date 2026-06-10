/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getGoalData, getLatestFoodLogs, getNutritionInsights, type NutritionInsights } from "../actions";
import { redirect } from "next/navigation";
import { ChevronLeft, TrendingUp, Target, UtensilsCrossed, BrainCircuit, Scale, AlertTriangle, CheckCircle2 } from "lucide-react";

interface DailyStats {
  date: string;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFats: number;
  logCount: number;
}

const fillMissingDays = (data: DailyStats[], days: number) => {
  const fullData: DailyStats[] = [];
  const now = new Date();
  const dataMap = new Map(data.map((item) => [item.date, item]));
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const existingDay = dataMap.get(dateStr);
    fullData.push(existingDay || { date: dateStr, totalCalories: 0, totalCarbs: 0, totalProtein: 0, totalFats: 0, logCount: 0 });
  }
  return fullData;
};

const PERIODS = [7, 14, 30, 90];

const formatDay = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
};

const getHeatClass = (calories: number, goal: number) => {
  if (calories === 0) return "bg-muted/10 text-muted-foreground/40";
  const ratio = calories / goal;
  if (ratio < 0.3) return "bg-primary/10 text-primary";
  if (ratio < 0.6) return "bg-primary/30 text-primary";
  if (ratio < 0.9) return "bg-primary/60 text-primary-foreground";
  return "bg-primary text-primary-foreground font-black shadow-inner";
};

function MacroBar({ label, value, goal, color, unit }: { label: string; value: number; goal: number; color: string; unit: string }) {
  const pct = goal > 0 ? Math.min(Math.round((value / goal) * 100), 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span>{label}</span>
        <span className="text-muted-foreground">{value}{unit} / {goal > 0 ? `${goal}${unit}` : "—"}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function DonutChart({ protein, carbs, fats }: { protein: number; carbs: number; fats: number }) {
  const total = protein + carbs + fats;
  if (total === 0) return <div className="h-32 flex items-center justify-center text-sm text-muted-foreground">No data</div>;
  const pPct = (protein / total) * 100;
  const cPct = (carbs / total) * 100;
  const fPct = (fats / total) * 100;
  const conicGradient = `conic-gradient(#f43f5e 0% ${pPct}%, #3b82f6 ${pPct}% ${pPct + cPct}%, #f59e0b ${pPct + cPct}% 100%)`;

  return (
    <div className="flex items-center gap-4">
      <div className="h-24 w-24 rounded-full shrink-0" style={{ background: conicGradient }} />
      <div className="space-y-1.5 text-xs font-medium">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
          <span>Protein {Math.round(pPct)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
          <span>Carbs {Math.round(cPct)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          <span>Fats {Math.round(fPct)}%</span>
        </div>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const [foodLogs, setFoodLogs] = useState<DailyStats[]>([]);
  const [days, setDays] = useState(30);
  const [calorieGoal, setCalorieGoal] = useState<number>(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<NutritionInsights | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(true);
  const currentLog = foodLogs?.find((l) => l.date === selectedDay);

  useEffect(() => {
    getGoalData().then((res) => setCalorieGoal(res[0]?.calories || 1499)).catch(() => {});
  }, []);

  const activeDays = foodLogs.filter((d) => d.logCount > 0);
  const avgCalories = activeDays.length
    ? Math.round(activeDays.reduce((acc, curr) => acc + curr.totalCalories, 0) / activeDays.length)
    : 0;

  const handlePeriodChange = (p: number) => {
    if (typeof window !== "undefined" && window.navigator.vibrate) window.navigator.vibrate(10);
    setDays(p);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setInsightsLoading(true);
      const [logsRes, insightRes] = await Promise.all([
        getLatestFoodLogs(days),
        getNutritionInsights(days),
      ]);
      if (logsRes.success && logsRes.data) {
        setFoodLogs(fillMissingDays(logsRes.data as DailyStats[], days));
      } else {
        setFoodLogs([]);
      }
      setInsights(insightRes);
      setLoading(false);
      setInsightsLoading(false);
    };
    fetchData();
  }, [days]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const s = insights?.summary;
  const goals = insights?.goals;
  const tdee = insights?.tdee;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 pb-24">
      <div className="flex flex-col items-center gap-4">
        <Button className="self-start" variant="outline" onClick={() => redirect("/")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="bg-muted p-1 rounded-xl flex w-full max-w-sm">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => handlePeriodChange(p)}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                days === p ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}D
            </button>
          ))}
        </div>
        <div className="text-center animate-in fade-in slide-in-from-top-1">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Average Daily Intake</p>
          <h2 className="text-4xl font-black">
            {avgCalories}{" "}
            <span className="text-sm font-medium text-muted-foreground">kcal</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-10 gap-2">
        {foodLogs.map((item) => {
          const hasData = item.logCount > 0;
          const isSelected = selectedDay === item.date;
          const heatClass = getHeatClass(item.totalCalories, calorieGoal);
          return (
            <button
              key={item.date}
              onClick={() => setSelectedDay(isSelected ? null : item.date)}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl border transition-all active:scale-95 ${heatClass} ${
                isSelected ? "ring-2 ring-ring ring-offset-2 scale-105 z-10" : "border-transparent"
              }`}
            >
              <span className="text-[9px] uppercase opacity-60 font-bold mb-0.5">
                {new Date(item.date).toLocaleDateString("en-US", { day: "numeric" })}
              </span>
              <span className="text-sm font-bold leading-none">{hasData ? Math.round(item.totalCalories) : "—"}</span>
              {hasData && (
                <div className="flex gap-0.5 mt-1">
                  <div className="h-1 w-1 rounded-full bg-current opacity-40" />
                  <div className="h-1 w-1 rounded-full bg-current opacity-40" />
                  <div className="h-1 w-1 rounded-full bg-current opacity-40" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-4 text-[10px] text-muted-foreground self-end">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-sm bg-muted/20" />
          <div className="h-3 w-3 rounded-sm bg-purple-900/30" />
          <div className="h-3 w-3 rounded-sm bg-purple-700/50" />
          <div className="h-3 w-3 rounded-sm bg-purple-500" />
          <div className="h-3 w-3 rounded-sm bg-purple-400" />
        </div>
        <span>More (Goal)</span>
      </div>

      {selectedDay && (
        <div className="fixed bottom-24 sm:max-w-md left-4 right-4 animate-in fade-in slide-in-from-bottom-4 z-50">
          <Card className="p-4 shadow-2xl border-t-4 border-primary bg-card/95 backdrop-blur-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-black text-lg">{formatDay(selectedDay)} Details</h3>
              <button onClick={() => setSelectedDay(null)} className="text-xs text-muted-foreground">Close</button>
            </div>
            {currentLog && (
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-[10px] text-emerald-500 font-bold">CARBS</p>
                  <p className="text-xl font-bold">{Math.round(currentLog.totalCarbs)}g</p>
                </div>
                <div>
                  <p className="text-[10px] text-rose-500 font-bold">PROTEIN</p>
                  <p className="text-xl font-bold">{Math.round(currentLog.totalProtein)}g</p>
                </div>
                <div>
                  <p className="text-[10px] text-amber-500 font-bold">FATS</p>
                  <p className="text-xl font-bold">{Math.round(currentLog.totalFats)}g</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ===== INSIGHTS SECTION ===== */}
      {insightsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : insights?.hasData ? (
        <div className="space-y-4">
          {/* Summary Card */}
          <Card className="p-5 border-2 border-chart-1/20 shadow-lg shadow-chart-1/5 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-chart-1" />
              <h3 className="font-black text-sm uppercase tracking-wider text-chart-1">Daily Average vs Goals</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm font-medium">Calories</span>
                <span className="text-2xl font-black">
                  {s?.avgCalories.toLocaleString()}{" "}
                  <span className="text-sm font-medium text-muted-foreground">/ {goals?.calories?.toLocaleString() || "—"} kcal</span>
                </span>
              </div>
              <MacroBar label="Protein" value={s?.avgProtein || 0} goal={goals?.protein || 0} color="bg-rose-500" unit="g" />
              <MacroBar label="Carbs" value={s?.avgCarbs || 0} goal={goals?.carbs || 0} color="bg-blue-500" unit="g" />
              <MacroBar label="Fats" value={s?.avgFats || 0} goal={goals?.fats || 0} color="bg-amber-500" unit="g" />
            </div>
          </Card>

          {/* Macro Distribution Card */}
          <Card className="p-5 border-2 border-chart-2/20 shadow-lg shadow-chart-2/5 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-chart-2" />
              <h3 className="font-black text-sm uppercase tracking-wider text-chart-2">Macro Split</h3>
            </div>
            <DonutChart protein={s?.avgProtein || 0} carbs={s?.avgCarbs || 0} fats={s?.avgFats || 0} />
            <div className="grid grid-cols-3 gap-3 mt-4 text-center text-xs">
              <div className="bg-rose-500/10 rounded-xl p-2">
                <p className="font-bold text-rose-500">{s?.proteinPct || 0}%</p>
                <p className="text-muted-foreground mt-0.5">{s?.avgProtein || 0}g Protein</p>
              </div>
              <div className="bg-blue-500/10 rounded-xl p-2">
                <p className="font-bold text-blue-500">{s?.carbsPct || 0}%</p>
                <p className="text-muted-foreground mt-0.5">{s?.avgCarbs || 0}g Carbs</p>
              </div>
              <div className="bg-amber-500/10 rounded-xl p-2">
                <p className="font-bold text-amber-500">{s?.fatsPct || 0}%</p>
                <p className="text-muted-foreground mt-0.5">{s?.avgFats || 0}g Fats</p>
              </div>
            </div>
          </Card>

          {/* Per-Meal Breakdown Card */}
          {insights.mealBreakdown.length > 0 && (
            <Card className="p-5 border-2 border-chart-4/20 shadow-lg shadow-chart-4/5 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <UtensilsCrossed className="h-5 w-5 text-chart-4" />
                <h3 className="font-black text-sm uppercase tracking-wider text-chart-4">Per-Meal Averages</h3>
              </div>
              <div className="space-y-3">
                {insights.mealBreakdown.map((m) => (
                  <div key={m.meal} className="flex items-center justify-between bg-chart-4/5 rounded-xl p-3">
                    <div>
                      <p className="font-bold text-sm">{m.meal}</p>
                      <p className="text-[10px] text-muted-foreground">{m.count}x logged</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg">{m.avgCalories}</p>
                      <p className="text-[10px] text-muted-foreground">
                        P{m.avgProtein} · C{m.avgCarbs} · F{m.avgFats}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TDEE Card */}
          {tdee && (
            <Card className="p-5 border-2 border-chart-5/20 shadow-lg shadow-chart-5/5 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Scale className="h-5 w-5 text-chart-5" />
                <h3 className="font-black text-sm uppercase tracking-wider text-chart-5">Estimated TDEE</h3>
              </div>
              <div className="text-center py-2">
                <p className="text-4xl font-black text-chart-5">{tdee.estimated.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">kcal/day estimated maintenance</p>
              </div>
              {tdee.hasWeightData && (
                <div className="flex justify-center gap-4 mt-3 text-xs font-medium">
                  <div className="bg-chart-5/10 rounded-xl px-3 py-2 text-center">
                    <p className={tdee.weightChange > 0 ? "text-red-500" : "text-green-500"}>
                      {tdee.weightChange > 0 ? "+" : ""}{tdee.weightChange.toFixed(1)} kg
                    </p>
                    <p className="text-muted-foreground">weight change</p>
                  </div>
                  <div className="bg-chart-5/10 rounded-xl px-3 py-2 text-center">
                    <p className="font-bold">{s?.loggingRate || 0}%</p>
                    <p className="text-muted-foreground">logging rate</p>
                  </div>
                  <div className="bg-chart-5/10 rounded-xl px-3 py-2 text-center">
                    <p className="font-bold">{s?.activeDays || 0}/{s?.totalDays || 0}</p>
                    <p className="text-muted-foreground">days logged</p>
                  </div>
                </div>
              )}
              {!tdee.hasWeightData && (
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Log your weight to get an even more accurate TDEE estimate.
                </p>
              )}
            </Card>
          )}

          {/* Recommendations Card */}
          {insights.recommendations.length > 0 && (
            <Card className="p-5 border-2 border-chart-3/20 shadow-lg shadow-chart-3/5 rounded-2xl">
              <div className="flex items-center gap-2 mb-4">
                <BrainCircuit className="h-5 w-5 text-chart-3" />
                <h3 className="font-black text-sm uppercase tracking-wider text-chart-3">
                  Recommendations
                  <span className="ml-2 text-[10px] font-medium text-muted-foreground lowercase">({insights.recommendations.length})</span>
                </h3>
              </div>
              <div className="space-y-2">
                {insights.recommendations.map((rec, i) => (
                  <div key={i} className="flex gap-3 bg-chart-3/5 rounded-xl p-3 text-sm leading-relaxed">
                    {rec.includes("Great") || rec.includes("Nice") || rec.includes("Excellent") ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-2xl">
          <p className="font-medium">{insights?.message || "No data for this period."}</p>
          <p className="text-xs mt-1">Log some meals and come back for personalized insights!</p>
        </Card>
      )}
    </div>
  );
}
