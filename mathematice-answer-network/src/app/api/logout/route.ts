import { NextResponse } from "next/server";

export async function GET() {
  const res = NextResponse.json({ success: true });
  res.cookies.set({
    name: "login_data",
    value: "",
    maxAge: 0,
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res;
}
