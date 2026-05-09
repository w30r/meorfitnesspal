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
  customFoods?: Suggestion[];
  recentFoods: Suggestion[];
  show: boolean;
  loading?: boolean;
  onToggle: () => void;
  onSelect: (food: Suggestion) => void;
}

export default function Suggestions({
  favoriteFoods,
  customFoods,
  recentFoods,
  show,
  loading,
  onToggle,
  onSelect,
}: SuggestionsProps) {
  if (loading) {
    return (
      <>
        <div className="flex justify-start">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[10px]"
            type="button"
            onClick={onToggle}
          >
            Hide
          </Button>
        </div>
        {show && (
          <div className="flex items-center justify-center py-4">
            <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </>
    );
  }

  if (favoriteFoods.length === 0 && customFoods?.length === 0 && recentFoods.length === 0) return null;

  return (
    <>
      <div className="flex justify-start">
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
          {customFoods && customFoods.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 flex items-center gap-1">
                My Favs
              </p>
              <div className="flex flex-wrap gap-1">
                {customFoods.map((food) => (
                  <Button
                    key={food._id}
                    variant="outline"
                    size="sm"
                    type="button"
                    className="h-7 text-xs border-chart-5/30"
                    onClick={() => onSelect(food)}
                  >
                    {food.foodName}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {favoriteFoods.length > 0 && (
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground mb-1 flex items-center gap-1">
                <FaHeart className="w-2 h-2" /> Marked
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
