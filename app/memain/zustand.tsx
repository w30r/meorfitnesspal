import { create } from "zustand";

interface BearState {
  bears: number;
  increasePopulation: () => void;
  removeAllBears: () => void;
  updateBears: (newBears: number) => void;
  decreasePop: () => void;
  addTenBears: () => void;
}

const useBear = create<BearState>((set) => ({
  bears: 1,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
  decreasePop: () => set((state) => ({ bears: state.bears - 1 })),
  addTenBears: () => set((state) => ({ bears: state.bears + 10 })),
}));

export default useBear;
