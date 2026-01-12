import { readFile } from "fs/promises";
import { join } from "path";
import type { data as DataType } from "./data";

const DATA_FILE_PATH = join(process.cwd(), "public", "data.json");

export async function getData(): Promise<typeof DataType> {
  try {
    const fileContents = await readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(fileContents) as typeof DataType;
  } catch (error) {
    console.error("Error reading data.json:", error);
    // Fallback to static data if file read fails
    const { data } = await import("./data");
    return data;
  }
}

// For client-side usage (reads from public URL)
export async function getDataClient(): Promise<typeof DataType> {
  try {
    const response = await fetch("/data.json", {
      cache: "no-store", // Always fetch fresh data
    });
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json() as typeof DataType;
  } catch (error) {
    console.error("Error fetching data.json:", error);
    // Fallback to static data
    const { data } = await import("./data");
    return data;
  }
}
