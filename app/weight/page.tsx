"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PlusCircle, Scale, TrendingDown, TrendingUp } from "lucide-react";
import WeightGraph from "./WeightGraph";
import { getCombinedWeightAndCals } from "../actions";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface WeightEntry {
  _id: string;
  weight: number;
  date: string;
}

interface WeeklyData {
  weekStart: string;
  weekEnd: string;
  avgWeight: number;
  entries: number;
}

export default function WeightPage() {
  const [data, setData] = useState<WeightEntry[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [windowSize, setWindowSize] = useState(14);
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");

  useEffect(() => {
    const fetchThem = async () => {
      const data = await getCombinedWeightAndCals();
      setData(data as unknown as WeightEntry[]);
    };
    fetchThem();
  }, []);

  const getFilteredData = () => {
    if (data.length === 0) return [];
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() - weekOffset * 7);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - windowSize + 1);

    return data.filter((entry) => {
      const parts = entry.date.split("-");
      const entryDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  const getWeeklyData = (): WeeklyData[] => {
    if (data.length === 0) return [];
    
    const weeks: WeeklyData[] = [];
    const sortedData = [...data].sort((a, b) => {
      const pa = a.date.split("-");
      const pb = b.date.split("-");
      const dateA = new Date(Number(pa[2]), Number(pa[1]) - 1, Number(pa[0]));
      const dateB = new Date(Number(pb[2]), Number(pb[1]) - 1, Number(pb[0]));
      return dateA.getTime() - dateB.getTime();
    });

    const p0 = sortedData[0].date.split("-");
    let currentWeekStart = new Date(Number(p0[2]), Number(p0[1]) - 1, Number(p0[0]));
    let currentWeekEntries: number[] = [sortedData[0].weight];
    
    for (let i = 1; i < sortedData.length; i++) {
      const pi = sortedData[i].date.split("-");
      const entryDate = new Date(Number(pi[2]), Number(pi[1]) - 1, Number(pi[0]));
      const daysDiff = Math.floor((entryDate.getTime() - currentWeekStart.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff < 7) {
        currentWeekEntries.push(sortedData[i].weight);
      } else {
        weeks.push({
          weekStart: currentWeekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          weekEnd: new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          avgWeight: currentWeekEntries.reduce((a, b) => a + b, 0) / currentWeekEntries.length,
          entries: currentWeekEntries.length,
        });
        
        currentWeekStart = entryDate;
        currentWeekEntries = [sortedData[i].weight];
      }
    }
    
    if (currentWeekEntries.length > 0) {
      weeks.push({
        weekStart: currentWeekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        weekEnd: new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        avgWeight: currentWeekEntries.reduce((a, b) => a + b, 0) / currentWeekEntries.length,
        entries: currentWeekEntries.length,
      });
    }

    return weeks.reverse();
  };

  const getPastWeekAverage = () => {
    if (data.length === 0) return null;
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const pastWeekEntries = data.filter((entry) => {
      const parts = entry.date.split("-");
      const entryDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      return entryDate >= weekAgo && entryDate <= today;
    });

    if (pastWeekEntries.length === 0) return null;
    const sum = pastWeekEntries.reduce((acc, entry) => acc + entry.weight, 0);
    return (sum / pastWeekEntries.length);
  };

  const getPrevWeekAverage = () => {
    if (data.length === 0) return null;
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const prevWeekEntries = data.filter((entry) => {
      const parts = entry.date.split("-");
      const entryDate = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      return entryDate >= twoWeeksAgo && entryDate < weekAgo;
    });

    if (prevWeekEntries.length === 0) return null;
    const sum = prevWeekEntries.reduce((acc, entry) => acc + entry.weight, 0);
    return (sum / prevWeekEntries.length);
  };

  const handlePrevWeek = () => setWeekOffset((prev) => prev + 1);
  const handleNextWeek = () => setWeekOffset((prev) => (prev > 0 ? prev - 1 : 0));
  const handleWindowSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWindowSize(Number(e.target.value));
  };

  const filteredData = getFilteredData();
  const weeklyData = getWeeklyData();
  const pastWeekAvg = getPastWeekAverage();
  const prevWeekAvg = getPrevWeekAverage();
  const weightTrend = pastWeekAvg && prevWeekAvg ? pastWeekAvg - prevWeekAvg : null;

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <div className="mb-4">
        <Button variant="outline" size="sm" onClick={() => redirect("/")}>
          <ChevronLeft />
        </Button>
      </div>
      <header className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <Scale size={32} />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Weight Journey</h1>
          <p className="text-muted-foreground text-sm">
            Tracking your progress over time
          </p>
        </div>
        <Link href="/logweight">
          <Button size="icon" variant="outline">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </Link>
      </header>

      {/* View Mode Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setViewMode("daily")}
          className={cn(
            "flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all",
            viewMode === "daily"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Daily
        </button>
        <button
          onClick={() => setViewMode("weekly")}
          className={cn(
            "flex-1 py-2 px-4 rounded-xl text-sm font-bold transition-all",
            viewMode === "weekly"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:text-foreground"
          )}
        >
          Weekly
        </button>
      </div>

      {viewMode === "daily" ? (
        <>
          {/* The Graph Card - Daily View */}
          <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handlePrevWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs font-medium text-muted-foreground">
                  {weekOffset === 0 ? "Current" : `${weekOffset * 7}d ago`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextWeek}
                  disabled={weekOffset === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <select
                value={windowSize}
                onChange={handleWindowSizeChange}
                className="h-7 text-xs w-20 px-2 rounded-md border bg-background"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={21}>21 days</option>
                <option value={28}>28 days</option>
              </select>
            </div>
            {filteredData.length > 0 ? (
              <WeightGraph data={filteredData} />
            ) : (
              <div className="flex h-75 items-center justify-center text-muted-foreground">
                No data for this period.
              </div>
            )}
          </div>

          {/* Stats Summary - Daily View */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-2xl border border-border bg-muted/20">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Latest
              </p>
              <p className="text-2xl font-bold">
                {data[data.length - 1]?.weight || "--"} kg
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-muted/20">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                7-Day Avg
              </p>
              <p className="text-2xl font-bold">
                {pastWeekAvg ? `${pastWeekAvg.toFixed(1)} kg` : "--"}
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-muted/20">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Entries
              </p>
              <p className="text-2xl font-bold">{data.length}</p>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-muted/20">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Trend
              </p>
              {weightTrend !== null ? (
                <div className={cn(
                  "flex items-center gap-1 text-xl font-bold",
                  weightTrend < 0 ? "text-green-500" : "text-red-500"
                )}>
                  {weightTrend < 0 ? <TrendingDown className="h-5 w-5" /> : <TrendingUp className="h-5 w-5" />}
                  {Math.abs(weightTrend).toFixed(1)} kg
                </div>
              ) : (
                <p className="text-2xl font-bold">--</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Weekly View */}
          <div className="rounded-3xl border border-border bg-card p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Week-by-Week Average
            </h3>
            <div className="space-y-3">
              {weeklyData.length > 0 ? (
                weeklyData.map((week, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl",
                      idx === 0 ? "bg-primary/10 border border-primary/30" : "bg-muted/20"
                    )}
                  >
                    <div>
                      <p className="text-sm font-bold">
                        {week.weekStart} - {week.weekEnd}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {week.entries} {week.entries === 1 ? "entry" : "entries"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black">{week.avgWeight.toFixed(1)}</p>
                      <p className="text-xs text-muted-foreground">kg avg</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No data available</p>
              )}
            </div>
          </div>

          {/* Weekly Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-2xl border border-border bg-muted/20">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                This Week
              </p>
              <p className="text-2xl font-bold">
                {weeklyData[0]?.avgWeight.toFixed(1) || "--"} kg
              </p>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-muted/20">
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Last Week
              </p>
              <p className="text-2xl font-bold">
                {weeklyData[1]?.avgWeight.toFixed(1) || "--"} kg
              </p>
            </div>
            {weeklyData[0] && weeklyData[1] && (
              <div className="col-span-2 p-4 rounded-2xl border border-border bg-muted/20">
                <p className="text-xs text-muted-foreground uppercase font-semibold">
                  Weekly Change
                </p>
                <div className={cn(
                  "flex items-center gap-2 mt-1",
                  weeklyData[0].avgWeight < weeklyData[1].avgWeight ? "text-green-500" : "text-red-500"
                )}>
                  {weeklyData[0].avgWeight < weeklyData[1].avgWeight ? (
                    <TrendingDown className="h-5 w-5" />
                  ) : (
                    <TrendingUp className="h-5 w-5" />
                  )}
                  <span className="text-2xl font-bold">
                    {Math.abs(weeklyData[0].avgWeight - weeklyData[1].avgWeight).toFixed(1)} kg
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}