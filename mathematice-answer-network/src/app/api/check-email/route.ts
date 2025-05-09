import pool from '@/lib/db';
import { NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';

export async function POST(req: Request) {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ exists: false });
  
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM user_info WHERE email = ?',
        [email]
    );
  
    return NextResponse.json({ exists: rows.length > 0 });
}