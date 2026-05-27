"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function CalorieCardSkeleton() {
  return (
    <section className="bg-card border border-border rounded-[2.5rem] p-4 shadow-sm">
      <div className="flex flex-col items-center text-center space-y-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-12 w-40" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
      </div>
    </section>
  );
}

export function MacroCardSkeleton() {
  return (
    <section className="bg-card border border-border rounded-[2.5rem] p-4 shadow-sm">
      <div className="flex justify-around py-4">
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </section>
  );
}

export function MiniCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-[2.5rem] p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-8 w-20 mt-2" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-4 space-y-3">
      <MiniCardSkeleton />
      <MiniCardSkeleton />
      <CalorieCardSkeleton />
      <MacroCardSkeleton />
      <div className="h-20" />
    </div>
  );
}
