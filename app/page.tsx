// app/page.tsx

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-white">
        Welcome to MyFitnessPal Clone
      </h1>
      <div className="flex space-x-4">
        <Link href="/cibai">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">
            Go to Log Page
          </button>
        </Link>
        <Link href="/goals">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">
            Set Goals
          </button>
        </Link>
        <Link href="/mango">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">
            mango
          </button>
        </Link>
      </div>
    </div>
  );
}
