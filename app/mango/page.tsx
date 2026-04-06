import { fetchData } from "../lib/mongodb";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import InitialsCircle from "@/components/ui/initials-circle";
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";

export default async function page() {
  try {
    // Fetch data from the 'prospect' collection in the 'test' database
    const data = await fetchData("prospect");

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-12">
        <div className="flex justify-between items-center mb-8 gap-4">
          <Link href="/">
            <Button
              variant="default"
              className="rounded-full w-12 hover:bg-gray-200 hover:text-black"
            >
              <IoArrowBack />
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Prospects</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item: any, index: number) => (
            <Card
              key={index}
              className="bg-black/20 shadow-md hover:shadow-lg hover:scale-105 transform-all duration-200 ease-in-out"
            >
              <CardHeader>
                <CardTitle className="font-bold font-sans -mb-8 flex justify-between">
                  <div>{item.name}</div>
                  <div className="flex items-center mb-4">
                    <span
                      className={`rounded-full inline-block px-3 py-1 text-xs font-semibold mr-2 ${
                        item.status === "approved"
                          ? "bg-green-500 text-white"
                          : item.status === "pending"
                            ? "bg-yellow-500 text-white"
                            : item.status === "rejected"
                              ? "bg-red-500 text-white"
                              : "bg-gray-300 text-gray-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {item.country}, {item.region}, {item.block_name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Play Name: {item.play_name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Short Name: {item.short_name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Submission Year: {item.submission_year}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Existence Kind: {item.existence_kind}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center scale-90">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {format(new Date(item.registered_at), "dd/MM/yyyy")}
                  </p>
                </div>
                <InitialsCircle
                  initials={item.registered_by
                    .split(" ")
                    .map((name: any[]) => name[0])
                    .join("")}
                />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch data", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <h1 className="text-4xl font-bold mb-8 text-foreground">
          Error fetching data
        </h1>
      </div>
    );
  }
}
