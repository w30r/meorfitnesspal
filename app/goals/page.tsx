// app/goals/[goalType]/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { getGoalData, updateMacrosAndCaloriesGoal } from "../actions";
import { RadioGroup, Radio, Label, DescriptionRoot } from "@heroui/react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

function calculateMacros(
  totalCalories: number,
  targetProtein: number,
  targetCarbs: number,
  targetFats: number,
) {
  const proteinCalories = targetProtein * 4;
  const carbsCalories = targetCarbs * 4;
  const fatsCalories = targetFats * 9;

  const remainingCalories =
    totalCalories - (proteinCalories + carbsCalories + fatsCalories);

  if (remainingCalories < 0) {
    // If the remaining calories are negative, adjust the macros
    const totalMacros = targetProtein + targetCarbs + targetFats;
    const ratio = Math.abs(remainingCalories) / (totalMacros * 4);

    targetProtein -= ratio * targetProtein;
    targetCarbs -= ratio * targetCarbs;
    targetFats -= ratio * targetFats;
  }

  return {
    targetProtein,
    targetCarbs,
    targetFats,
  };
}

export default function GoalPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [plan, setPlan] = useState("");
  const [formData, setFormData] = useState({
    targetCalories: 0,
    targetCarbs: 0,
    targetProtein: 0,
    targetFats: 0,
  });
  const [proteinRatio, setProteinratio] = useState(0);
  const [carbRatio, setCarbratio] = useState(0);
  const [fatRatio, setFatRatio] = useState(0);

  useEffect(() => {
    if (plan === "optimal") {
      setProteinratio(0.3);
      setCarbratio(0.4);
      setFatRatio(0.3);
    } else if (plan === "high-protein") {
      setProteinratio(0.35);
      setCarbratio(0.35);
      setFatRatio(0.3);
    } else if (plan === "performance") {
      setProteinratio(0.25);
      setCarbratio(0.5);
      setFatRatio(0.25);
    }
  }, [plan]);

  useEffect(() => {
    const fetchGoalData = async () => {
      const goalData = await getGoalData();
      console.log("🚀 ~ fetchGoalData ~ goalData:", goalData);
      if (goalData) {
        setFormData({
          ...formData,
          targetCalories: goalData[0].calories,
          targetCarbs: goalData[0].carbs,
          targetProtein: goalData[0].protein,
          targetFats: goalData[0].fats,
        });
        setIsLoading(false);
      }
    };

    const calculateRatios = () => {
      setCarbratio((formData.targetCarbs / formData.targetCalories) * 100);
      setProteinratio((formData.targetProtein / formData.targetCalories) * 100);
      setFatRatio((formData.targetFats / formData.targetCalories) * 100);
    };

    console.log("🚀 ~ fetchGoalData ~ formData:", formData);
    fetchGoalData();
    calculateRatios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: { target: { name: string; value: number } }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSliderChange = (name: string, value: number) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Here you can handle the form submission, e.g., send data to an API
    console.log("Form Data:", formData);
    // Update the goal data
    await updateMacrosAndCaloriesGoal(
      formData.targetCalories as number,
      formData.targetProtein,
      formData.targetCarbs,
      formData.targetFats,
    );

    router.push("/");
  };

  const totalCalories = formData.targetCalories ? formData.targetCalories : 0;
  const targetProtein = formData.targetProtein ? formData.targetProtein : 0;
  const targetCarbs = formData.targetCarbs ? formData.targetCarbs : 0;
  const targetFats = formData.targetFats ? formData.targetFats : 0;

  // const limitedMacros = calculateMacros(
  //   totalCalories,
  //   targetProtein,
  //   targetCarbs,
  //   targetFats,
  // );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-background py-16 px-8 transition-all duration-300 md:px-64">
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <div className="place-self-start text-4xl font-bold mb-2 text-gray-800 dark:text-white">
            <Link href="/">
              <p>back</p>
            </Link>
            Set Goal
            <h2 className="text-xs">proteinratio: {proteinRatio}</h2>
            <h2 className="text-xs">carbratio: {carbRatio}</h2>
            <h2 className="text-xs">fatratio: {fatRatio}</h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-2 flex-1"
          >
            <div className="flex flex-col">
              <label
                htmlFor="targetCalories"
                className="text-lg font-medium mb-2"
              >
                Target Calories
              </label>
              <Input
                type="number"
                id="targetCalories"
                name="targetCalories"
                value={formData.targetCalories}
                onChange={() => handleChange}
                className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2 mb-4 w-24 text-center"
              />
            </div>
            <div className="flex flex-col gap-4 bg-secondary rounded-3xl p-4 pb-6 outline-2 outline-primary">
              <Label className="font-bold text-xl underline">
                Choose Macro Plan
              </Label>
              <RadioGroup
                onChange={setPlan}
                defaultValue={plan}
                name="macro-plan-orientation"
                orientation="horizontal"
              >
                <Radio value="optimal">
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <Radio.Content>
                    <Label>Optimal Balance</Label>
                    <DescriptionRoot>30% P, 40% C, 30% F</DescriptionRoot>
                  </Radio.Content>
                </Radio>
                <Radio value="high-protein">
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <Radio.Content>
                    <Label>High-Protein Focus</Label>
                    <DescriptionRoot>35% P, 35% C, 30% F</DescriptionRoot>
                  </Radio.Content>
                </Radio>
                <Radio value="performance">
                  <Radio.Control>
                    <Radio.Indicator />
                  </Radio.Control>
                  <Radio.Content>
                    <Label>Performance/Active</Label>
                    <DescriptionRoot>25% P, 50% C, 25% F</DescriptionRoot>
                  </Radio.Content>
                </Radio>
              </RadioGroup>
            </div>

            <div>
              <label
                htmlFor="targetProtein"
                className="text-lg font-medium mb-2"
              >
                Target Protein (
                {((proteinRatio * formData.targetCalories) / 4).toFixed(1)}g)
              </label>
              <Slider
                defaultValue={[proteinRatio]}
                disabled
                min={0}
                max={0.5}
                step={0.1}
                value={[proteinRatio]}
                // onValueChange={(value) =>
                //   handleSliderChange("targetProtein", value[0])
                // }
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="targetCarbs" className="text-lg font-medium mb-2">
                Target Carbs (
                {((carbRatio * formData.targetCalories) / 4).toFixed(1)}g)
              </label>
              <Slider
                defaultValue={[carbRatio]}
                disabled
                min={0}
                max={0.5}
                step={1}
                value={[carbRatio]}
                onValueChange={(value) =>
                  handleSliderChange("targetCarbs", value[0])
                }
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="targetFats" className="text-lg font-medium mb-2">
                Target Fats (
                {((fatRatio * formData.targetCalories) / 9).toFixed(1)}g)
              </label>
              <Slider
                defaultValue={[fatRatio]}
                disabled
                min={0}
                max={0.5}
                step={1}
                value={[fatRatio]}
                onValueChange={(value) =>
                  handleSliderChange("targetFats", value[0])
                }
                className="w-full"
              />
            </div>
            {/* <div>
              <label
                htmlFor="totalCalories"
                className="text-lg font-medium mb-2"
              >
                Total Calories
              </label>
              <input
                type="number"
                id="totalCalories"
                name="totalCalories"
                value={totalCalories}
                readOnly
                className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
              />
            </div> */}
            <Button type="submit" className="mt-12">
              Save Goal
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
