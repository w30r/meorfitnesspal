"use client";
import { Trash } from "lucide-react";

/**
 * Interface representing the structure of a Food Log entry.
 */
export interface FoodLog {
  _id?: string;
  foodName: string;
  servingSize?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface FoodCardProps {
  log: FoodLog;
  onDelete?: (id: string) => void;
}

const FoodCard = ({ log, onDelete }: FoodCardProps) => {
  // Calculate calories based on Atwater system: 4 kcal/g for protein/carbs, 9 kcal/g for fats
  const realCalories = (log.protein * 4 + log.carbs * 4 + log.fats * 9).toFixed(
    1,
  );

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm transition-all hover:shadow-md">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold leading-tight tracking-tight pr-4">
            {log.foodName}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {log.servingSize || "1 portion"}
          </p>
        </div>

        <div className="text-right flex flex-col items-end">
          <div>
            <span className="text-2xl font-bold text-primary">
              {log.calories.toFixed(1)}
            </span>
            <span className="ml-1 text-xs font-medium uppercase text-muted-foreground">
              kcal
            </span>
          </div>

          {/* Delete Action */}
          <button
            onClick={() => log._id && onDelete?.(log._id)}
            className="mt-2 p-1 transition-colors hover:bg-destructive/10 rounded-md"
            aria-label="Delete food log"
          >
            <Trash
              className="text-muted-foreground transition-colors group-hover:text-red-600"
              size={18}
            />
          </button>
        </div>
      </div>

      {/* Macronutrients Grid */}
      <div className="grid grid-cols-3 gap-2 border-t border-border pt-4">
        <div className="flex flex-col items-center rounded-lg bg-secondary/50 py-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">
            Protein
          </span>
          <span className="text-sm font-bold">{log.protein.toFixed(0)}g</span>
        </div>

        <div className="flex flex-col items-center rounded-lg bg-secondary/50 py-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">
            Carbs
          </span>
          <span className="text-sm font-bold">{log.carbs.toFixed(0)}g</span>
        </div>

        <div className="flex flex-col items-center rounded-lg bg-secondary/50 py-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">
            Fats
          </span>
          <span className="text-sm font-bold">{log.fats.toFixed(0)}g</span>
        </div>
      </div>

      {/* Verification Footer */}
      <p className="mt-3 text-[10px] italic text-muted-foreground text-center">
        Calculated from macros: {realCalories} kcal
      </p>
    </div>
  );
};

export default FoodCard;
