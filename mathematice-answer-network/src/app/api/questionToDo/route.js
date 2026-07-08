import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST(req) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "未登入" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const column = Number(body.mode) === 3 ? "wrong_question_set" : "score_now";
  try {
    const [records] = await db.query(
      `SELECT ${column} FROM user_score_status WHERE userid = ?`,
      [session.uid],
    );
    return NextResponse.json({ question_record: records });
  } catch (error) {
    console.error("[Question To Do Error]", error);
    return NextResponse.json({ error: "服務暫時無法使用" }, { status: 503 });
  }
}
