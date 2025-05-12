import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const loginData = cookieStore.get("login_data");

  if (!loginData || !loginData.value) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    const parsed = JSON.parse(loginData.value);
    const { uid } = parsed;

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT username, email FROM user_info WHERE id = ?",
      [uid]
    );
    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "查無此用戶" },
        { status: 404 }
      );
    }

    console.log(rows);
    const { username, email } = rows[0];

    return NextResponse.json({
      success: true,
      uid,
      username,
      email,
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
