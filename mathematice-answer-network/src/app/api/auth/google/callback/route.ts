import { NextResponse } from "next/server";
import pool from "@/lib/db";
import type { ResultSetHeader } from "mysql2";

export async function GET(req: Request) {
    // 取得網址
    const url = new URL(req.url);
    // 取得網址中code=後續部分
    const code = url.searchParams.get("code")!;

    // 給ResultSetHeader換個名字
    type ExecResult = ResultSetHeader;

    try {
        // 交換token
        // fetch google提供的端點
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            // headers為google要求格式
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            // 將包含code在內的相關資訊POST給google
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
                grant_type: "authorization_code",
            }),
        });

        // 如果交換token失敗，就中止後續程序執行
        if (!tokenResponse.ok) {
            throw new Error("交換token失敗");
        }

        // 取得access token
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // 跟google使用access token，獲取使用者資訊
        const userResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // 如果獲取使用者資訊失敗，就中止後續程序執行
        if (!userResponse.ok) {
            throw new Error("獲取使用者資訊失敗");
        }

        // 取得email跟googleId
        const userData = await userResponse.json();
        const email = userData.email;
        const googleId = userData.sub;

        const nowTime = new Date(Date.now());

        const [result] = await pool.execute<ExecResult>(
            `
            INSERT INTO user_info (email, google_id, last_login)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
              google_id  = VALUES(google_id),
              last_login = VALUES(last_login),
              id = LAST_INSERT_ID(id)
            `,
            [email, googleId, nowTime]
        );

        // 得到被修改的那筆資料的流水號id
        const uid = result.insertId;

        // 導到首頁
        // cookie設定
        const res = NextResponse.redirect(new URL("/", req.url));
        const cookieValue = JSON.stringify({ method: "google", uid });

        // cookie設定
        res.cookies.set({
            name: "login_data", // Cookie 名稱
            value: cookieValue, // 把uid轉成字串
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", //
            sameSite: "strict",
            path: "/", // 全域生效
            // 不設定 maxAge，瀏覽器關閉就清空
        });

        return res;

        // 如果驗證失敗
    } catch (error) {
        console.error("登入失敗:", error);
        return NextResponse.json(
            // typescript中error默認為unknown，需要轉換
            { error: "失敗", message: (error as Error).message },
            { status: 400 }
        );
    }
}
