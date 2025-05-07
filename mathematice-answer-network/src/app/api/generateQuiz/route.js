// /app/api/generateQuiz/route.js
import { NextResponse } from "next/server";
import db from "@/lib/db"; // 資料庫連線模組

export async function POST(request) {
  try {
    const body = await request.json();
    const { questionCount } = body;

    if (!questionCount || isNaN(questionCount)) {
      return NextResponse.json({ message: "題數無效" }, { status: 400 });
    }

    const [rows] = await db.query(
      `SELECT id, question, option_a, option_b, option_c, option_d, option_e,
              type, image, answer, explanation, questionYear
       FROM questionForTest
       ORDER BY RAND()
       LIMIT ?`,
      [questionCount]
    );

    const formatted = rows.map((row) => ({
      id: row.id,
      question: row.question,
      options: [
        row.option_a,
        row.option_b,
        row.option_c,
        row.option_d,
        row.option_e,
      ].filter(Boolean), // 避免 null 選項
      type: row.type,
      image: row.image,
      answer: row.answer,
      explanation: row.explanation,
      year: row.questionYear,
    }));

    return NextResponse.json({
      message: "題目產生成功",
      questions: formatted,
    });
  } catch (error) {
    console.error("❌ 後端錯誤：", error);
    return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
  }
}
