import type { data as DataType } from "./data";

const DATA_KEY = "portfolio_data";

// Helper to get Redis client
async function getRedisClient() {
  try {
    const { Redis } = await import("@upstash/redis");
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  } catch (error) {
    console.error("Upstash Redis not available:", error);
    throw new Error(
      "Redis configuration missing. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN"
    );
  }
}

export async function getData(): Promise<typeof DataType> {
  try {
    const redis = await getRedisClient();
    const data = await redis.get(DATA_KEY);

    if (!data) {
      throw new Error("No data found in Redis");
    }

    return data as typeof DataType;
  } catch (error) {
    console.error("Error reading from Redis:", error);
    // Fallback to static data if Redis fails
    const { data } = await import("./data");
    return data;
  }
}

// For client-side usage (reads from API endpoint)
export async function getDataClient(): Promise<typeof DataType> {
  try {
    const response = await fetch("/api/data", {
      cache: "no-store", // Always fetch fresh data
    });
    if (!response.ok) throw new Error("Failed to fetch data");
    return (await response.json()) as typeof DataType;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    // Fallback to static data
    const { data } = await import("./data");
    return data;
  }
}
