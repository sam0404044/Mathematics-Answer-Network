import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { questionCount } = body;

    const [rows] = await db.query(
      `SELECT id, question, options, answer, explanation FROM questions_all_in_one ORDER BY RAND() LIMIT ?`,
      [questionCount]
    );

    console.log(`✅ 撈到的題目共 ${rows.length} 題：`, rows); // 👈 顯示數量

    return NextResponse.json({
      message: "題目已從資料庫產生",
      questions: rows,
    });
  } catch (err) {
    console.error("❌ 後端錯誤：", err);
    return NextResponse.json({ message: "伺服器錯誤" }, { status: 500 });
  }
}
