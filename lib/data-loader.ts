import { readFile } from "fs/promises";
import { join } from "path";

const DATA_FILE_PATH = join(process.cwd(), "public", "data.json");

export async function getData() {
  try {
    const fileContents = await readFile(DATA_FILE_PATH, "utf-8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error reading data.json:", error);
    // Fallback to static data if file read fails
    const { data } = await import("./data");
    return data;
  }
}

// For client-side usage (reads from public URL)
export async function getDataClient() {
  try {
    const response = await fetch("/data.json", {
      cache: "no-store", // Always fetch fresh data
    });
    if (!response.ok) throw new Error("Failed to fetch data");
    return await response.json();
  } catch (error) {
    console.error("Error fetching data.json:", error);
    // Fallback to static data
    const { data } = await import("./data");
    return data;
  }
}
