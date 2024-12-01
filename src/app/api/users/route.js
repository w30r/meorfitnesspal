import connect2Mongo from "@/app/libs/connect";
import User from "@/app/models/Users";
import { NextResponse } from "next/server";

export async function GET() {
  connect2Mongo();
  const users = await User.find();
  return NextResponse.json(users);
}
