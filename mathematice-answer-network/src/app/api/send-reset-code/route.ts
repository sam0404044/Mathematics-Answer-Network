import { createHash, randomBytes } from "crypto";
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import nodemailer from "nodemailer";
import type { RowDataPacket } from "mysql2";
import { cleanEmail } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(req: Request) {
  if (isRateLimited(req, "reset-email", 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "請求過於頻繁" }, { status: 429 });
  }
  const body = await req.json().catch(() => null);
  const email = cleanEmail(body?.email);
  if (!email) return NextResponse.json({ error: "Email 格式無效" }, { status: 400 });

  const { EMAIL_USER, EMAIL_PASS, BASE_URL } = process.env;
  if (!EMAIL_USER || !EMAIL_PASS || !BASE_URL) {
    return NextResponse.json({ error: "郵件服務尚未設定" }, { status: 503 });
  }

  try {
    const [users] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM user_info WHERE email = ? LIMIT 1",
      [email],
    );
    if (!users[0]) {
      return NextResponse.json({ message: "若帳號存在，重設信件將寄至信箱" });
    }

    const rawToken = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await pool.query("DELETE FROM password_resets WHERE email = ?", [email]);
    await pool.query(
      "INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)",
      [email, tokenHash, expiresAt],
    );

    const resetUrl = new URL("/reset-password", BASE_URL);
    resetUrl.searchParams.set("token", rawToken);
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });
    await transporter.sendMail({
      from: `"數學答題王" <${EMAIL_USER}>`,
      to: email,
      subject: "重設密碼",
      text: `請在 15 分鐘內開啟以下連結重設密碼：${resetUrl.toString()}`,
      html: `<p>請在 15 分鐘內開啟以下連結重設密碼：</p><p><a href="${resetUrl.toString()}">重設密碼</a></p>`,
    });
    return NextResponse.json({ message: "若帳號存在，重設信件將寄至信箱" });
  } catch (error) {
    console.error("[Send Reset Email Error]", error);
    return NextResponse.json({ error: "郵件服務暫時無法使用" }, { status: 503 });
  }
}
