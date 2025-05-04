import { NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT UID, questionYear FROM questionForTest"
    );
    return NextResponse.json({ questions: rows }); // ✅ 回傳格式符合前端期待
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
