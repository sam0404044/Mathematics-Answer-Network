import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import type { RowDataPacket } from 'mysql2';

export async function POST(req: Request) {
    const { token } = await req.json();

    if (!token) {
        return NextResponse.json({ error: '缺少驗證 token' }, { status: 400 });
    }

    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM password_resets 
            WHERE token = ? 
            ORDER BY created_at DESC 
            LIMIT 1`,
            [token]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: '無效的連結' }, { status: 400 });
        }

        const reset = rows[0];
        const now = new Date();
        const expiresAt = new Date(reset.expires_at); 

        if (now > expiresAt) {
        return NextResponse.json({ error: '連結已過期' }, { status: 400 });
        }

        return NextResponse.json({ message: 'token 驗證成功' });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('[Verify Token Error]', err.message);
        } else {
            console.error('[Verify Token Error]', err);
        }

        return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
    }
}
