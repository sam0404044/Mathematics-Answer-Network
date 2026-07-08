import pool from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";
import { cleanEmail } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";

interface UserInfo extends RowDataPacket {
  id: number;
  password_hash: string | null;
}

export async function POST(req: Request) {
  if (isRateLimited(req, "login", 10, 15 * 60 * 1000)) {
    return NextResponse.json(
      { success: false, message: "登入嘗試過於頻繁，請稍後再試" },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  const email = cleanEmail(body?.email);
  const password = typeof body?.password === "string" ? body.password : "";
  const rememberMe = body?.rememberMe === true;
  if (!email || !password || password.length > 128) {
    return NextResponse.json(
      { success: false, message: "請輸入有效的 Email 與密碼" },
      { status: 400 },
    );
  }

  try {
    const [rows] = await pool.execute<UserInfo[]>(
      "SELECT id, password_hash FROM user_info WHERE email = ? LIMIT 1",
      [email],
    );
    const user = rows[0];
    const valid =
      typeof user?.password_hash === "string" &&
      (await bcrypt.compare(password, user.password_hash));

    if (!valid) {
      return NextResponse.json(
        { success: false, message: "Email 或密碼錯誤" },
        { status: 401 },
      );
    }

    await pool.execute("UPDATE user_info SET last_login = NOW() WHERE id = ?", [
      user.id,
    ]);

    const token = createSessionToken(
      { method: "local", uid: user.id },
      rememberMe,
    );
    const response = NextResponse.redirect(new URL("/", req.url), 303);
    response.cookies.set(
      SESSION_COOKIE,
      token,
      sessionCookieOptions(rememberMe),
    );
    return response;
  } catch (error) {
    console.error("[Login Error]", error);
    return NextResponse.json(
      { success: false, message: "登入服務暫時無法使用" },
      { status: 503 },
    );
  }
}
