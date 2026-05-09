"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Plus, Trash2, Edit2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getCustomFavorites,
  createFavorite,
  deleteFavorite,
  toggleFavorite,
  getFavoriteFoods,
} from "../actions";

interface FavoriteFood {
  _id: string;
  foodName: string;
  servingSize: number;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  per100g?: {
    calories: number;
    carbs: number;
    protein: number;
    fats: number;
  };
}

interface MarkedFavorite extends FavoriteFood {
  isFavorite: boolean;
}

interface FormData {
  foodName: string;
  servingSize: string;
  calories: string;
  carbs: string;
  protein: string;
  fats: string;
}

const initialForm: FormData = {
  foodName: "",
  servingSize: "",
  calories: "",
  carbs: "",
  protein: "",
  fats: "",
};

export default function FavsPage() {
  const [customFavs, setCustomFavs] = useState<FavoriteFood[]>([]);
  const [markedFavs, setMarkedFavs] = useState<MarkedFavorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const fetchFavs = async () => {
    const [custom, marked] = await Promise.all([
      getCustomFavorites(),
      getFavoriteFoods(),
    ]);
    setCustomFavs(custom || []);
    setMarkedFavs(marked || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchFavs();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.foodName || !formData.calories) return;

    setSubmitting(true);
    try {
      const servingSize = formData.servingSize ? parseFloat(formData.servingSize) : 0;
      const calories = parseFloat(formData.calories) || 0;
      const carbs = parseFloat(formData.carbs) || 0;
      const protein = parseFloat(formData.protein) || 0;
      const fats = parseFloat(formData.fats) || 0;

      let per100g;
      if (servingSize > 0 && calories > 0) {
        per100g = {
          calories: (calories / servingSize) * 100,
          carbs: (carbs / servingSize) * 100,
          protein: (protein / servingSize) * 100,
          fats: (fats / servingSize) * 100,
        };
      }

      await createFavorite({
        foodName: formData.foodName,
        servingSize,
        calories,
        carbs,
        protein,
        fats,
        per100g,
      });

      setFormData(initialForm);
      setDialogOpen(false);
      fetchFavs();
    } catch (error) {
      console.error("Failed to create favorite", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustom = async (id: string) => {
    if (!confirm("Delete this favorite?")) return;
    await deleteFavorite(id);
    fetchFavs();
  };

  const handleToggleMarked = async (id: string) => {
    await toggleFavorite(id);
    fetchFavs();
  };

  const capitalizeWords = (str: string): string => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-20 w-full bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link href="/">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-lg font-bold">My Favs</h1>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Plus className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Favorite</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Food Name
                  </label>
                  <Input
                    name="foodName"
                    value={formData.foodName}
                    onChange={handleInputChange}
                    placeholder="e.g., Iced Latte"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-muted-foreground">
                    Serving Size (g)
                  </label>
                  <Input
                    name="servingSize"
                    type="number"
                    value={formData.servingSize}
                    onChange={handleInputChange}
                    placeholder="Optional - leave blank for drinks"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground">
                      Calories
                    </label>
                    <Input
                      name="calories"
                      type="number"
                      value={formData.calories}
                      onChange={handleInputChange}
                      placeholder="0"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground">
                      Carbs (g)
                    </label>
                    <Input
                      name="carbs"
                      type="number"
                      value={formData.carbs}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground">
                      Protein (g)
                    </label>
                    <Input
                      name="protein"
                      type="number"
                      value={formData.protein}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground">
                      Fats (g)
                    </label>
                    <Input
                      name="fats"
                      type="number"
                      value={formData.fats}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? "Saving..." : "Save Favorite"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
        {/* Custom Favorites Section */}
        {customFavs.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
              My Foods
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {customFavs.map((food) => (
                <Card
                  key={food._id}
                  className="relative overflow-hidden border-2 border-chart-5/30"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-sm leading-tight pr-6">
                        {capitalizeWords(food.foodName)}
                      </h3>
                      <button
                        onClick={() => handleDeleteCustom(food._id)}
                        className="absolute top-2 right-2 p-1 hover:bg-destructive/10 rounded"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {food.servingSize ? `${food.servingSize}g` : "1 serving"}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Cal</span>
                        <span className="font-bold">{food.calories.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>P: {food.protein.toFixed(0)}g</span>
                        <span>C: {food.carbs.toFixed(0)}g</span>
                        <span>F: {food.fats.toFixed(0)}g</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Marked Favorites Section */}
        {markedFavs.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1">
              <Heart className="h-3 w-3" />
              Marked Favorites
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {markedFavs.map((food) => (
                <Card
                  key={food._id}
                  className="relative overflow-hidden border-2 border-red-400/30"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-sm leading-tight pr-6">
                        {capitalizeWords(food.foodName)}
                      </h3>
                      <button
                        onClick={() => handleToggleMarked(food._id)}
                        className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded"
                      >
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {food.servingSize ? `${food.servingSize}g` : "1 serving"}
                    </p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Cal</span>
                        <span className="font-bold">{food.calories.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>P: {food.protein.toFixed(0)}g</span>
                        <span>C: {food.carbs.toFixed(0)}g</span>
                        <span>F: {food.fats.toFixed(0)}g</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {customFavs.length === 0 && markedFavs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg mb-2">No Favorites Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add custom foods or mark logged foods as favorites
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Favorite
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}