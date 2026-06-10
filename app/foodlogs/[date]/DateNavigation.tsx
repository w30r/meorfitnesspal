"use client";

import { Button } from "@/components/ui/button"; // Adjust paths as needed
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

function addOneDay(d: string) {
  const date = new Date(d);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

function minusOneDay(d: string) {
  const date = new Date(d);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split("T")[0];
}

export default function DateNavigation({ date }: { date: string }) {
  const router = useRouter();

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
