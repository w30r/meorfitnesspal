"use client";
import { ChevronLeft, Scale } from "lucide-react";
import WeightGraph from "./WeightGraph";
import { getCombinedWeightAndCals } from "../actions";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

interface WeightEntry {
  _id: string;
  weight: number;
  date: string;
}

export default function WeightPage() {
  // const data = getCombinedWeightAndCals();
  const [data, setData] = useState<WeightEntry[]>([]);
  useEffect(() => {
    const fetchThem = async () => {
      const data = await getCombinedWeightAndCals();
      setData(data as unknown as WeightEntry[]);
    };
    fetchThem();
  }, []);

  return (
    <div className="container max-w-4xl py-10 px-4">
      <div className="mb-4 ">
        <Button variant="outline" size="sm" onClick={() => redirect("/")}>
          <ChevronLeft />
        </Button>
      </div>
      <header className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-primary/10 text-primary">
          <Scale size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Weight Journey</h1>
          <p className="text-muted-foreground text-sm">
            Tracking your progress over time
          </p>
        </div>
      </header>

      {/* The Graph Card */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        {data.length > 0 ? (
          <WeightGraph data={data} />
        ) : (
          <div className="flex h-75 items-center justify-center text-muted-foreground">
            No weight logs found. Start by adding your weight.
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
            Entries
          </p>
          <p className="text-2xl font-bold">{data.length}</p>
        </div>
      </div>
    </div>
  );
}
