"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonProps {
  className?: string;
}

export function CalorieCardSkeleton({ className }: SkeletonProps) {
  return (
    <section className={cn("bg-card border border-border rounded-[2.5rem] p-4 shadow-sm", className)}>
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

export function MacroCardSkeleton({ className }: SkeletonProps) {
  return (
    <section className={cn("bg-card border border-border rounded-[2.5rem] p-4 shadow-sm", className)}>
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

export function MiniCardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-card border border-border rounded-[2.5rem] p-4 shadow-sm", className)}>
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

export function DonutCardSkeleton({ className }: SkeletonProps) {
  return (
    <section className={cn("bg-card border border-border rounded-[2.5rem] p-4 shadow-sm", className)}>
      <div className="flex flex-col items-center text-center space-y-3">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-32 w-32 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </section>
  );
}

export function AchievementsSkeleton({ className }: SkeletonProps) {
  return (
    <section className={cn("bg-card border border-border rounded-[2.5rem] p-4 shadow-sm", className)}>
      <Skeleton className="h-3 w-24 mb-3" />
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="shrink-0 w-24 h-28 rounded-2xl bg-card border border-border animate-pulse"
          />
        ))}
      </div>
    </section>
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
