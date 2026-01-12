import { NextRequest, NextResponse } from "next/server";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const DATA_FILE_PATH = join(process.cwd(), "public", "data.json");

// GET - Read data.json
export async function GET() {
  try {
    const fileContents = await readFile(DATA_FILE_PATH, "utf-8");
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading data.json:", error);
    return NextResponse.json(
      { error: "Failed to read data" },
      { status: 500 }
    );
  }
}

// POST - Update data.json
export async function POST(request: NextRequest) {
  try {
    // Basic authentication check
    const authHeader = request.headers.get("authorization");
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123"; // Default password for development
    
    if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
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

    // Write to file
    await writeFile(DATA_FILE_PATH, JSON.stringify(body, null, 2), "utf-8");
    
    return NextResponse.json({ success: true, message: "Data updated successfully" });
  } catch (error) {
    console.error("Error updating data.json:", error);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}
