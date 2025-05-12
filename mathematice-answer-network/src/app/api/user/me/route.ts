import { NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";
import pool from "@/lib/db";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const uid = cookieHeader
      .split(";")
      .map((cur) => cur.trim())
      .find((cur) => cur.startsWith("local_login="))
      ?.split("=")[1];

    console.log("UID from cookie:", uid);

    if (!uid) return NextResponse.json({ success: false });

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT username FROM user_info WHERE id = ?",
      [uid]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ success: false });
    }

    return NextResponse.json({
      success: true,
      username: rows[0].username,
      uid: uid,
    });
  } catch (error) {
    console.error("API /user/me failed:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
