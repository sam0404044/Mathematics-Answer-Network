import { createHash } from "crypto";
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { validPassword } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (isRateLimited(req, "reset-password", 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "請求過於頻繁" }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  if (!/^[a-f0-9]{64}$/i.test(token) || !validPassword(body?.newPassword)) {
    return NextResponse.json(
      { error: "驗證資料無效；密碼需包含英文與數字且至少 8 字元" },
      { status: 400 },
    );
  }
  const tokenHash = createHash("sha256").update(token).digest("hex");
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const [rows] = await connection.query<RowDataPacket[]>(
      `SELECT email FROM password_resets
       WHERE token = ? AND expires_at > NOW()
       ORDER BY created_at DESC LIMIT 1 FOR UPDATE`,
      [tokenHash],
    );
    if (!rows[0]) {
      await connection.rollback();
      return NextResponse.json({ error: "驗證連結無效或已過期" }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(body.newPassword, 12);
    await connection.query(
      "UPDATE user_info SET password_hash = ? WHERE email = ?",
      [passwordHash, rows[0].email],
    );
    await connection.query("DELETE FROM password_resets WHERE email = ?", [
      rows[0].email,
    ]);
    await connection.commit();
    return NextResponse.json({ message: "密碼已更新" });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("[Reset Password Error]", error);
    return NextResponse.json({ error: "服務暫時無法使用" }, { status: 503 });
  } finally {
    connection?.release();
  }
}
