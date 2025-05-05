import { NextRequest, NextResponse } from "next/server";
import db from "@/app/lib/db";

export async function GET(
  request: NextRequest,
  context: { params: { year: string } }
) {
  const year = context.params.year;

  try {
    const [rows] = await db.query(
      "SELECT * FROM questionForTest WHERE questionYear   = ?",
      [year]
    );
    return NextResponse.json({ questions: rows }); // ✅ 回傳格式符合前端期待
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
