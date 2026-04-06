import React from 'react';

export const FoodLawgs = () => {
  // Code from lines 91-169 of page.tsx
  const [today, setToday] = useState(new Date());
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalProtein, setTotalProtein] = useState(0);
  const [totalCarbs, setTotalCarbs] = useState(0);
  const [totalFats, setTotalFats] = useState(0);
  const [currentFoodLogs, setCurrentFoodLogs] = useState([]);
  const [goalData, setGoalData] = useState({});

  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      const totalCalories = await getTotalCaloriesByDate(formatDate(today));
      const totalProtein = await getTotalProteinByDate(formatDate(today));
      const totalCarbs = await getTotalCarbsByDate(formatDate(today));
      const totalFats = await getTotalFatsByDate(formatDate(today));
      const todayfoodlogs = await getTodaysFoodLog();
      const goalData = await getGoalData();

      setTotalCalories(totalCalories);
      setTotalProtein(totalProtein);
      setTotalCarbs(totalCarbs);
      setTotalFats(totalFats);
      setCurrentFoodLogs(todayfoodlogs);
      setGoalData(goalData);
    };

    fetchData();
  }, [today]);

  const { calories, carbs, fats, protein } = goalData;

  // Check if totalCalories, totalProtein, totalCarbs, and totalFats are defined
  const totalProteinValue = totalProtein[0]?.totalProtein ?? 0;
  const totalCarbsValue = totalCarbs[0]?.totalCarbs ?? 0;
  const totalFatsValue = totalFats[0]?.totalFats ?? 0;

  // onNextDay
  const onNextDay = async () => {
    const formattedDate = tomorrow.toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    setCurrentDate(formattedDate);
  };

  // onPreviousDay
  const onPreviousDay = async () => {
    const formattedDate = yesterday.toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    setCurrentDate(formattedDate);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-background py-20 px-8">
      <header className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
        MeorFitnessPal
      </header>
      <div className="mb-4 flex items-center justify-between min-w-screen px-8 h-4">
        {/* Go to previous day */}
        <Button variant="outline" onClick={onPreviousDay}>
          <h1>{"<"}</h1>
        </Button>
        <h1>{today.toISOString().split("T")[0]}</h1>
        {/* Go to next day */}
        <Button variant="outline" onClick={onNextDay}>
          <h1>{">"}</h1>
        </Button>
      </div>

      {/* <KadUtama /> */}

      <div className="uppercase bg-secondary-foreground p-8 rounded-lg shadow-lg w-full h-auto text-black mt-4">
        {/* BREAKFAST */}
        {currentFoodLogs.length > 0 ? (
          <div>
            <h2 className="text-lg font-bold">Breakfast</h2>
            {currentFoodLogs
              .filter((log: { meal: string }) => log.meal === "Breakfast")
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((x: any) => (
                <div
                  className="flex flex-col items-between justify-center bg-primary-foreground text-secondary-foreground rounded-xl px-2 py-1 font-bold"
                  key={x._id}
                >
                  <h1>{x.foodName}</h1>
                  <h1>
                    <span className="text-success">{x.protein}P</span>/
                    <span className="text-destructive">{x.carbs}C</span>/
                    <span className="text-warning">{x.fats}F</span>
                  </h1>
                  <p>({x.calories} kcal)</p>
                </div>
              ))}
          </div>
        ) : (
          <></>
        )}
        {/* LUNCH */}
        {currentFoodLogs.length > 0 ? (
          <div>
            <h2 className="text-lg font-bold">Lunch</h2>
            {currentFoodLogs
              .filter((log: { meal: string }) => log.meal === "Lunch")
              .map((x: any) => (
                <div
                  className="flex  bg-primary-foreground text-secondary-foreground rounded-xl px-2 py-1 font-bold"
                  key={x._id}
                >
                  <div className="flex justify-between">
                    <h1>{x.foodName}</h1>
                    <p>
                      <span className="text-success">{x.protein}P</span>/
                      <span className="text-destructive">{x.carbs}C</span>/
                      <span className="text-warning">{x.fats}F</span>
                    </p>
                  </div>
                  <p>{x.calories} kcal</p>
                </div>
              ))}
          </div>
        ) : (
          <></>
        )}
        {/* DINNER */}
        {currentFoodLogs.length > 0 ? (
          <div>
            <h2 className="text-lg font-bold">Dinner</h2>
            {currentFoodLogs
              .filter((log: { meal: string }) => log.meal === "Dinner")
              .map((x: any) => (
                <div
                  className="flex  bg-primary-foreground text-secondary-foreground rounded-xl px-2 py-1 font-bold"
                  key={x._id}
                >
                  <div className="flex justify-between">
                    <h1>{x.foodName}</h1>
                    <p>
                      <span className="text-success">{x.protein}P</span>/
                      <span className="text-destructive">{x.carbs}C</span>/
                      <span className="text-warning">{x.fats}F</span>
                    </p>
                  </div>
                  <p>{x.calories} kcal</p>
                </div>
              ))}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="flex space-x-4 mt-8">
        <Link href="/logfood">
          <Button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">
            Log Food
          </Button>
        </Link>
        <Link href="/goals">
          <Button variant="outline">Set Goals</Button>
        </Link>
      </div>
    </div>
  );
};
