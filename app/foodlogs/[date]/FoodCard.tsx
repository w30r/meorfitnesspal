"use client";
import { deleteMealById, toggleFavorite } from "@/app/actions";
import { Trash, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

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
  isFavorite?: boolean;
}

interface FoodCardProps {
  log: FoodLog;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  date?: string;
}

const FoodCard = ({ log, onDelete, onToggleFavorite }: FoodCardProps) => {
  const router = useRouter();
  const realCalories = (log.protein * 4 + log.carbs * 4 + log.fats * 9).toFixed(
    1,
  );

  const handleDelete = async () => {
    console.log(`deleting ${log.foodName}`);
    await deleteMealById(log._id!);
    router.refresh();
    if (onDelete) {
      onDelete(log._id!);
    }
    console.log("routed!");
  };

  const handleToggleFavorite = async () => {
    console.log("Toggle favorite clicked for:", log._id, "current isFavorite:", log.isFavorite);
    try {
      await toggleFavorite(log._id!);
      if (onToggleFavorite) {
        onToggleFavorite(log._id!);
      }
      router.refresh();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm transition-all hover:shadow-md">
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

            <div className="flex items-center gap-1 mt-2">
              {/* Favorite Action */}
              <button
                type="button"
                onClick={handleToggleFavorite}
                className="p-1 rounded-md hover:bg-red-100"
                aria-label={log.isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart
                  className={log.isFavorite ? "fill-pink-500 text-pink-500" : "text-muted-foreground"}
                  size={18}
                />
              </button>
              {/* Delete Action */}
              <button
                type="button"
                onClick={handleDelete}
                className="p-1 rounded-md hover:bg-destructive/10"
                aria-label="Delete food log"
              >
                <Trash
                  className="text-muted-foreground"
                  size={18}
                />
              </button>
            </div>
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
