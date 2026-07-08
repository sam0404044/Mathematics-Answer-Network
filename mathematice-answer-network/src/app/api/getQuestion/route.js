import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { integerArray } from "@/lib/validation";

function collectQuestionIds(value, result = new Set()) {
  if (typeof value === "string") {
    try {
      return collectQuestionIds(JSON.parse(value), result);
    } catch {
      return result;
    }
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectQuestionIds(item, result));
  } else if (value && typeof value === "object") {
    if (Number.isInteger(Number(value.uid))) result.add(Number(value.uid));
    Object.values(value).forEach((item) => collectQuestionIds(item, result));
  }
  return result;
}

export async function POST(req) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const questionIds = integerArray(body?.question_id, 100);
  if (!questionIds) {
    return NextResponse.json({ error: "題目編號無效" }, { status: 400 });
  }

  try {
    const [statusRows] = await db.query(
      `SELECT score_now, last_quiz, last_review, last_set, wrong_question_set
       FROM user_score_status
       WHERE userid = ?
       LIMIT 1`,
      [session.uid],
    );
    const allowedIds = collectQuestionIds(statusRows[0] || {});
    if (questionIds.some((id) => !allowedIds.has(id))) {
      return NextResponse.json({ error: "無權讀取此題目" }, { status: 403 });
    }

    const [questions] = await db.query(
      `SELECT uid, question, option_a, option_b, option_c, option_d, option_e,
              answer, explanation, questionYear, type
       FROM questionForTest
       WHERE uid IN (?)`,
      [questionIds],
    );
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("[Question Lookup Error]", error);
    return NextResponse.json({ error: "題庫服務暫時無法使用" }, { status: 503 });
  }
}
