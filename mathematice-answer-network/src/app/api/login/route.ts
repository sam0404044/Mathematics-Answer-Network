import pool from '../../../lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import type { RowDataPacket } from 'mysql2';

// 抓到前端送來的資料
// export async function POST(req: Request) {
//     const { email, password, rememberMe } = await req.json();

//     return NextResponse.json({ success: true });
// }

// 登入驗證

interface UserInfo extends RowDataPacket {
    email: string;
    password_hash: string;
}

export async function POST(req: Request) {
    const { email, password, rememberMe } = await req.json();
    // const info = await req.text();
    console.log(email, password, rememberMe);
    // console.log(info);

    // 1. 欄位驗證，如果後端沒有收到完整資料則報錯
    if (!email || !password) {
        return NextResponse.json(
            { success: false, message: '請提供 email 與 password' },
            { status: 400 }
        );
    }

    // 2. 查資料庫
    const [rows] = await pool.execute<UserInfo[]>(
        'SELECT email, password_hash FROM user_info WHERE email = ?',
        [email]
    );
    if (rows.length === 0) {
        return NextResponse.json({ success: false, message: '使用者不存在' }, { status: 401 });
    }

    const user = rows[0];

    // 3. 驗證密碼
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
        return NextResponse.json({ success: false, message: '密碼錯誤' }, { status: 401 });
    }

    // 4. 登入成功，這裡可以同時處理 rememberMe（設定長效 cookie…）
    return NextResponse.json(
        { success: true, userId: user.id, rememberMe, message: '登入成功' },
        { status: 200 }
    );
}
