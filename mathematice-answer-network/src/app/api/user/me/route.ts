import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import pool from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT username, email FROM user_info WHERE id = ? LIMIT 1",
      [session.uid],
    );
    if (!rows[0]) {
      return NextResponse.json(
        { success: false, message: "查無此用戶" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      uid: session.uid,
      username: rows[0].username,
      email: rows[0].email,
    });
  } catch (error) {
    console.error("[Current User Error]", error);
    return NextResponse.json(
      { success: false, message: "使用者服務暫時無法使用" },
      { status: 503 },
    );
  }
}
