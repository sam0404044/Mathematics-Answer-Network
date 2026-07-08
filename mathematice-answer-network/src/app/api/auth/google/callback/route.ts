import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { ResultSetHeader } from "mysql2";
import {
  createSessionToken,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";
import { cleanEmail } from "@/lib/validation";

function equalState(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export async function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const savedState = (await cookies()).get("google_oauth_state")?.value;
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI;

  if (!code || !state || !savedState || !equalState(state, savedState)) {
    return NextResponse.json({ error: "Google 授權狀態無效" }, { status: 400 });
  }
  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.json(
      { error: "Google 登入尚未設定" },
      { status: 503 },
    );
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });
    if (!tokenResponse.ok) throw new Error("Google token exchange failed");

    const tokenData = await tokenResponse.json();
    if (typeof tokenData.access_token !== "string") {
      throw new Error("Google access token missing");
    }

    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
        cache: "no-store",
      },
    );
    if (!userResponse.ok) throw new Error("Google user lookup failed");

    const userData = await userResponse.json();
    const email = cleanEmail(userData.email);
    const googleId =
      typeof userData.sub === "string" && userData.sub.length <= 255
        ? userData.sub
        : null;
    if (!email || !googleId) throw new Error("Invalid Google user data");

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO user_info (email, google_id, last_login)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE
         google_id = VALUES(google_id),
         last_login = NOW(),
         id = LAST_INSERT_ID(id)`,
      [email, googleId],
    );

    const response = NextResponse.redirect(new URL("/", req.url), 303);
    response.cookies.set(
      SESSION_COOKIE,
      createSessionToken({ method: "google", uid: result.insertId }),
      sessionCookieOptions(),
    );
    response.cookies.set("google_oauth_state", "", { path: "/", maxAge: 0 });
    return response;
  } catch (error) {
    console.error("[Google Login Error]", error);
    return NextResponse.json(
      { error: "Google 登入失敗，請稍後再試" },
      { status: 502 },
    );
  }
}
