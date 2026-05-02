import { create } from "zustand";
import { getFoodLogbyDate, FoodLogResponse, FoodEntry } from "@/app/actions";

export type { FoodEntry };
export type { FoodLogResponse };

interface FoodLogCache {
  [date: string]: FoodLogResponse;
}

interface FoodLogState {
  cache: FoodLogCache;
  loadingDates: Set<string>;
  getFoodLog: (date: string) => Promise<FoodLogResponse | null>;
  invalidateDate: (date: string) => void;
}

export const useFoodLogStore = create<FoodLogState>((set, get) => ({
  cache: {},
  loadingDates: new Set(),

  getFoodLog: async (date: string) => {
    const { cache, loadingDates } = get();

    if (cache[date]) {
      return cache[date];
    }

    if (loadingDates.has(date)) {
      return null;
    }

    set((state) => ({
      loadingDates: new Set(state.loadingDates).add(date),
    }));

    try {
      const data = await getFoodLogbyDate(date);
      set((state) => ({
        cache: { ...state.cache, [date]: data },
        loadingDates: new Set(state.loadingDates),
      }));
      loadingDates.delete(date);
      return data;
    } catch {
      console.error("Failed to fetch food log for", date);
      set((state) => {
        const next = new Set(state.loadingDates);
        next.delete(date);
        return { loadingDates: next };
      });
      return null;
    }
  },

  invalidateDate: (date: string) => {
    set((state) => {
      const { [date]: _, ...rest } = state.cache;
      return { cache: rest };
    });
  },
}));
