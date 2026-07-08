import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { cleanText } from "@/lib/validation";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ year: string }> },
) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { year: rawYear } = await params;
  const year = cleanText(rawYear, { max: 50 });
  if (!year) {
    return NextResponse.json({ error: "題庫範圍無效" }, { status: 400 });
  }

  try {
    const [rows] = await db.query(
      `SELECT uid, question, option_a, option_b, option_c, option_d, option_e,
              questionYear, type
       FROM questionForTest
       WHERE questionYear = ?`,
      [year],
    );
    return NextResponse.json({ questions: rows });
  } catch (error) {
    console.error("[Quiz Lookup Error]", error);
    return NextResponse.json({ error: "題庫服務暫時無法使用" }, { status: 503 });
  }
}
