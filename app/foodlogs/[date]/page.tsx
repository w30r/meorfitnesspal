import { getFoodLogbyDate } from "@/app/actions";
import Link from "next/link";

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

export default async function FoodLogs({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params; // 2. Await the params here
  const data = await getFoodLogbyDate(date);
  return (
    <div className="flex flex-col items-center justify-center my-8">
      <header className="mb-4">
        <Link href="/">Back</Link>
        <h1 className="text-3xl">{formatShortDate(date)}</h1>
      </header>

      <main className="flex flex-col gap-4">
        {data.logs.map((x: FoodLog) => (
          <div key={x._id} className="bg-primary text-black p-6 rounded-xl">
            <h2>{x.foodName}</h2>
            <p>🥐 {x.meal} </p>
            <p>{x.protein}g of Protein</p>
            <p>{x.carbs}g of Carbs</p>
            <p>{x.fats}g of Fats</p>
            <p>{x.calories} kcal</p>
            <p>
              Real calories: {x.protein * 4 + x.carbs * 4 + x.fats * 9} kcal
            </p>
          </div>
        ))}
      </main>
    </div>
  );
}
