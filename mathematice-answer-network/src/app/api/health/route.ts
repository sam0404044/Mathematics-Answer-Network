import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const missing = [
    "DATABASE_USER",
    "DATABASE_PASSWORD",
    "DATABASE_NAME",
    "JWT_SECRET",
  ].filter((key) => !process.env[key]);

  if (missing.length > 0) {
    return NextResponse.json(
      { status: "unhealthy", database: "not_checked", configuration: "incomplete" },
      { status: 503 },
    );
  }

  try {
    await db.query("SELECT 1");
    return NextResponse.json({
      status: "healthy",
      database: "connected",
      configuration: "ready",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Health Check Error]", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected",
        configuration: "ready",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
