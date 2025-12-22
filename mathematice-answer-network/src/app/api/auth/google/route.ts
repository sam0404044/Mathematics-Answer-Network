import { NextResponse } from "next/server";

export async function GET() {
  // 檢查環境變數
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REDIRECT_URI) {
    console.error('缺少 Google OAuth 環境變數');
    return NextResponse.json(
      { error: '伺服器配置錯誤', message: 'Google 登入功能未正確配置' },
      { status: 500 }
    );
  }

  const base = "https://accounts.google.com/o/oauth2/v2/auth";
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    prompt: "consent", // 強制每次都跳同意頁
  });
  return NextResponse.redirect(`${base}?${params}`);
}
