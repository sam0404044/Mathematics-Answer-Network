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
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM user_info WHERE email = ?',
            [userEmail]
        );

        if (rows.length > 0) {
            return NextResponse.json({ error: '此 Email 已存在' }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(userPwd, 10);

        await pool.query(
            `INSERT INTO user_info 
            (username, email, password_hash, grade, school, gender, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [userName, userEmail, passwordHash, userGrade, userSchool, userGender, 'pending']
        );

        return NextResponse.json({ message: '註冊成功' });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[Register Error]', err.message);
        } else {
            console.error('[Register Unknown Error]', err);
        }
        
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
    }
}
