// ✅ 後端 /app/api/generateQuiz/route.js
import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { questionCount } = body;

    const [rows] = await db.query(
      `SELECT uid, question, option_a, option_b, option_c, option_d, option_e, answer, explanation,questionYear,type
       FROM questionForTest
       ORDER BY RAND()
       LIMIT ?`,
      [questionCount]
    );

    const questions = rows.map((q) => ({
      id: q.uid,
      question: q.question,
      options: [
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.option_e,
      ].filter(Boolean),
      answer: q.answer,
      explanation: q.explanation,
      question_type: q.type,
      source: q.questionYear,
    }));

    console.log("✅ 整理後題目：", questions);

    return NextResponse.json({
      message: "題目已從資料庫產生",
      questions,
    });
  } catch (err) {
    console.error("❌ 後端錯誤：", err);
    return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
  }
}
