import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const apiKey = process.env.STEPS_API_KEY;

let client: MongoClient;

function getClient(): MongoClient {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }
  if (!client) {
    client = new MongoClient(uri);
  }
  return client;
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.slice(7) !== apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { username, entries } = body;

    if (!username || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: "Body must include 'username' (string) and 'entries' (non-empty array)" }, { status: 400 });
    }

    for (const entry of entries) {
      if (!entry.Date || !/^\d{4}-\d{2}-\d{2}$/.test(entry.Date)) {
        return NextResponse.json({ error: `Invalid or missing 'Date' — expected YYYY-MM-DD` }, { status: 400 });
      }
    }

    await getClient().connect();
    const db = getClient().db("meorfitnesspal");

    const user = await db.collection("user").findOne({ username });
    if (!user) {
      return NextResponse.json({ error: `User '${username}' not found` }, { status: 404 });
    }

    const userId = (user as any)._id.toString();

    let stepsCount = 0;
    let energyCount = 0;

    const updates: Promise<any>[] = [];

    for (const entry of entries) {
      const date = entry.Date;

      if (entry.Steps !== undefined) {
        if (typeof entry.Steps !== "number") {
          return NextResponse.json({ error: "'Steps' must be a number" }, { status: 400 });
        }
        updates.push(
          db.collection("stepslog").updateOne(
            { userId, date },
            { $set: { steps: entry.Steps, date, userId, updatedAt: new Date() } },
            { upsert: true },
          ),
        );
        stepsCount++;
      }

      if (entry.ActiveEnergy !== undefined || entry.RestingEnergy !== undefined) {
        const activeEnergy = typeof entry.ActiveEnergy === "number" ? entry.ActiveEnergy : 0;
        const restingEnergy = typeof entry.RestingEnergy === "number" ? entry.RestingEnergy : 0;

        updates.push(
          db.collection("energylog").updateOne(
            { userId, date },
            {
              $set: { activeEnergy, restingEnergy, date, userId, updatedAt: new Date() },
              $setOnInsert: {},
            },
            { upsert: true },
          ),
        );
        energyCount++;
      }
    }

    await Promise.all(updates);

    return NextResponse.json({ success: true, stepsCount, energyCount }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit activity data", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
