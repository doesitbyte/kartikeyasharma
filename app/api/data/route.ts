import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const DATA_KEY = "portfolio_data";

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// GET - Read data from Upstash Redis
export async function GET() {
  try {
    const data = await redis.get(DATA_KEY);
    if (!data) {
      return NextResponse.json(
        { error: "No data found in Redis" },
        { status: 404 }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading from Redis:", error);
    return NextResponse.json(
      { error: "Failed to read data from Redis" },
      { status: 500 }
    );
  }
}

// POST - Update data in Upstash Redis
export async function POST(request: NextRequest) {
  try {
    // Basic authentication check
    const authHeader = request.headers.get("authorization");
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Allow empty body for auth check
    if (Object.keys(body).length === 0) {
      return NextResponse.json({ success: true, message: "Authenticated" });
    }

    // Validate that body is an object
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 }
      );
    }

    // Write to Upstash Redis
    await redis.set(DATA_KEY, body);
    return NextResponse.json({
      success: true,
      message: "Data updated successfully",
    });
  } catch (error) {
    console.error("Error updating data in Redis:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to update data: ${errorMessage}` },
      { status: 500 }
    );
  }
}
