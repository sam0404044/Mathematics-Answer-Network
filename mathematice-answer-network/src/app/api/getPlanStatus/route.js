// app/api/getPlanStatus/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db"; // 你自訂的 MySQL 或 SQLite 連線工具

export async function GET() {
  const cookieStore = cookies();
  const userId = cookieStore.get("")?.value;

  // ✅ 未登入情況
  if (!userId) {
    return NextResponse.json({
      plan_status: 0,
      points: 0,
    });
  }

  try {
    // ✅ 查詢資料庫
    const [rows] = await db.query(
      "SELECT plan_status, points FROM user_info WHERE id = ? LIMIT 1",
      [userId]
    );

    if (rows.length === 0) {
      // 找不到會員
      return NextResponse.json({ plan_status: 0, points: 0 });
    }

    const { plan_status, points } = rows[0];

    return NextResponse.json({
      plan_status,
      points,
    });
  } catch (err) {
    console.error("❌ 查詢失敗：", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
