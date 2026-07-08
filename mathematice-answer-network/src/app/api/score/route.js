import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST() {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "未登入" }, { status: 401 });

  try {
    await db.query("INSERT IGNORE INTO user_score_status (userid) VALUES (?)", [
      session.uid,
    ]);
    const [records] = await db.query(
      "SELECT status, score_now, last_quiz, last_review, last_set FROM user_score_status WHERE userid = ?",
      [session.uid],
    );
    return NextResponse.json({ question_record: records });
  } catch (error) {
    console.error("[Score Error]", error);
    return NextResponse.json({ error: "服務暫時無法使用" }, { status: 503 });
  }
}
