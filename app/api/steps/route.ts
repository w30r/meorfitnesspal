import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const stepsApiKey = process.env.STEPS_API_KEY;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

const client = new MongoClient(uri);

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.slice(7) !== stepsApiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, steps } = body;

    if (!username || !Array.isArray(steps) || steps.length === 0) {
      return NextResponse.json({ error: "Body must include 'username' (string) and 'steps' (non-empty array)" }, { status: 400 });
    }

    for (const entry of steps) {
      if (typeof entry.Steps !== "number" || typeof entry.Date !== "string") {
        return NextResponse.json(
          { error: "Each step entry must have 'Steps' (number) and 'Date' (string, YYYY-MM-DD)" },
          { status: 400 },
        );
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.Date)) {
        return NextResponse.json({ error: `Invalid date format: ${entry.Date}. Use YYYY-MM-DD.` }, { status: 400 });
      }
    }

    await client.connect();
    const db = client.db("meorfitnesspal");

    const user = await db.collection("user").findOne({ username });
    if (!user) {
      return NextResponse.json({ error: `User '${username}' not found` }, { status: 404 });
    }

    const userId = (user as any).id;

    let upsertedCount = 0;
    for (const entry of steps) {
      await db.collection("stepslog").updateOne(
        { userId, date: entry.Date },
        { $set: { steps: entry.Steps, date: entry.Date, userId, updatedAt: new Date() } },
        { upsert: true },
      );
      upsertedCount++;
    }

    return NextResponse.json({ success: true, count: upsertedCount }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit steps", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
