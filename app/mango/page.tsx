import { fetchData } from "../lib/mongodb";

export default async function page() {
  try {
    // Fetch data from the 'prospect' collection in the 'test' database
    const data = await fetchData("prospect");

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
          Prospects
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item: any, index: number) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-bold mb-4">{item.name}</h3>
              <div className="flex items-center mb-4">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded mr-2 ${
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
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Registered By: {item.registered_by}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Registered At: {item.registered_at}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch data", error);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
          Error fetching data
        </h1>
      </div>
    );
  }
}
