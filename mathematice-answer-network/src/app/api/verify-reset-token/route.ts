import { createHash } from "crypto";
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { RowDataPacket } from "mysql2";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  if (!/^[a-f0-9]{64}$/i.test(token)) {
    return NextResponse.json({ error: "驗證連結無效" }, { status: 400 });
  }
  const tokenHash = createHash("sha256").update(token).digest("hex");

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT expires_at FROM password_resets
       WHERE token = ? AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1`,
      [tokenHash],
    );
    if (!rows[0]) {
      return NextResponse.json({ error: "驗證連結無效或已過期" }, { status: 400 });
    }
    return NextResponse.json({ message: "驗證成功" });
  } catch (error) {
    console.error("[Verify Reset Token Error]", error);
    return NextResponse.json({ error: "服務暫時無法使用" }, { status: 503 });
  }
}
