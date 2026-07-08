import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function POST() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  try {
    const [records] = await db.query(
      `SELECT id, username, email, grade, school, gender, status,
              plan_status, points, last_login
       FROM user_info
       WHERE id = ?
       LIMIT 1`,
      [session.uid],
    );
    return NextResponse.json({ question_record: records });
  } catch (error) {
    console.error("[Get User Error]", error);
    return NextResponse.json({ error: "服務暫時無法使用" }, { status: 503 });
  }
}
