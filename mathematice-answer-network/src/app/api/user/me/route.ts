import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const uid = cookieHeader
      .split(";")
      .map((cur) => cur.trim())
      .find((cur) => cur.startsWith("local_login="))
      ?.split("=")[1];

    console.log("UID from cookie:", uid);

    if (!uid) return NextResponse.json({ success: false });

    return NextResponse.json({ success: true, uid });
  } catch (error) {
    console.error("API /user/me failed:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
