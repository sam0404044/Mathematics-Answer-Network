import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { positiveInteger } from "@/lib/validation";

export async function POST(req) {
  const session = await getSessionUser();
  if (!session) return NextResponse.json({ error: "未登入" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const questionId = positiveInteger(body?.questionId);
  if (!questionId) {
    return NextResponse.json({ error: "題目編號無效" }, { status: 400 });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();
    const [users] = await connection.query(
      "SELECT plan_status, points FROM user_info WHERE id = ? FOR UPDATE",
      [session.uid],
    );
    if (!users[0]) {
      await connection.rollback();
      return NextResponse.json({ error: "查無此用戶" }, { status: 404 });
    }

    const isSubscriber = Number(users[0].plan_status) === 2;
    if (!isSubscriber && Number(users[0].points) <= 0) {
      await connection.rollback();
      return NextResponse.json({
        status: { cost: false, solution: [] },
      });
    }

    const [solution] = await connection.query(
      "SELECT uid, explanation FROM questionForTest WHERE uid = ? LIMIT 1",
      [questionId],
    );
    if (!solution[0]) {
      await connection.rollback();
      return NextResponse.json({ error: "查無此題目" }, { status: 404 });
    }

    if (!isSubscriber) {
      await connection.query(
        "UPDATE user_info SET points = points - 1 WHERE id = ? AND points > 0",
        [session.uid],
      );
    }
    await connection.commit();
    return NextResponse.json({
      status: { cost: !isSubscriber, solution },
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("[Get Solution Error]", error);
    return NextResponse.json({ error: "解答服務暫時無法使用" }, { status: 503 });
  } finally {
    connection?.release();
  }
}
