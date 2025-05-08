import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import type { RowDataPacket } from 'mysql2';

export async function POST(req: Request) {
  const { token, newPassword } = await req.json();

  if (!token || !newPassword) {
    return NextResponse.json({ error: '缺少必要資料' }, { status: 400 });
  }

  try {
    
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT email, expires_at FROM password_resets 
       WHERE token = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [token]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: '無效的重設連結' }, { status: 400 });
    }

    const reset = rows[0];
    const now = new Date();

    
    if (now > reset.expires_at) {
      return NextResponse.json({ error: '重設連結已過期，請重新申請' }, { status: 400 });
    }

    
    const passwordHash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE user_info SET password_hash = ? WHERE email = ?',
      [passwordHash, reset.email]
    );

    
    await pool.query('DELETE FROM password_resets WHERE token = ?', [token]);

    return NextResponse.json({ message: '密碼已成功更新' });
  } catch (err) {
    console.error('[Reset Password Error]', err);
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 });
  }
}