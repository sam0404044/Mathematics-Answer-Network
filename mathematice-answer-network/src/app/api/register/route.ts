import pool from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { cleanEmail, cleanText, positiveInteger, validPassword } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";

function optionalText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length > 0 && text.length <= max ? text : null;
}

function optionalGrade(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null;
  const gradeMap: Record<string, number> = {
    一年級: 1,
    二年級: 2,
    三年級: 3,
  };
  if (typeof value === "string" && value in gradeMap) return gradeMap[value];
  return positiveInteger(value, 12);
}

export async function POST(req: Request) {
  if (isRateLimited(req, "register", 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "註冊嘗試過於頻繁" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const username = cleanText(body?.userName, { min: 2, max: 50 });
  const email = cleanEmail(body?.userEmail);
  const password = body?.userPwd;
  const school = optionalText(body?.userSchool, 100);
  const grade = optionalGrade(body?.userGrade);
  const gender = optionalText(body?.userGender, 20);
  if (!username || !email || !validPassword(password)) {
    return NextResponse.json(
      { error: "請完整填寫資料；密碼需為 8–128 字元並包含英文及數字" },
      { status: 400 },
    );
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    await pool.query(
      `INSERT INTO user_info
         (username, email, password_hash, grade, school, gender, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [username, email, passwordHash, grade, school, gender],
    );
    return NextResponse.json({ message: "註冊成功" }, { status: 201 });
  } catch (error: unknown) {
    const code =
      typeof error === "object" && error && "code" in error
        ? String(error.code)
        : "";
    if (code === "ER_DUP_ENTRY") {
      return NextResponse.json({ error: "此 Email 已註冊" }, { status: 409 });
    }
    console.error("[Register Error]", error);
    return NextResponse.json({ error: "註冊服務暫時無法使用" }, { status: 503 });
  }
}
