import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { answersEqual, normalizeAnswer } from "@/lib/quiz";
import { positiveInteger } from "@/lib/validation";

export async function POST(req) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "未登入" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const submitted = body?.answer?.answer_info;
  const costTime = positiveInteger(body?.cost_time, 24 * 60 * 60) ?? 0;
  if (!Array.isArray(submitted) || submitted.length === 0 || submitted.length > 100) {
    return NextResponse.json({ error: "複習資料格式無效" }, { status: 400 });
  }
  const ids = submitted.map((item) => positiveInteger(item?.uid));
  if (ids.some((id) => !id)) {
    return NextResponse.json({ error: "題目編號無效" }, { status: 400 });
  }

  try {
    const [questions] = await db.query(
      "SELECT uid, answer FROM questionForTest WHERE uid IN (?)",
      [ids],
    );
    const answers = new Map(
      questions.map((question) => [Number(question.uid), normalizeAnswer(question.answer)]),
    );
    if (answers.size !== ids.length) {
      return NextResponse.json({ error: "部分題目不存在" }, { status: 400 });
    }
    const answerInfo = submitted.map((item) => ({
      uid: Number(item.uid),
      answer: normalizeAnswer(item.answer),
      right_answer: answers.get(Number(item.uid)),
    }));
    const review = {
      has_review: true,
      solve_status: answerInfo.every((item) =>
        answersEqual(item.answer, item.right_answer),
      ),
      answer_info: answerInfo,
      cost_time: costTime,
    };
    await db.query(
      `UPDATE user_answer_record
       SET answer_review = ?
       WHERE userid = ?
       ORDER BY time DESC
       LIMIT 1`,
      [JSON.stringify(review), session.uid],
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Quiz Review Error]", error);
    return NextResponse.json({ error: "複習資料儲存失敗" }, { status: 503 });
  }
}
