"use client";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateMacrosAndCaloriesGoal } from "@/app/actions";
import { useRouter } from "next/navigation";

export default function QuickAdd() {
  const [formData, setFormData] = useState({
    foodName: "",
    servingSize: 0,
    calories: 0,
    carbs: 0,
    protein: 0,
    fats: 0,
  });

  const handleChange = (e: {
    target: { name: string; value: string | number };
  }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // Here you can handle the form submission, e.g., send data to an API
    console.log("Form Data:", formData);
    // Update the goal data
    await updateMacrosAndCaloriesGoal(
      formData.calories as number,
      formData.protein,
      formData.carbs,
      formData.fats,
    );
    router.push("/");
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-start">
      <div>
        <h2 className="mb-1">Food Name</h2>
        <Input
          id="foodName"
          name="foodName"
          value={formData.foodName}
          onChange={handleChange}
          autoComplete="off"
          className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2 w-64"
        />
      </div>
      {/* <div>
        <h2 className="mb-1">servingSize</h2>
        <Input
          id="servingSize"
          name="servingSize"
          value={formData.servingSize}
          onChange={handleChange}
          autoComplete="off"
          className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2 w-64"
        />
      </div> */}
      <div>
        <h2 className="mb-1">calories</h2>
        <Input
          id="calories"
          name="calories"
          value={formData.calories}
          onChange={handleChange}
          autoComplete="off"
          className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2 w-64"
        />
      </div>
      <div>
        <h2 className="mb-1">carbs</h2>
        <Input
          id="carbs"
          name="carbs"
          value={formData.carbs}
          onChange={handleChange}
          autoComplete="off"
          className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2 w-64"
        />
      </div>
      <div>
        <h2 className="mb-1">protein</h2>
        <Input
          id="protein"
          name="protein"
          value={formData.protein}
          onChange={handleChange}
          autoComplete="off"
          className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2 w-64"
        />
      </div>
      <div>
        <h2 className="mb-1">fats</h2>
        <Input
          id="fats"
          name="fats"
          value={formData.fats}
          onChange={handleChange}
          autoComplete="off"
          className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2 w-64"
        />
      </div>

      <Button variant="outline" onClick={handleSubmit}>
        Add
      </Button>
    </div>
  );
}
