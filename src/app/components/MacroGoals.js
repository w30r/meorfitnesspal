import React from "react";
import { Ellipsis } from "lucide-react";
import { CircularProgress } from "@nextui-org/progress";
export default function MacroGoals({ carbs, protein, fats }) {
  return (
    <div className="bg-white px-4 py-3 mt-3 rounded-xl outline-1 outline outline-black/10 shadow-md mb-4">
      <div className="flex p-1 justify-between items-center ">
        <h1 className="text-xl">Macros</h1>
        <Ellipsis size={18} />
      </div>
      <div className=" flex justify-between items-center md:justify-evenly">
        <div className="flex flex-col justify-center items-center gap-2">
          <CircularProgress
            classNames={{
              svg: "w-20 h-20 md:w-32 md:h-32 md:w-32 md:h-32 drop-shadow-md",
              indicator: "stroke-[#1671e8]/80",
              track: "stroke-gray-400/20",
              value: "text-xs font-semibold text-black",
            }}
            aria-label="Loading..."
            size="lg"
            value={carbs}
            color="info"
            showValueLabel={true}
          />
          <h3 className="text-xs">Carbs</h3>
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <CircularProgress
            classNames={{
              svg: "w-20 h-20 md:w-32 md:h-32 drop-shadow-md",
              indicator: "stroke-[#ff7fcc]",
              track: "stroke-gray-400/20",
              value: "text-xs font-semibold text-black",
            }}
            aria-label="Loading..."
            size="lg"
            value={protein}
            color="info"
            showValueLabel={true}
          />
          <h3 className="text-xs">Protein</h3>
        </div>
        <div className="flex flex-col justify-center items-center gap-2">
          <CircularProgress
            classNames={{
              svg: "w-20 h-20 md:w-32 md:h-32 drop-shadow-md",
              indicator: "stroke-[#ffc21a]",
              track: "stroke-gray-400/20",
              value: "text-xs font-semibold text-black",
            }}
            aria-label="Loading..."
            size="lg"
            value={fats}
            showValueLabel={true}
          />
          <h3 className="text-xs">Fat</h3>
        </div>
      </div>
    </div>
  );
}
