import { NextResponse } from "next/server";

export async function GET() {
  const base = "https://accounts.google.com/o/oauth2/v2/auth";
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: "openid email profile",
    prompt: "consent", // 強制每次都跳同意頁
  });
  return NextResponse.redirect(`${base}?${params}`);
}
