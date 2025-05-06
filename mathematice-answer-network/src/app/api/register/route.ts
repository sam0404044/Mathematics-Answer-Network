import pool from '../../../lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import type { RowDataPacket } from 'mysql2';    
    
// 根據SQL指令，將相符結果存入[rows]這個物件陣列中
const [rows] = await pool.execute<UserInfo[]>(
    // 使用接收到的email，查詢資料庫
    'SELECT email, password_hash FROM user_info WHERE email = ? LIMIT 1',
    [email]
);

// 如果陣列為空，則代表查無此使用者
if (rows.length === 0) {
    return NextResponse.json({ success: false, message: '使用者不存在' }, { status: 401 });
}

// 若陣列不為空，將user設為陣列中的第一個元素(同一個帳號理應只有一筆資料)
const user = rows[0];