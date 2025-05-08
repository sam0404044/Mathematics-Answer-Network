import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export async function POST(req: Request) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: '請輸入電子信箱' }, { status: 400 });
    }

    try {
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);


        await pool.query('DELETE FROM password_resets WHERE email = ?', [email]);


        await pool.query(
            'INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)',
            [email, token, expiresAt]
        );

        const resetUrl = `${process.env.BASE_URL}/reset-password?token=${token}`;

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"數學答題王" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '重設密碼連結',
            html: `
                <p>親愛的用戶您好</p>
                <p>請點選下列網址，完成密碼重設的手續。</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>※此連結將在 15 分鐘後失效。※</p>
                <br>
                <p>如果您並沒有要求變更密碼，則可以忽略此電子郵件，並且您的密碼也不會改變。</p>
            `
        });

        return NextResponse.json({ message: '驗證信已寄出' });
    } catch (err) {
        console.error('[Send Reset Code Error]', err);
        
        // 若 nodemailer 拋出非 JSON 錯誤、或非預期格式，會更清楚顯示
        if (err instanceof Error) {
            return NextResponse.json({ error: err.message }, { status: 500 });
        }

        return NextResponse.json({ error: '伺服器錯誤（未知類型）' }, { status: 500 });
    }
}