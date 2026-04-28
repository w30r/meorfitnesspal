"use client";

import { Button } from "@/components/ui/button"; // Adjust paths as needed
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DateNavigation({ date }: { date: string }) {
  const router = useRouter();

  // Utility functions (assuming you have these or can define them here)

  function addOneDay(d: string) {
    // Create a new Date object from the input string
    const date = new Date(d);

    // Add 1 day to the current date
    date.setDate(date.getDate() + 1);

    // Format back to YYYY-MM-DD
    return date.toISOString().split("T")[0];
  }

  function minusOneDay(d: string) {
    // Create a new Date object from the input string
    const date = new Date(d);

    // Subtract 1 day from the current date
    date.setDate(date.getDate() - 1);

    // Format back to YYYY-MM-DD
    return date.toISOString().split("T")[0];
  }

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        onClick={() => router.push(`/foodlogs/${minusOneDay(date)}`)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        onClick={() => router.push(`/foodlogs/${addOneDay(date)}`)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
