import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.json({ success: true });
  res.cookies.set({
    name: "local_login",
    value: "",
    maxAge: 0, // 立即過期
    path: "/",
  });
  return res;
}
