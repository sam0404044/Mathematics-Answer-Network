import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { positiveInteger } from "@/lib/validation";

export async function POST(request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const questionCount = positiveInteger(body?.questionCount, 50);
  if (!questionCount) {
    return NextResponse.json({ error: "題數必須介於 1 到 50" }, { status: 400 });
  }

  try {
    const [rangeRows] = await db.query(
      "SELECT MAX(uid) AS max_uid, COUNT(*) AS total FROM questionForTest",
    );
    const maxUid = Number(rangeRows[0]?.max_uid || 0);
    const total = Number(rangeRows[0]?.total || 0);
    if (total === 0) return NextResponse.json({ questions: [] });
    const limit = Math.min(questionCount, total);
    const startUid = Math.floor(Math.random() * maxUid) + 1;
    const [firstRows] = await db.query(
      `SELECT uid, question, option_a, option_b, option_c, option_d, option_e,
              questionYear, type
       FROM questionForTest
       WHERE uid >= ?
       ORDER BY uid
       LIMIT ?`,
      [startUid, limit],
    );
    let rows = firstRows;
    if (rows.length < limit) {
      const [remainingRows] = await db.query(
        `SELECT uid, question, option_a, option_b, option_c, option_d, option_e,
                questionYear, type
         FROM questionForTest
         WHERE uid < ?
         ORDER BY uid
         LIMIT ?`,
        [startUid, limit - rows.length],
      );
      rows = rows.concat(remainingRows);
    }
    const questions = rows.map((question) => ({
      id: question.uid,
      question: question.question,
      options: [
        question.option_a,
        question.option_b,
        question.option_c,
        question.option_d,
        question.option_e,
      ].filter(Boolean),
      question_type: question.type,
      source: question.questionYear,
    }));
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("[Generate Quiz Error]", error);
    return NextResponse.json({ error: "題庫服務暫時無法使用" }, { status: 503 });
  }
}
