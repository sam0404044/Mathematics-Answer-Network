import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import type { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';

// 登入驗證

// 宣告從資料庫抓到的資料型態
interface UserInfo extends RowDataPacket {
    email: string;
    password_hash: string;
}

export async function POST(req: Request) {
    // 接收前端傳來的資料
    const { email, password, rememberMe } = await req.json();

    // 如果後端沒有收到完整資料(email+密碼)則報錯
    if (!email || !password) {
        return NextResponse.json(
            { success: false, message: '請提供 email 與 password' },
            { status: 400 }
        );
    }

    // 資料庫查詢
    // 根據定義的UserInfo型別，告訴編譯器[rows]的內容必須至少包含一個字串型態的email和password_hash，否則報錯
    // 根據SQL指令，將相符結果存入[rows]這個物件陣列中
    const [rows] = await pool.execute<UserInfo[]>(
        // 使用接收到的email，查詢資料庫
        'SELECT id, email, password_hash FROM user_info WHERE email = ? LIMIT 1',
        [email]
    );

    // 如果陣列為空，則代表查無此使用者
    if (rows.length === 0) {
        return NextResponse.json({ success: false, message: '使用者不存在' }, { status: 401 });
    }

    const nowTime = new Date(Date.now());
    // 更新登入時間
    await pool.execute(
        `
        UPDATE user_info
        SET last_login = ?
        WHERE email = ?
      `,
        [nowTime, email]
    );

    // 若陣列不為空，將user設為陣列中的第一個元素(同一個帳號理應只有一筆資料)
    const user = rows[0];

    // 驗證密碼
    // 將使用者輸入的密碼經過轉碼去比對該使用者在資料庫中的密碼
    const valid = await bcrypt.compare(password, user.password_hash);
    // 如果驗證失敗則返回密碼錯誤
    if (!valid) {
        return NextResponse.json({ success: false, message: '密碼錯誤' }, { status: 401 });
    }

    const uid = user.id;

    // 導到首頁
    // cookie設定
    const res = NextResponse.redirect(new URL('/', req.url));

    // 加密
    const token = jwt.sign({ method: 'local', uid }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
    });

    res.cookies.set({
        name: 'login_data', // Cookie 名稱
        value: token, // 把uid轉成字串
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', //
        sameSite: 'strict',
        path: '/', // 全域生效
        // 如果勾「記住我」，設 30 天，否則關閉瀏覽器就清空
        ...(rememberMe
            ? { maxAge: 60 * 60 * 24 * 30 } // 30 天
            : {}),
    });

    return res;
}
