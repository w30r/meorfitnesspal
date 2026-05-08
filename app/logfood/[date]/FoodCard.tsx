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
      className="border-2 border-border/60 rounded-2xl overflow-hidden bg-card"
      open={expanded}
    >
      <summary
        className="flex items-center justify-between p-4 cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all list-none"
        onClick={(e) => {
          e.preventDefault();
          onToggleExpand(food.id);
        }}
      >
        <div className="flex items-center gap-3">
          <div className={`
            w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold
            ${food.foodName ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
          `}>
            {index + 1}
          </div>
          <span className="font-bold">
            {food.foodName || `Food ${index + 1}`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
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
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </summary>

      <div className="p-4 space-y-4 border-t border-border/60">
        <div className="space-y-3">
          <Input
            name="foodName"
            placeholder="What are you eating?"
            value={food.foodName}
            onChange={(e) => onFoodChange(food.id, e)}
            className="font-medium h-11 rounded-xl bg-background capitalize"
          />
          {food.foodName && (
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" type="button" asChild className="text-xs flex-1 rounded-lg">
                <a href={formatUrl(searchUrl100g, food.foodName)} target="_blank">
                  Search 100g
                </a>
              </Button>
              <Button variant="secondary" size="sm" type="button" asChild className="text-xs flex-1 rounded-lg">
                <a href={formatUrl(searchUrlTypical, food.foodName)} target="_blank">
                  Search Typical
                </a>
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
            Serving Size
          </label>
          <div className="flex flex-wrap gap-2">
            <Input
              name="servingSize"
              type="number"
              placeholder="grams"
              value={food.servingSize || ""}
              onChange={(e) => onServingSizeChange(food.id, Number(e.target.value))}
              className="w-24 h-10 text-sm rounded-xl font-medium"
            />
            {[50, 100, 150, 200].map((amount) => (
              <Button
                key={amount}
                variant={food.servingSize === amount ? "default" : "outline"}
                size="sm"
                type="button"
                onClick={() => handleQuickSize(amount)}
                className="h-10 text-xs font-medium rounded-xl"
              >
                {amount}g
              </Button>
            ))}
          </div>
        </div>

        <details className="border border-dashed border-border/60 rounded-xl overflow-hidden">
          <summary className="flex items-center justify-center p-2 cursor-pointer bg-muted/20 hover:bg-muted/40 text-xs text-muted-foreground list-none transition-colors">
            <FaPaste className="w-3 h-3 mr-2" /> Import from JSON
          </summary>
          <div className="p-3 border-t border-border/60 bg-muted/10">
            <Textarea
              ref={index === 0 ? textareaRef : undefined}
              placeholder='Paste JSON like {"calories": 100, "carbs": 20, "protein": 5, "fats": 3}'
              onChange={(e) => onPaste(e.target.value, food.id)}
              className="bg-background font-mono text-xs h-16 rounded-xl"
            />
          </div>
        </details>

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-muted/30 rounded-xl p-2 text-center">
            <Label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">Cal</Label>
            <Input
              name="calories"
              type="number"
              value={food.calories.toFixed(0) || ""}
              onChange={(e) => onFoodChange(food.id, e)}
              className="h-9 text-center font-bold text-sm rounded-lg bg-background"
            />
          </div>
          <div className="bg-emerald-500/10 rounded-xl p-2 text-center">
            <Label className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">Carbs</Label>
            <Input
              name="carbs"
              type="number"
              value={food.carbs.toFixed(0) || ""}
              onChange={(e) => onFoodChange(food.id, e)}
              className="h-9 text-center font-bold text-sm rounded-lg bg-background border-emerald-200 dark:border-emerald-800"
            />
          </div>
          <div className="bg-rose-500/10 rounded-xl p-2 text-center">
            <Label className="text-[9px] font-bold uppercase tracking-wider text-rose-600 block mb-1">Protein</Label>
            <Input
              name="protein"
              type="number"
              value={food.protein.toFixed(0) || ""}
              onChange={(e) => onFoodChange(food.id, e)}
              className="h-9 text-center font-bold text-sm rounded-lg bg-background border-rose-200 dark:border-rose-800"
            />
          </div>
          <div className="bg-amber-500/10 rounded-xl p-2 text-center">
            <Label className="text-[9px] font-bold uppercase tracking-wider text-amber-600 block mb-1">Fats</Label>
            <Input
              name="fats"
              type="number"
              value={food.fats.toFixed(0) || ""}
              onChange={(e) => onFoodChange(food.id, e)}
              className="h-9 text-center font-bold text-sm rounded-lg bg-background border-amber-200 dark:border-amber-800"
            />
          </div>
        </div>
      </div>
    </details>
  );
}