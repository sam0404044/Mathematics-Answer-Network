import pool from '../../../lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

// 抓到前端送來的資料
// export async function POST(req: Request) {
//     const { email, password, rememberMe } = await req.json();
//     console.log(email, password, rememberMe);

//     return NextResponse.json({ success: true });
// }

// 登入驗證

export async function POST(req: Request) {
    try {
        const { email, password, rememberMe } = await req.json();

        // 1. 欄位驗證，如果後端沒有收到完整資料則報錯
        if (!email || !password) {
            return NextResponse.json(
                { success: false, message: '請提供 email 與 password' },
                { status: 400 }
            );
        }

        // 2. 查資料庫：用參數化查詢防止 SQL 注入
        const [rows] = await pool.execute<
            {
                id: number;
                password_hash: string;
            }[]
        >('SELECT id, password_hash FROM your_table_name WHERE email = ?', [email]);
        if (rows.length === 0) {
            return NextResponse.json({ success: false, message: '使用者不存在' }, { status: 401 });
        }

        const user = rows[0];

        // 3. 驗證密碼（前端存的是明文，資料庫裡存的是 bcrypt-hash）
        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) {
            return NextResponse.json({ success: false, message: '密碼錯誤' }, { status: 401 });
        }

        // 4. 登入成功，這裡可以同時處理 rememberMe（設定長效 cookie…）
        return NextResponse.json({ success: true, userId: user.id, rememberMe }, { status: 200 });
    } catch (err: any) {
        console.error('[api/login] error:', err);
        return NextResponse.json({ success: false, message: '伺服器錯誤' }, { status: 500 });
    }
}
