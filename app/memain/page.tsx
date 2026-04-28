"use client";
import { Button } from "@/components/ui/button";
import useBear from "./zustand";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

export default function Page() {
  const bears = useBear((x) => x.bears);
  const increasePopulation = useBear((x) => x.increasePopulation);
  const decreasePop = useBear((x) => x.decreasePop);
  const addTenBears = useBear((x) => x.addTenBears);
  const updateBears = useBear((x) => x.updateBears);

  // 2. Wrap the interval in useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      addTenBears();
    }, 1000);

    // 3. Clean up the interval when the component is destroyed
    return () => clearInterval(interval);
  }, [addTenBears]); // Dependency array ensures this only runs once

  return (
    <div className="bg-background flex flex-col items-center justify-center    ">
      <h1>Bears: {bears}</h1>

      <div className="gap-2 flex">
        <Input
          type="number"
          value={bears}
          onChange={(e) => updateBears(Number(e.target.value))}
        />
        <Button variant="default" onClick={increasePopulation}>
          Increase Pop
        </Button>
        <Button variant="destructive" onClick={decreasePop}>
          Decrease Pop
        </Button>
        <Button variant="outline" onClick={addTenBears}>
          +10
        </Button>
      </div>
    </div>
  );
}
