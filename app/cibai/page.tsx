"use client";

import { useState } from "react";

export default function LogPage() {
  const [formData, setFormData] = useState({
    foodName: "",
    servingSize: "",
    calories: "",
    carbs: "",
    protein: "",
    fats: "",
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
    alert("Food logged successfully!");
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100
dark:bg-gray-900"
    >
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
        Log Food
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <label htmlFor="foodName" className="text-lg font-medium mb-2">
            Food Name
          </label>
          <input
            type="text"
            id="foodName"
            name="foodName"
            value={formData.foodName}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
          />
        </div>
        <div>
          <label htmlFor="servingSize" className="text-lg font-medium mb-2">
            Serving Size
          </label>
          <input
            type="text"
            id="servingSize"
            name="servingSize"
            value={formData.servingSize}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
          />
        </div>
        <div>
          <label htmlFor="calories" className="text-lg font-medium mb-2">
            Calories
          </label>
          <input
            type="number"
            id="calories"
            name="calories"
            value={formData.calories}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
          />
        </div>
        <div>
          <label htmlFor="carbs" className="text-lg font-medium mb-2">
            Carbs (g)
          </label>
          <input
            type="number"
            id="carbs"
            name="carbs"
            value={formData.carbs}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
          />
        </div>
        <div>
          <label htmlFor="protein" className="text-lg font-medium mb-2">
            Protein (g)
          </label>
          <input
            type="number"
            id="protein"
            name="protein"
            value={formData.protein}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
          />
        </div>
        <div>
          <label htmlFor="fats" className="text-lg font-medium mb-2">
            Fats (g)
          </label>
          <input
            type="number"
            id="fats"
            name="fats"
            value={formData.fats}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-700 rounded px-4 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600
dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          Log Food
        </button>
      </form>
    </div>
  );
}
