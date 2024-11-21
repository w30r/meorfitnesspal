import { Beef, CirclePlus, EggFried, Pizza } from "lucide-react";

export default function MealHeader({ mealtime, calories }) {
  return (
    <div
      id="MEAL-HEADER"
      className="bg-[#1671e8] px-4 flex justify-between items-center gap-2 py-3 rounded-t-xl text-white outline-1 outline outline-black/10 shadow-md "
    >
      <div className="flex items-center gap-2">
        {mealtime === "Breakfast" && <EggFried strokeWidth={1.75} size={18} />}
        {mealtime === "Lunch" && <Beef strokeWidth={1.75} size={18} />}
        {mealtime === "Dinner" && <Pizza strokeWidth={1.75} size={18} />}
        <div>
          <h1 className="font-bold text-xs">{mealtime}</h1>
          <h1 className="font-light text-xs">{calories} kcal</h1>
        </div>
      </div>
      <CirclePlus
        strokeWidth={1.75}
        className="hover:scale-[1.03] duration-150 "
      />
    </div>
  );
}
