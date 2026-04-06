import { ProgressCircle } from "@heroui/react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function KadUtama(props: {
  k?: number;
  p?: number;
  c?: number;
  f?: number;
  kgoal?: number;
  pgoal?: number;
  cgoal?: number;
  fgoal?: number;
  date?: string;
}) {
  const { k, p, c, f, kgoal, pgoal, cgoal, fgoal, date } = props;

  return (
    <div className="uppercase bg-primary p-8 rounded-xl shadow-lg min-w-full h-auto text-background">
      <Link href={`/foodlogs/${date}`}>
        <div className="bg-pink-400/0 flex justify-around w-full lowercase">
          {/* PROTEIN CIRCLE */}
          <div className="flex flex-col items-center justify-center text-center w-1/3 ">
            <ProgressCircle
              aria-label="Protein"
              value={p && pgoal ? (p / pgoal) * 100 : 0}
              size="lg"
              color="success"
              className=""
            >
              <ProgressCircle.Track className="size-12">
                <ProgressCircle.TrackCircle className="stroke-background/50" />
                <ProgressCircle.FillCircle />
              </ProgressCircle.Track>
            </ProgressCircle>
            <p className="text-background w-full mt-2 uppercase">Protein</p>
            <p className="text-background/50 w-full">
              {p && pgoal ? ((p / pgoal) * 100).toFixed(2) : 0}%
            </p>
            <p className="text-background w-full">{p} g</p>
          </div>
          {/* CARBS CIRCLE */}
          <div className="flex flex-col items-center justify-center text-center w-1/3">
            <ProgressCircle
              aria-label="Carbs"
              value={c && cgoal ? (c / cgoal) * 100 : 0}
              size="lg"
              color="danger"
            >
              <ProgressCircle.Track className="size-12">
                <ProgressCircle.TrackCircle className="stroke-background/50" />
                <ProgressCircle.FillCircle />
              </ProgressCircle.Track>
            </ProgressCircle>
            <p className="text-background w-full mt-2 uppercase">Carbs</p>
            <p
              className={
                c && cgoal
                  ? cn("text-background/50 w-full", {
                      "text-red-500": (c / cgoal) * 100 > 100,
                    })
                  : "text-background/50 w-full"
              }
            >
              {c && cgoal ? ((c / cgoal) * 100).toFixed(2) : 0}%
            </p>
            <p className="text-background w-full">{c} g</p>
          </div>
          {/* FATS CIRCLE */}
          <div className="flex flex-col items-center justify-center text-center w-1/3">
            <ProgressCircle
              aria-label="Fats"
              value={f && fgoal ? (f / fgoal) * 100 : 0}
              size="lg"
              color="warning"
            >
              <ProgressCircle.Track className="size-12">
                <ProgressCircle.TrackCircle className="stroke-background/50" />
                <ProgressCircle.FillCircle />
              </ProgressCircle.Track>
            </ProgressCircle>
            <p className="text-background w-full mt-2 uppercase">Fats</p>
            <p
              className={
                f && fgoal
                  ? cn("text-background/50 w-full", {
                      "text-yellow-500": (f / fgoal) * 100 > 100,
                    })
                  : "text-background/50 w-full"
              }
            >
              {f && fgoal ? ((f / fgoal) * 100).toFixed(2) : 0}%
            </p>
            <p className="text-background w-full">{f} g</p>
          </div>
        </div>
      </Link>
      {/* <div className="flex flex-col items-center pt-8 ">
        {totalCalories ? (
          <ProgressBar
            aria-label="Loading"
            className="w-64"
            value={
              totalCaloriesValue === 1
                ? 0
                : (totalCaloriesValue / parseFloat(goalData.calories)) * 100
            }
            color="default"
            size="lg"
          >
            <Label>
              <p>Calories</p>
              <p className="text-xs lowercase">
                {totalCaloriesValue} kcal / {goalData.calories} kcal{" "}
              </p>
              <p className="text-xs lowercase">
                {goalData.calories - totalCaloriesValue} kcal left
              </p>
            </Label>
            <ProgressBar.Output />
            <ProgressBar.Track>
              <ProgressBar.Fill />
            </ProgressBar.Track>
          </ProgressBar>
        ) : (
          <p>0kcal / {goalData.calories}kcal</p>
        )}
      </div> */}
    </div>
  );
}
