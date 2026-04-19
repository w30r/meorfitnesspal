import { getFoodLogbyDate } from "@/app/actions";
import Link from "next/link";
import { ChevronLeft, Trash, Utensils } from "lucide-react"; // Optional: if you have lucide-react

interface FoodLog {
  _id: string;
  foodName: string;
  servingSize: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  date: string;
  meal: string;
}

export function formatShortDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${day} ${months[parseInt(month) - 1]} ${year}`;
}

// Sub-component for individual food items to keep the main return clean
const FoodCard = ({ log }: { log: FoodLog }) => {
  const realCalories = (log.protein * 4 + log.carbs * 4 + log.fats * 9).toFixed(
    1,
  );
  const totalBreakfastCal = log.protein * 4 + log.carbs * 4 + log.fats * 9;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold leading-none tracking-tight">
            {log.foodName}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            {log.servingSize || "1 portion"}
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-primary">
            {log.calories}
          </span>
          <span className="ml-1 text-xs font-medium uppercase text-muted-foreground">
            kcal
          </span>
          {/* <span className="ml-1 text-xs font-medium uppercase text-muted-foreground">
            {log._id}
          </span> */}
          <Trash
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 stroke-red-700"
            size={16}
            // onClick={() => deleteMealById(log._id)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-border pt-4">
        <div className="flex flex-col items-center rounded-lg bg-secondary/50 py-2">
          <span className="text-xs font-medium text-muted-foreground uppercase">
            Protein
          </span>
          <span className="text-sm font-bold">{log.protein}g</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-secondary/50 py-2">
          <span className="text-xs font-medium text-muted-foreground uppercase">
            Carbs
          </span>
          <span className="text-sm font-bold">{log.carbs}g</span>
        </div>
        <div className="flex flex-col items-center rounded-lg bg-secondary/50 py-2">
          <span className="text-xs font-medium text-muted-foreground uppercase">
            Fats
          </span>
          <span className="text-sm font-bold">{log.fats}g</span>
        </div>
      </div>

      {realCalories !== log.calories && (
        <p className="mt-3 text-[10px] italic text-muted-foreground text-center">
          Calculated from macros: {realCalories} kcal
        </p>
      )}
    </div>
  );
};

export default async function FoodLogs({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const data = await getFoodLogbyDate(date);

  const meals = ["Breakfast", "Lunch", "Dinner", ""];

  return (
    <div className="min-h-screen bg-background text-foreground pb-12">
      {/* Header Section */}
      <header className="sticky top-0 z-10 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center max-w-2xl mx-auto px-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </Link>
          <h1 className="ml-4 text-xl font-semibold tracking-tight">
            {formatShortDate(date)}
          </h1>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 mt-8 flex flex-col gap-10">
        {meals.map((mealType) => {
          const filteredLogs = data.logs.filter(
            (x: FoodLog) => x.meal === mealType,
          );

          return (
            <section key={mealType} className="flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-border pb-2 justify-between">
                <div className="flex gap-2 items-center justify-center">
                  <Utensils className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-bold tracking-tight">
                    {mealType}
                  </h2>
                </div>
                <div>
                  <span className="ml-auto text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                    {filteredLogs.length} items
                  </span>
                  <span className="ml-auto text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                    {filteredLogs.calories} items
                  </span>
                </div>
              </div>

              <div className="grid gap-4">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log: FoodLog) => (
                    <FoodCard key={log._id} log={log} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 rounded-xl border  border-border bg-muted/30">
                    <p className="text-sm text-muted-foreground">
                      No {mealType} logged yet.
                    </p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
