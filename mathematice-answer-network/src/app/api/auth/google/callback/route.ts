import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import type { ResultSetHeader } from 'mysql2';
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
    // 取得網址
    const url = new URL(req.url);
    // 取得網址中code=後續部分
    const code = url.searchParams.get('code');

    // 檢查是否有 code
    if (!code) {
        return NextResponse.json(
            { error: '缺少授權碼', message: 'Google 授權失敗，請重新嘗試' },
            { status: 400 }
        );
    }

    // 檢查環境變數
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REDIRECT_URI) {
        console.error('缺少 Google OAuth 環境變數');
        return NextResponse.json(
            { error: '伺服器配置錯誤', message: 'Google 登入功能未正確配置' },
            { status: 500 }
        );
    }

    // 給ResultSetHeader換個名字
    type ExecResult = ResultSetHeader;

    try {
        // 交換token
        // fetch google提供的端點
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            // headers為google要求格式
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // 將包含code在內的相關資訊POST給google
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
                grant_type: 'authorization_code',
            }),
        });

        // 如果交換token失敗，就中止後續程序執行
        if (!tokenResponse.ok) {
            const errorData = await tokenResponse.json().catch(() => ({}));
            console.error('Token exchange failed:', errorData);
            throw new Error(`交換token失敗: ${errorData.error || tokenResponse.statusText}`);
        }

        // 取得access token
        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // 跟google使用access token，獲取使用者資訊
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // 如果獲取使用者資訊失敗，就中止後續程序執行
        if (!userResponse.ok) {
            const errorData = await userResponse.json().catch(() => ({}));
            console.error('User info fetch failed:', errorData);
            throw new Error(`獲取使用者資訊失敗: ${errorData.error || userResponse.statusText}`);
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
        const res = NextResponse.redirect(new URL('/', req.url));
        // 加密
        const token = jwt.sign({ method: 'google', uid }, process.env.JWT_SECRET!, {
            expiresIn: '1h',
        });

        // cookie設定
        res.cookies.set({
            name: 'login_data', // Cookie 名稱
            value: token, // 把uid轉成字串
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/', // 全域生效
        });

        return res;

        // 如果驗證失敗
    } catch (error) {
        console.error('登入失敗:', error);
        return NextResponse.json(
            // typescript中error默認為unknown，需要轉換
            { error: '失敗', message: (error as Error).message },
            { status: 400 }
        );
    }
}
