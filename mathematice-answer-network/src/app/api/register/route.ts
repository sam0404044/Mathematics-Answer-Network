import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import type { RowDataPacket } from 'mysql2';   


export async function POST(req: Request) {
    const {
        userName,
        userEmail,
        userPwd,
        userSchool,
        userGrade,
        userGender,
    } = await req.json();
  
    try {
        // 檢查是否已有相同 email
        const [rows]: any = await pool.query('SELECT id FROM user_info WHERE email = ?', [userEmail]);
        if (rows.length > 0) {
            return NextResponse.json({ error: '此 Email 已存在' }, { status: 400 });
        }
  
        // 密碼加密
        const passwordHash = await bcrypt.hash(userPwd, 10);
  
        // 寫入資料庫
        await pool.query(
            `INSERT INTO user_info 
            (username, email, password_hash, grade, school, gender, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userName, userEmail, passwordHash, userGrade, userSchool, userGender, 'pending']
        );
  
        return NextResponse.json({ message: '註冊成功' });
  
    } catch (err) {
            console.error(err);
            return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
    }
}