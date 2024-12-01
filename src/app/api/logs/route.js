import connect2Mongo from "@/app/libs/connect";
import Logs from "@/app/models/Logs";
import { NextResponse } from "next/server";

export async function GET() {
  connect2Mongo();
  const logs = await Logs.find();
  return NextResponse.json(logs);
}
export async function POST() {
  connect2Mongo();
}
