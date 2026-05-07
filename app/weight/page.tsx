"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight, PlusCircle, Scale } from "lucide-react";
import WeightGraph from "./WeightGraph";
import { getCombinedWeightAndCals } from "../actions";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";

interface WeightEntry {
  _id: string;
  weight: number;
  date: string;
}

export default function WeightPage() {
  // const data = getCombinedWeightAndCals();
  const [data, setData] = useState<WeightEntry[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [windowSize, setWindowSize] = useState(7);

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
      const entryDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      return entryDate >= startDate && entryDate <= endDate;
    });
  };

  const getPastWeekAverage = () => {
    if (data.length === 0) return null;
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const pastWeekEntries = data.filter((entry) => {
      const parts = entry.date.split("-");
      const entryDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      return entryDate >= weekAgo && entryDate <= today;
    });

    if (pastWeekEntries.length === 0) return null;
    const sum = pastWeekEntries.reduce((acc, entry) => acc + entry.weight, 0);
    return (sum / pastWeekEntries.length).toFixed(2);
  };

  const getPastTwoWeeksAverage = () => {
    if (data.length === 0) return null;
    const today = new Date();
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 8);

    const pastTwoWeeksEntries = data.filter((entry) => {
      const parts = entry.date.split("-");
      const entryDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      return entryDate >= twoWeeksAgo && entryDate < weekAgo;
    });

    if (pastTwoWeeksEntries.length === 0) return null;
    const sum = pastTwoWeeksEntries.reduce(
      (acc, entry) => acc + entry.weight,
      0,
    );
    return (sum / pastTwoWeeksEntries.length).toFixed(2);
  };

  const handlePrevWeek = () => setWeekOffset((prev) => prev + 1);
  const handleNextWeek = () =>
    setWeekOffset((prev) => (prev > 0 ? prev - 1 : 0));
  const handleWindowSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWindowSize(Number(e.target.value));
  };

  const filteredData = getFilteredData();
  const pastWeekAvg = getPastWeekAverage();
  const pastTwoWeeksAvg = getPastTwoWeeksAverage();

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4 ">
      <div className="mb-4 ">
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

      {/* The Graph Card */}
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
          <NativeSelect
            value={windowSize}
            onChange={handleWindowSizeChange}
            className="h-7 text-xs w-20"
          >
            <NativeSelectOption value={7}>7 days</NativeSelectOption>
            <NativeSelectOption value={14}>14 days</NativeSelectOption>
            <NativeSelectOption value={21}>21 days</NativeSelectOption>
            <NativeSelectOption value={28}>28 days</NativeSelectOption>
          </NativeSelect>
        </div>
        {filteredData.length > 0 ? (
          <WeightGraph data={filteredData} />
        ) : (
          <div className="flex h-75 items-center justify-center text-muted-foreground">
            No data for this period.
          </div>
        )}
      </div>

      {/* Stats Summary could go here */}
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
            {pastWeekAvg ? `${pastWeekAvg} kg` : "--"}
          </p>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-muted/20">
          <p className="text-xs text-muted-foreground uppercase font-semibold">
            14-Day Avg
          </p>
          <p className="text-2xl font-bold">
            {pastTwoWeeksAvg ? `${pastTwoWeeksAvg} kg` : "--"}
          </p>
        </div>
        <div className="p-4 rounded-2xl border border-border bg-muted/20">
          <p className="text-xs text-muted-foreground uppercase font-semibold">
            Entries
          </p>
          <p className="text-2xl font-bold">{data.length}</p>
        </div>
      </div>
    </div>
  );
}
