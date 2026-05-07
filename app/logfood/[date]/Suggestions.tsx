"use client";

import { Button } from "@/components/ui/button";
import { FaHeart } from "react-icons/fa6";

interface Suggestion {
  _id: string;
  foodName: string;
  servingSize: number;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  per100g?: { calories: number; carbs: number; protein: number; fats: number };
}

interface SuggestionsProps {
  favoriteFoods: Suggestion[];
  recentFoods: Suggestion[];
  show: boolean;
  onToggle: () => void;
  onSelect: (food: Suggestion) => void;
}

export default function Suggestions({
  favoriteFoods,
  recentFoods,
  show,
  onToggle,
  onSelect,
}: SuggestionsProps) {
  if (favoriteFoods.length === 0 && recentFoods.length === 0) return null;

  return (
    <>
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 text-[10px]"
          type="button"
          onClick={onToggle}
        >
          {show ? "Hide" : "Show"} suggestions
        </Button>
      </div>
      {show && (
        <div className="space-y-3">
          {favoriteFoods.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 flex items-center gap-1">
                <FaHeart className="w-2 h-2" /> Favorites
              </p>
              <div className="flex flex-wrap gap-1">
                {favoriteFoods.map((food) => (
                  <Button
                    key={food._id}
                    variant="outline"
                    size="sm"
                    type="button"
                    className="h-7 text-xs"
                    onClick={() => onSelect(food)}
                  >
                    {food.foodName}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {recentFoods.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1">
                Recent
              </p>
              <div className="flex flex-wrap gap-1">
                {recentFoods.slice(0, 10).map((food) => (
                  <Button
                    key={food._id}
                    variant="outline"
                    size="sm"
                    type="button"
                    className="h-7 text-xs"
                    onClick={() => onSelect(food)}
                  >
                    {food.foodName}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}