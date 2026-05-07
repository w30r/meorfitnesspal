"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FaPaste } from "react-icons/fa";
import { ChevronDown, ChevronRight, X } from "lucide-react";

interface Per100g {
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
}

interface FoodEntry {
  id: string;
  foodName: string;
  servingSize: number;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  per100g?: Per100g;
}

interface FoodCardProps {
  food: FoodEntry;
  index: number;
  expanded: boolean;
  canDelete: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onToggleExpand: (id: string) => void;
  onDelete: (id: string) => void;
  onServingSizeChange: (id: string, grams: number) => void;
  onFoodChange: (id: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPaste: (text: string, id: string) => void;
}

const searchUrl100g =
  "give the nutrional facts per 100g in JSON format (use the field names: calories, carbs, protein, fats. and the value in number not string) for ";
const searchUrlTypical =
  "give the nutrional facts for a typical portion in JSON format (use the field names: calories, carbs, protein, fats. and the value in number not string) for ";

const formatUrl = (str: string, foodName: string) =>
  `https://www.google.com/search?q=${str.replaceAll(" ", "+")}${foodName}`;

export default function FoodCard({
  food,
  index,
  expanded,
  canDelete,
  textareaRef,
  onToggleExpand,
  onDelete,
  onServingSizeChange,
  onFoodChange,
  onPaste,
}: FoodCardProps) {
  const handleQuickSize = (grams: number) => onServingSizeChange(food.id, grams);

  return (
    <details
      key={food.id}
      className="border border-border rounded-lg overflow-hidden"
      open={expanded}
    >
      <summary
        className="flex items-center justify-between p-3 cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors list-none"
        onClick={(e) => {
          e.preventDefault();
          onToggleExpand(food.id);
        }}
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="font-medium">
            {food.foodName || `Food ${index + 1}`}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {food.calories.toFixed(0)} kcal
          </span>
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(food.id);
              }}
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </summary>

      <div className="p-3 space-y-3 border-t border-border">
        <div className="space-y-2">
          <Input
            name="foodName"
            placeholder="Food name"
            value={food.foodName}
            onChange={(e) => onFoodChange(food.id, e)}
            className="font-medium"
          />
          <div className="flex gap-1">
            <Button variant="secondary" size="sm" type="button" asChild className="text-xs flex-1">
              <a href={formatUrl(searchUrl100g, food.foodName)} target="_blank">
                100g
              </a>
            </Button>
            <Button variant="secondary" size="sm" type="button" asChild className="text-xs flex-1">
              <a href={formatUrl(searchUrlTypical, food.foodName)} target="_blank">
                Typical
              </a>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            <Input
              name="servingSize"
              type="number"
              placeholder="g"
              value={food.servingSize || ""}
              onChange={(e) => onServingSizeChange(food.id, Number(e.target.value))}
              className="w-20 h-8 text-sm"
            />
            {[50, 100, 150, 200].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                type="button"
                onClick={() => handleQuickSize(amount)}
                className="h-8 text-xs"
              >
                {amount}g
              </Button>
            ))}
          </div>
        </div>

        <details className="border border-border rounded overflow-hidden">
          <summary className="flex items-center justify-center p-1 cursor-pointer bg-muted/30 hover:bg-muted/50 text-[10px] text-muted-foreground list-none">
            <FaPaste className="w-3 h-3 mr-1" /> Data Import
          </summary>
          <div className="p-2 border-t border-border space-y-1">
            <Textarea
              ref={index === 0 ? textareaRef : undefined}
              placeholder="Paste JSON..."
              onChange={(e) => onPaste(e.target.value, food.id)}
              className="bg-background font-mono text-[10px] h-12"
            />
          </div>
        </details>

        <div className="grid grid-cols-4 gap-2">
          <div>
            <Label className="text-[10px]">Calories</Label>
            <Input
              name="calories"
              type="number"
              value={food.calories.toFixed(0) || ""}
              onChange={(e) => onFoodChange(food.id, e)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-[10px] text-emerald-600">Carbs</Label>
            <Input
              name="carbs"
              type="number"
              value={food.carbs.toFixed(0) || ""}
              onChange={(e) => onFoodChange(food.id, e)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-[10px] text-rose-600">Protein</Label>
            <Input
              name="protein"
              type="number"
              value={food.protein.toFixed(0) || ""}
              onChange={(e) => onFoodChange(food.id, e)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-[10px] text-amber-600">Fats</Label>
            <Input
              name="fats"
              type="number"
              value={food.fats.toFixed(0) || ""}
              onChange={(e) => onFoodChange(food.id, e)}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>
    </details>
  );
}