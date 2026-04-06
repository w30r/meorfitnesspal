import { getFoodLogbyDate } from "../actions";

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

export default async function Memain() {
  const data = await getFoodLogbyDate("2026-04-01");
  console.log("🚀 ~ Memain ~ data:", data);
  return (
    <div className="flex flex-col justify-center items-center py-12">
      <div>
        <h1 className="text-3xl font-bold mb-4">hello</h1>
      </div>

      <main className="flex flex-col gap-4">
        <h1 className=" px-2 py-1 w-1/3 text-center -mb-4 bg-primary text-black rounded-full">
          Breakfast
        </h1>
        {data.logs
          .filter((x: FoodLog) => x.meal === "Breakfast")
          .map((x: FoodLog) => (
            <div key={x._id}>
              <h1>{x.foodName}</h1>
              <p>🥐 {x.meal} </p>
              <p>{x.protein}g of Protein</p>
              <p>{x.carbs}g of Carbs</p>
              <p>{x.fats}g of Fats</p>
              <p>{x.calories} kcal</p>
              <p>
                Real calories: {x.protein * 4 + x.carbs * 4 + x.fats * 9} kcal
              </p>
              {x.calories === x.protein * 4 + x.carbs * 4 + x.fats * 9 ? (
                <p>✔ Correct</p>
              ) : (
                <p>❌ Incorrect</p>
              )}
            </div>
          ))}
        <h1 className=" px-2 py-1 w-1/3 text-center -mb-4 bg-primary text-black rounded-full">
          Lunch
        </h1>
        {data.logs
          .filter((x: FoodLog) => x.meal === "Lunch")
          .map((x: FoodLog) => (
            <div key={x._id}>
              <h1>{x.foodName}</h1>
              <p>🥐 {x.meal} </p>
              <p>{x.protein}g of Protein</p>
              <p>{x.carbs}g of Carbs</p>
              <p>{x.fats}g of Fats</p>
              <p>{x.calories} kcal</p>
              <p>
                Real calories: {x.protein * 4 + x.carbs * 4 + x.fats * 9} kcal
              </p>
              {x.calories === x.protein * 4 + x.carbs * 4 + x.fats * 9 ? (
                <p>✔ Correct</p>
              ) : (
                <p>❌ Incorrect</p>
              )}
            </div>
          ))}
        <h1 className=" px-2 py-1 w-1/3 text-center -mb-4 bg-primary text-black rounded-full">
          Dinner
        </h1>
        {data.logs
          .filter((x: FoodLog) => x.meal === "Dinner")
          .map((x: FoodLog) => (
            <div key={x._id}>
              <h1>{x.foodName}</h1>
              <p>🥐 {x.meal} </p>
              <p>{x.protein}g of Protein</p>
              <p>{x.carbs}g of Carbs</p>
              <p>{x.fats}g of Fats</p>
              <p>{x.calories} kcal</p>
              <p>
                Real calories: {x.protein * 4 + x.carbs * 4 + x.fats * 9} kcal
              </p>
              {x.calories === x.protein * 4 + x.carbs * 4 + x.fats * 9 ? (
                <p>✔ Correct</p>
              ) : (
                <p>❌ Incorrect</p>
              )}
            </div>
          ))}
      </main>

      <div>
        {data.logs.reduce((acc: number, item: FoodLog) => acc + item.carbs, 0)}
      </div>
    </div>
  );
}
