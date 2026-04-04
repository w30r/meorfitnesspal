// app/goals/[goalType]/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function GoalPage() {
  const router = useRouter();
  const { goalType } = "protein";
  const [formData, setFormData] = useState({
    targetCalories: "",
    targetCarbs: "",
    targetProtein: "",
    targetFats: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle the form submission, e.g., send data to an API
    console.log("Form Data:", formData);
    // Redirect to a success page or another page
    router.push("/goals/success");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
        Set {goalType} Goal
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="targetCalories" className="text-lg font-medium mb-2">
            Target Calories
          </label>
          <input
            type="number"
            id="targetCalories"
            name="targetCalories"
            value={formData.targetCalories}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
          />
        </div>
        <div>
          <label htmlFor="targetCarbs" className="text-lg font-medium mb-2">
            Target Carbs (g)
          </label>
          <input
            type="number"
            id="targetCarbs"
            name="targetCarbs"
            value={formData.targetCarbs}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
          />
        </div>
        <div>
          <label htmlFor="targetProtein" className="text-lg font-medium mb-2">
            Target Protein (g)
          </label>
          <input
            type="number"
            id="targetProtein"
            name="targetProtein"
            value={formData.targetProtein}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
          />
        </div>
        <div>
          <label htmlFor="targetFats" className="text-lg font-medium mb-2">
            Target Fats (g)
          </label>
          <input
            type="number"
            id="targetFats"
            name="targetFats"
            value={formData.targetFats}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Save Goal
        </button>
      </form>
    </div>
  );
}
