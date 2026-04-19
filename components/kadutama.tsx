import { ProgressCircle } from "@heroui/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MacroCircleProps {
  label: string;
  current: number;
  goal: number;
  color: "success" | "danger" | "warning";
}

// Internal sub-component to keep things tidy
const MacroCircle = ({ label, current, goal, color }: MacroCircleProps) => {
  const percentage = goal > 0 ? (current / goal) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center text-center w-full">
      <ProgressCircle
        aria-label={label}
        value={percentage}
        size="lg"
        color={color}
        className="drop-shadow-sm"
      >
        <ProgressCircle.Track className="size-14">
          <ProgressCircle.TrackCircle
            className="stroke-muted/30"
            strokeWidth={3}
          />
          <ProgressCircle.FillCircle strokeWidth={3} />
        </ProgressCircle.Track>
      </ProgressCircle>

      <div className="mt-3 space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="text-lg font-black leading-none">
          {current.toFixed(1)}
          <span className="text-[10px] font-medium ml-0.5">g</span>
        </p>
        <p
          className={cn(
            "text-[10px] font-medium px-1.5 py-0.5 rounded-full inline-block",
            percentage > 100
              ? "bg-destructive/10 text-destructive"
              : "bg-secondary text-muted-foreground",
          )}
        >
          {percentage.toFixed(0)}%
        </p>
      </div>
    </div>
  );
};

export default function KadUtama({
  p = 0,
  c = 0,
  f = 0,
  pgoal = 1, // Default to 1 to avoid division by zero
  cgoal = 1,
  fgoal = 1,
  date,
}: {
  p?: number;
  c?: number;
  f?: number;
  pgoal?: number;
  cgoal?: number;
  fgoal?: number;
  date?: string;
}) {
  return (
    <div className="group relative overflow-hidden bg-card border border-border p-6 rounded-[2.5rem] shadow-sm transition-all hover:shadow-md">
      {/* Optional decorative background glow */}
      <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

      <Link href={`/foodlogs/${date}`} className="relative z-10 block">
        <div className="flex justify-around items-start w-full gap-2">
          <MacroCircle
            label="Protein"
            current={p}
            goal={pgoal}
            color="success"
          />

          {/* Divider */}
          <div className="h-20 w-[1px] bg-border/50 self-center" />

          <MacroCircle label="Carbs" current={c} goal={cgoal} color="danger" />

          {/* Divider */}
          <div className="h-20 w-[1px] bg-border/50 self-center" />

          <MacroCircle label="Fats" current={f} goal={fgoal} color="warning" />
        </div>
      </Link>
    </div>
  );
}
