import { NextResponse } from "next/server";
import db from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ plan_status: 0, points: 0 }, { status: 401 });
  }

  try {
    const [rows] = await db.query(
      "SELECT plan_status, points FROM user_info WHERE id = ? LIMIT 1",
      [session.uid],
    );
    if (!rows[0]) {
      return NextResponse.json({ plan_status: 0, points: 0 }, { status: 404 });
    }
    return NextResponse.json({
      plan_status: Number(rows[0].plan_status || 0),
      points: Number(rows[0].points || 0),
    });
  } catch (error) {
    console.error("[Plan Status Error]", error);
    return NextResponse.json({ error: "服務暫時無法使用" }, { status: 503 });
  }
}
