import { CircularProgress } from "@nextui-org/progress";
import { Ellipsis } from "lucide-react";

export default function CalorieGoal(goal, calsConsumed) {
  // const caloriesPercent = (value / 1500) * 100;
  return (
    <div className="bg-white px-4 py-3 mt-10 rounded-xl outline-1 outline outline-black/10 shadow-md mb-4">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-xl">Calories</h1>
        <Ellipsis size={18} />
      </div>
      <div className="flex justify-around items-center">
        <CircularProgress
          classNames={{
            svg: "w-28 h-28 md:w-32 md:h-32 md:w-32 md:h-32 drop-shadow-md",
            indicator: "stroke-green-500/80",
            track: "stroke-gray-400/20",
            value: "text-xs font-semibold text-black",
          }}
          aria-label="Loading..."
          size="xl"
          value={80}
          color="info"
          showValueLabel={false}
        />
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-xl text-green-500">876 kcals</h1>
          <h1 className="text-xs text-gray-400/50">out of</h1>
          <h1 className="text-sm font-semibold text-gray-400/50">1500 kcals</h1>
        </div>
      </div>
    </div>
  );
}
