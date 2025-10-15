import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const STRATEGY_FILE = path.join(process.cwd(), "data", "strategies.json");

export async function GET() {
  try {
    const data = fs.readFileSync(STRATEGY_FILE, "utf8");
    const strategies = JSON.parse(data);
    return NextResponse.json(strategies);
  } catch (err) {
    console.error("Error reading strategies:", err);
    return NextResponse.json([], { status: 500 });
  }
}

