import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = await cookies();
  const loginData = cookieStore.get("login_data");

  if (!loginData || !loginData.value) {
    return NextResponse.json({ success: false }, { status: 401 });
  }
  try {
    const decode = jwt.verify(loginData.value, process.env.JWT_SECRET!) as {
      uid: number;
      method: string;
    };
    const { uid } = decode;

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

    const { username, email } = rows[0];

    return NextResponse.json({
      success: true,
      uid,
      username,
      email,
    });
  } catch (err) {
    console.error("JWT error:", err);
    return NextResponse.json(
      { success: false, message: "Token 無效或過期" },
      { status: 401 }
    );
  }
}
