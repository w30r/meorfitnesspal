export default function MealContent({ food }) {
  return (
    <div
      id="MEAL-CONTENT"
      className="bg-white px-4 py-2 rounded-b-xl outline-1 outline outline-black/10 shadow-md mb-4"
    >
      {food.map((item) => (
        <div className="mb-2">
          <div
            key={item.name}
            className="mt-1 flex justify-between items-center"
          >
            <h1 className="font-semibold text-xs">{item.name}</h1>
            <h1 className="font-light text-xs">{item.calories} cals</h1>
          </div>
          <h1 className="font-light text-xs">{item.calories} cals</h1>
        </div>
      ))}
    </div>
  );
}
