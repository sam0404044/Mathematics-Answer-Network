import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
// import pool from '../../../../../lib/db';
// import type { RowDataPacket } from 'mysql2';

export async function GET(req: Request) {
    // 取得網址
    const url = new URL(req.url);
    // 取得網址中code=後續部分
    const code = url.searchParams.get('code')!;
    // 宣告從資料庫抓到的資料型態
    // interface UserInfo extends RowDataPacket {
    //     email: string;
    //     password_hash: string;
    //     google_id: string;
    // }

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
            throw new Error('交換token失敗');
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
            throw new Error('獲取使用者資訊失敗');
        }
        
        // 取得email跟googleId
        // const userData = await userResponse.json();
        // const email = userData.email;
        // const googleId = userData.sub;
        // const [rows] = await pool.execute<UserInfo[]>(
        //     'SELECT * FROM user_info WHERE google_id = ? LIMIT 1',
        //     [googleId]
        // );
        
        // 如果使用者不存在，創建新使用者
        // if (rows.length === 0) {
        //     await pool.execute(
        //         'INSERT INTO user_info (email, google_id) VALUES (?, ?)',
        //         [email, googleId]
        //     );
        // }


        // 使用next.js的crypto生成sessionToken
        const sessionToken = crypto.randomUUID(); 
        
        // 設置cookie
        // next.js中cookies()會返回一個Promise，需要使用await
        const cookieStore = await cookies();
        cookieStore.set({
            name: 'login session', // 名稱
            value: sessionToken, // 值
            httpOnly: true, // 安全設置
            secure: process.env.NODE_ENV === 'production', // 安全設置
            sameSite: 'strict', // 安全設置
            maxAge: 60 * 30, // 過期時間 : 30天
        });

        // 導到首頁
        // next.js 新版本需要使用await
        return NextResponse.redirect(new URL('/', req.url))

    // 如果驗證失敗
    } catch (error) {
        console.error('驗證失敗:', error);
        return NextResponse.json(
            // typescript中error默認為unknown，需要轉換
            { error: '失敗', message: (error as Error).message },
            { status: 400 }
        );
    }
}
