import pool from "@/lib/db";
import { NextResponse } from "next/server";
import type { RowDataPacket } from "mysql2";
import { cleanEmail } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (isRateLimited(req, "check-email", 30, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "請求過於頻繁" }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const email = cleanEmail(body?.email);
  if (!email) return NextResponse.json({ error: "Email 格式無效" }, { status: 400 });

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM user_info WHERE email = ? LIMIT 1",
      [email],
    );
    return NextResponse.json({ exists: rows.length > 0 });
  } catch (error) {
    console.error("[Check Email Error]", error);
    return NextResponse.json({ error: "服務暫時無法使用" }, { status: 503 });
  }
}
