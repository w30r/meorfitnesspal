"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getGoalData, updateMacrosAndCaloriesGoal } from "../actions";
import { RadioGroup, Radio, Label, DescriptionRoot } from "@heroui/react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Save } from "lucide-react";

interface Goal {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface MacroPlan {
  name: string;
  protein: number;
  carbs: number;
  fats: number;
}

const macroPlans: MacroPlan[] = [
  { name: "Balanced", protein: 30, carbs: 40, fats: 30 },
  { name: "High Protein", protein: 40, carbs: 30, fats: 30 },
  { name: "Low Carb", protein: 35, carbs: 20, fats: 45 },
  { name: "High Carb", protein: 25, carbs: 50, fats: 25 },
];

export default function GoalPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<number>(0);
  const [formData, setFormData] = useState({
    targetCalories: 2000,
    targetProtein: 150,
    targetCarbs: 200,
    targetFats: 65,
  });

  useEffect(() => {
    const fetchGoalData = async () => {
      const goalData = await getGoalData();
      if (goalData && goalData[0]) {
        const g = goalData[0] as Goal;
        setFormData({
          targetCalories: g.calories,
          targetProtein: g.protein,
          targetCarbs: g.carbs,
          targetFats: g.fats,
        });

        const planIndex = macroPlans.findIndex(
          (p) =>
            Math.abs(p.protein - (g.protein * 4 / g.calories) * 100) < 5 &&
            Math.abs(p.carbs - (g.carbs * 4 / g.calories) * 100) < 5
        );
        if (planIndex >= 0) setSelectedPlan(planIndex);
      }
      setIsLoading(false);
    };
    fetchGoalData();
  }, []);

  useEffect(() => {
    const plan = macroPlans[selectedPlan];
    const calories = formData.targetCalories || 1;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData((prev) => ({
      ...prev,
      targetProtein: Math.round((calories * plan.protein) / 100 / 4),
      targetCarbs: Math.round((calories * plan.carbs) / 100 / 4),
      targetFats: Math.round((calories * plan.fats) / 100 / 9),
    }));
  }, [selectedPlan, formData.targetCalories]);

  const handleChange = (field: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData((prev) => ({ ...prev, [field]: numValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateMacrosAndCaloriesGoal(
      formData.targetCalories,
      formData.targetProtein,
      formData.targetCarbs,
      formData.targetFats
    );
    router.push("/");
  };

  const calorieBreakdown =
    (formData.targetProtein * 4) +
    (formData.targetCarbs * 4) +
    (formData.targetFats * 9);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 w-full bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-bold">Set Goals</h1>
          <div className="w-9" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-8 space-y-6">
        <section className="bg-card border border-border rounded-[2.5rem] p-6 shadow-sm space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Daily Calorie Target
            </label>
            <div className="mt-2 flex items-baseline gap-1">
              <Input
                type="number"
                value={formData.targetCalories}
                onChange={(e) => handleChange("targetCalories", e.target.value)}
                className="text-4xl font-black border-0 bg-transparent px-0 h-auto w-32 focus:ring-0 focus:outline-none focus:border-b-2 focus:border-primary"
              />
              <span className="text-lg font-medium text-muted-foreground">kcal</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Macro Split
            </label>
            <RadioGroup
              value={selectedPlan.toString()}
              onChange={(val) => setSelectedPlan(parseInt(val))}
              orientation="horizontal"
              className="grid grid-cols-2 gap-2"
            >
              {macroPlans.map((plan, idx) => (
                <Radio key={idx} value={idx.toString()} className="border-2 border-border rounded-2xl p-3 data-[selected=true]:border-primary data-[selected=true]:bg-primary/5">
                  <div className="flex flex-col">
                    <Label className="text-sm font-bold">{plan.name}</Label>
                    <DescriptionRoot className="text-xs text-muted-foreground">
                      {plan.protein}% P / {plan.carbs}% C / {plan.fats}% F
                    </DescriptionRoot>
                  </div>
                </Radio>
              ))}
            </RadioGroup>
          </div>
        </section>

        <section className="bg-card border border-border rounded-[2.5rem] p-6 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Daily Targets
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-secondary/50 rounded-2xl">
              <p className="text-[10px] font-bold uppercase text-success mb-1">Protein</p>
              <p className="text-2xl font-black">{formData.targetProtein}</p>
              <p className="text-xs text-muted-foreground">grams</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {(formData.targetProtein * 4).toFixed(0)} kcal
              </p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-2xl">
              <p className="text-[10px] font-bold uppercase text-danger mb-1">Carbs</p>
              <p className="text-2xl font-black">{formData.targetCarbs}</p>
              <p className="text-xs text-muted-foreground">grams</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {(formData.targetCarbs * 4).toFixed(0)} kcal
              </p>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-2xl">
              <p className="text-[10px] font-bold uppercase text-warning mb-1">Fats</p>
              <p className="text-2xl font-black">{formData.targetFats}</p>
              <p className="text-xs text-muted-foreground">grams</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {(formData.targetFats * 9).toFixed(0)} kcal
              </p>
            </div>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>Total from macros:</span>
            <span className={calorieBreakdown > formData.targetCalories ? "text-destructive font-medium" : ""}>
              {calorieBreakdown.toFixed(0)} / {formData.targetCalories} kcal
            </span>
          </div>
        </section>

        <Button
          onClick={handleSubmit}
          className="w-full h-14 text-lg font-bold rounded-2xl"
        >
          <Save className="mr-2 h-5 w-5" />
          Save Goals
        </Button>
      </main>
    </div>
  );
}