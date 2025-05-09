import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: '缺少 email 參數' }, { status: 400 });
    }

    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            'SELECT id FROM user_info WHERE email = ?',
            [email]
        );

        return NextResponse.json({ exists: rows.length > 0 });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[Check Email Error]', err.message);
        } else {
            console.error('[Check Email Error]', err);
        }

        return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
    }
}
